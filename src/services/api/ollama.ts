import { randomUUID } from 'crypto'
import OpenAI from 'openai'
import type { ChatCompletionChunk, ChatCompletionMessageParam, ChatCompletionTool } from 'openai/resources/chat/completions.mjs'
import type { Tools } from '../../Tool.js'
import type {
  AssistantMessage,
  Message,
  MessageContent,
  StreamEvent,
  SystemAPIErrorMessage,
} from '../../types/message.js'
import type { SystemPrompt } from '../../utils/systemPromptType.js'
import type { ThinkingConfig } from '../../utils/thinking.js'
import type { Options } from './claude.js'
import { getOllamaBaseUrl, getOllamaModel } from '../../utils/model/providers.js'
import { zodToJsonSchema } from '../../utils/zodToJsonSchema.js'

// ---------------------------------------------------------------------------
// Message conversion: insightor Message[] → OpenAI ChatCompletionMessageParam[]
// ---------------------------------------------------------------------------

function convertMessages(
  messages: Message[],
  systemPrompt: SystemPrompt,
): ChatCompletionMessageParam[] {
  const out: ChatCompletionMessageParam[] = []

  // system prompt — append /no_think when OLLAMA_DISABLE_THINKING is set
  const disableThinking = process.env.OLLAMA_DISABLE_THINKING === '1'
  const systemText = systemPrompt.join('\n\n')
  const systemContent = disableThinking
    ? (systemText ? `${systemText}\n\n/no_think` : '/no_think')
    : systemText
  if (systemContent) {
    out.push({ role: 'system', content: systemContent })
  }

  for (const msg of messages) {
    if (msg.type === 'user') {
      const content = stringifyContent(msg.message?.content)
      if (content) {
        out.push({ role: 'user', content })
      }
    } else if (msg.type === 'assistant') {
      const contentArr = Array.isArray(msg.message?.content)
        ? (msg.message!.content as Array<{ type: string; [key: string]: unknown }>)
        : []

      const textParts: string[] = []
      const toolCalls: OpenAI.Chat.ChatCompletionMessageParam extends { tool_calls?: infer T } ? NonNullable<T> extends Array<infer U> ? U[] : never : never = []

      for (const block of contentArr) {
        if (block.type === 'text' && typeof block.text === 'string') {
          textParts.push(block.text)
        } else if (block.type === 'tool_use') {
          toolCalls.push({
            id: (block.id as string) || randomUUID(),
            type: 'function' as const,
            function: {
              name: block.name as string,
              arguments: typeof block.input === 'string'
                ? block.input
                : JSON.stringify(block.input ?? {}),
            },
          })
        }
      }

      if (toolCalls.length > 0) {
        out.push({
          role: 'assistant',
          content: textParts.join('') || null,
          tool_calls: toolCalls,
        })
      } else {
        const plain = textParts.join('') || stringifyContent(msg.message?.content)
        out.push({ role: 'assistant', content: plain || '' })
      }
    } else if (msg.type === 'system') {
      continue
    }

    // Handle tool_result blocks embedded in user messages
    if (msg.type === 'user' && Array.isArray(msg.message?.content)) {
      const blocks = msg.message!.content as Array<{ type: string; [key: string]: unknown }>
      for (const block of blocks) {
        if (block.type === 'tool_result') {
          const resultContent = typeof block.content === 'string'
            ? block.content
            : Array.isArray(block.content)
              ? (block.content as Array<{ type: string; text?: string }>)
                  .filter(b => b.type === 'text')
                  .map(b => b.text)
                  .join('\n')
              : JSON.stringify(block.content ?? '')
          out.push({
            role: 'tool',
            tool_call_id: block.tool_use_id as string,
            content: resultContent,
          })
        }
      }
    }
  }

  return out
}

function stringifyContent(content: MessageContent | undefined): string {
  if (!content) return ''
  if (typeof content === 'string') return content
  if (Array.isArray(content)) {
    return content
      .map((b: { type: string; text?: string; [key: string]: unknown }) => {
        if (b.type === 'text' && typeof b.text === 'string') return b.text
        return ''
      })
      .join('')
  }
  return ''
}

// ---------------------------------------------------------------------------
// Tool conversion: insightor Tools → OpenAI ChatCompletionTool[]
// ---------------------------------------------------------------------------

const OLLAMA_CORE_TOOLS = new Set([
  'Bash', 'Read', 'Edit', 'Write', 'Glob', 'Grep',
  'WebFetch', 'WebSearch', 'TodoWrite', 'AskUserQuestion',
])

function shouldIncludeTool(tool: { name: string }): boolean {
  const allowlist = process.env.OLLAMA_TOOLS
  if (allowlist) {
    const names = new Set(allowlist.split(',').map(s => s.trim()))
    return names.has(tool.name)
  }
  if (process.env.OLLAMA_ALL_TOOLS === '1') {
    return true
  }
  return OLLAMA_CORE_TOOLS.has(tool.name)
}

async function convertTools(tools: Tools): Promise<ChatCompletionTool[]> {
  const result: ChatCompletionTool[] = []
  for (const tool of tools) {
    if (!shouldIncludeTool(tool)) continue
    try {
      const description = await tool.prompt({
        getToolPermissionContext: async () => ({} as any),
        tools,
        agents: [],
        allowedAgentTypes: undefined,
      })

      const inputSchema = ('inputJSONSchema' in tool && tool.inputJSONSchema)
        ? tool.inputJSONSchema
        : zodToJsonSchema(tool.inputSchema)

      result.push({
        type: 'function',
        function: {
          name: tool.name,
          description: typeof description === 'string' ? description : String(description || ''),
          parameters: inputSchema as Record<string, unknown>,
        },
      })
    } catch {
      // skip tools that fail schema/prompt resolution
    }
  }
  return result
}

// ---------------------------------------------------------------------------
// Streaming adapter
// ---------------------------------------------------------------------------

export async function* queryOllamaWithStreaming({
  messages,
  systemPrompt,
  tools,
  signal,
  options,
}: {
  messages: Message[]
  systemPrompt: SystemPrompt
  thinkingConfig: ThinkingConfig
  tools: Tools
  signal: AbortSignal
  options: Options
}): AsyncGenerator<StreamEvent | AssistantMessage | SystemAPIErrorMessage, void> {
  const baseURL = getOllamaBaseUrl()
  const model = options.model || getOllamaModel()

  const client = new OpenAI({
    baseURL: `${baseURL}/v1`,
    apiKey: 'ollama',
  })

  const openaiMessages = convertMessages(messages, systemPrompt)
  const openaiTools = await convertTools(tools)

  // >>> INSIGHTOR DEBUG: log Ollama request
  {
    const { llmDebugRequest } = await import('src/utils/llmDebugLog.js')
    llmDebugRequest('ollama', {
      model,
      systemPrompt,
      messages: openaiMessages as unknown[],
      tools: openaiTools as unknown[],
      baseURL,
    })
  }

  // Accumulation state
  let textContent = ''
  const toolCallAccum: Map<number, {
    id: string
    name: string
    arguments: string
  }> = new Map()

  try {
    const streamParams: OpenAI.Chat.ChatCompletionCreateParamsStreaming = {
      model,
      messages: openaiMessages,
      stream: true,
      ...(openaiTools.length > 0 && { tools: openaiTools }),
    }

    const stream = await client.chat.completions.create(streamParams, {
      signal,
    })

    for await (const chunk of stream as AsyncIterable<ChatCompletionChunk>) {
      if (signal.aborted) break

      const choice = chunk.choices?.[0]
      if (!choice) continue
      const delta = choice.delta

      // Accumulate text
      if (delta?.content) {
        textContent += delta.content
        yield {
          type: 'stream_event',
          event: {
            type: 'content_block_delta',
            index: 0,
            delta: { type: 'text_delta', text: delta.content },
          },
        } as StreamEvent
      }

      // Accumulate tool calls
      if (delta?.tool_calls) {
        for (const tc of delta.tool_calls) {
          const idx = tc.index ?? 0
          if (!toolCallAccum.has(idx)) {
            toolCallAccum.set(idx, {
              id: tc.id || randomUUID(),
              name: tc.function?.name || '',
              arguments: '',
            })
          }
          const acc = toolCallAccum.get(idx)!
          if (tc.function?.name) acc.name = tc.function.name
          if (tc.function?.arguments) acc.arguments += tc.function.arguments
        }
      }

      // When choice finishes, yield the assembled messages
      if (choice.finish_reason) {
        // >>> INSIGHTOR DEBUG: log Ollama response
        {
          const { llmDebugResponse, llmDebugInfo } = await import('src/utils/llmDebugLog.js')
          llmDebugResponse('ollama', {
            content: textContent,
            stopReason: choice.finish_reason,
            usage: chunk.usage,
            model,
          })
          if (toolCallAccum.size > 0) {
            llmDebugInfo('ollama_tool_calls', {
              tools: [...toolCallAccum.values()].map(tc => ({ name: tc.name, args_length: tc.arguments.length })),
            })
          }
        }

        // Yield text block as AssistantMessage
        if (textContent) {
          yield {
            type: 'assistant',
            uuid: randomUUID(),
            timestamp: new Date().toISOString(),
            message: {
              role: 'assistant',
              id: chunk.id || randomUUID(),
              content: [{ type: 'text', text: textContent }],
              model,
              stop_reason: mapFinishReason(choice.finish_reason),
              usage: mapUsage(chunk.usage),
            },
          } as AssistantMessage
          textContent = ''
        }

        // Yield each tool call as a separate AssistantMessage
        for (const [, tc] of toolCallAccum) {
          let parsedInput: unknown
          try {
            parsedInput = JSON.parse(tc.arguments || '{}')
          } catch {
            parsedInput = tc.arguments || '{}'
          }

          yield {
            type: 'assistant',
            uuid: randomUUID(),
            timestamp: new Date().toISOString(),
            message: {
              role: 'assistant',
              id: chunk.id || randomUUID(),
              content: [{
                type: 'tool_use',
                id: tc.id,
                name: tc.name,
                input: parsedInput,
              }],
              model,
              stop_reason: 'tool_use',
              usage: mapUsage(chunk.usage),
            },
          } as AssistantMessage
        }
      }
    }

    // If stream ended without a finish_reason but we have accumulated content
    if (textContent && toolCallAccum.size === 0) {
      yield {
        type: 'assistant',
        uuid: randomUUID(),
        timestamp: new Date().toISOString(),
        message: {
          role: 'assistant',
          id: randomUUID(),
          content: [{ type: 'text', text: textContent }],
          model,
          stop_reason: 'end_turn',
          usage: { input_tokens: 0, output_tokens: 0, cache_creation_input_tokens: 0, cache_read_input_tokens: 0 },
        },
      } as AssistantMessage
    }
  } catch (error: unknown) {
    const errMsg = error instanceof Error ? error.message : String(error)
    yield {
      type: 'assistant',
      uuid: randomUUID(),
      timestamp: new Date().toISOString(),
      apiError: 'unknown',
      message: {
        role: 'assistant',
        id: randomUUID(),
        content: [{ type: 'text', text: `Ollama API error: ${errMsg}` }],
        model,
        stop_reason: 'end_turn',
        usage: { input_tokens: 0, output_tokens: 0, cache_creation_input_tokens: 0, cache_read_input_tokens: 0 },
      },
    } as AssistantMessage
  }
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function mapFinishReason(reason: string | null): string {
  switch (reason) {
    case 'stop': return 'end_turn'
    case 'tool_calls': return 'tool_use'
    case 'length': return 'max_tokens'
    default: return 'end_turn'
  }
}

function mapUsage(usage?: OpenAI.CompletionUsage | null) {
  return {
    input_tokens: usage?.prompt_tokens ?? 0,
    output_tokens: usage?.completion_tokens ?? 0,
    cache_creation_input_tokens: 0,
    cache_read_input_tokens: 0,
  }
}
