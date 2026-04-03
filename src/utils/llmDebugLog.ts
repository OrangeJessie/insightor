import { appendFileSync, mkdirSync } from 'fs'
import { join } from 'path'
import { inspect } from 'util'

let logFilePath: string | null = null
let enabled: boolean | null = null

function isEnabled(): boolean {
  if (enabled !== null) return enabled
  enabled =
    process.env.INSIGHTOR_DEBUG === '1' ||
    process.env.INSIGHTOR_DEBUG === 'true' ||
    process.argv.includes('--verbose-llm')
  return enabled
}

function getLogFile(): string {
  if (logFilePath) return logFilePath
  const dir = join(process.cwd(), '.insightor-debug')
  try {
    mkdirSync(dir, { recursive: true })
  } catch {}
  const ts = new Date().toISOString().replace(/[:.]/g, '-')
  logFilePath = join(dir, `llm-debug-${ts}.log`)
  return logFilePath
}

const SEPARATOR = '─'.repeat(80)
const THIN_SEP = '- '.repeat(40)

function write(entry: Record<string, unknown>) {
  if (!isEnabled()) return
  const time = new Date().toISOString()
  const event = entry.event as string
  let text = ''

  switch (event) {
    case 'turn':
      text = `\n${'═'.repeat(80)}\n` +
        `TURN #${entry.turn}  |  ${time}\n` +
        `${'═'.repeat(80)}\n` +
        `  Model:    ${entry.model}\n` +
        `  Messages: ${entry.message_count}\n` +
        `  Tools:    ${entry.tool_count}\n`
      break

    case 'llm_request':
      text = `\n${SEPARATOR}\n` +
        `>>> REQUEST → ${entry.provider}  |  ${time}\n` +
        `${SEPARATOR}\n` +
        `  Model: ${entry.model}\n` +
        `  Messages (${entry.message_count}):\n` +
        formatMessagesFull(entry.messages as unknown[]) +
        `  Tools (${entry.tool_count}): ${(entry.tool_names as string[]).join(', ')}\n` +
        `  Tools (full):\n${indent(formatDebugValue(entry.tools_raw), 4)}\n` +
        `${THIN_SEP}\n` +
        `  System Prompt:\n${indent(formatDebugValue(entry.system_prompt), 4)}\n` +
        formatRequestExtras(entry.request_extras)
      break

    case 'llm_response':
      text = `\n${SEPARATOR}\n` +
        `<<< RESPONSE ← ${entry.provider}  |  ${time}\n` +
        `${SEPARATOR}\n` +
        `  Model: ${entry.model ?? '?'}\n` +
        `  Stop Reason: ${entry.stop_reason ?? '?'}\n` +
        `  Content:\n${indent(String(entry.content_full), 4)}\n`
      if (entry.usage) {
        const u = entry.usage as any
        text += `  Usage: input=${u.input_tokens ?? '?'} output=${u.output_tokens ?? '?'}\n`
      }
      break

    case 'tool_call':
      text = `\n  🔧 TOOL CALL: ${entry.tool}  |  ${time}\n` +
        `     Input:\n${indent(String(entry.input), 8)}\n`
      break

    case 'tool_result':
      text = `  ✅ TOOL RESULT: ${entry.tool}  (${entry.duration_ms}ms)  |  ${time}\n` +
        `     Output:\n${indent(String(entry.result), 8)}\n`
      break

    case 'info':
      text = `  ℹ️  ${entry.msg}`
      const rest = { ...entry }
      delete rest.event
      delete rest.msg
      if (Object.keys(rest).length > 0) {
        text +=
          '  ' +
          Object.entries(rest)
            .map(([k, v]) => `${k}=${formatDebugValue(v)}`)
            .join('  ')
      }
      text += `  |  ${time}\n`
      break

    default:
      text = `[${event}] ${formatDebugValue(entry)}  |  ${time}\n`
  }

  try {
    appendFileSync(getLogFile(), text)
  } catch {}
  if (process.env.INSIGHTOR_DEBUG_STDERR === '1') {
    process.stderr.write(text)
  }
}

function indent(s: string, n: number): string {
  const pad = ' '.repeat(n)
  return s.split('\n').map(line => pad + line).join('\n')
}

function formatRequestExtras(extras: unknown): string {
  if (extras == null || typeof extras !== 'object') return ''
  const keys = Object.keys(extras as object)
  if (keys.length === 0) return ''
  return `${THIN_SEP}\n  Request extras:\n${indent(formatDebugValue(extras), 4)}\n`
}

/** Full serialization for debug logs (no length limits). */
export function formatDebugValue(val: unknown): string {
  if (val === null || val === undefined) return ''
  if (typeof val === 'string') return val
  if (
    typeof val === 'number' ||
    typeof val === 'boolean' ||
    typeof val === 'bigint'
  ) {
    return String(val)
  }
  if (val instanceof Error) {
    return val.stack ?? val.message
  }
  try {
    return JSON.stringify(val, null, 2)
  } catch {
    try {
      return inspect(val, {
        depth: null,
        maxArrayLength: null,
        maxStringLength: null,
        breakLength: 120,
      })
    } catch {
      return String(val)
    }
  }
}

function formatMessagesFull(messages: unknown[]): string {
  if (!Array.isArray(messages) || messages.length === 0) {
    return '    (empty)\n'
  }
  const parts: string[] = []
  for (let i = 0; i < messages.length; i++) {
    const m = messages[i] as any
    const role = m.role ?? m.type ?? '?'
    const content = m.content ?? m.message?.content
    let body: string
    if (typeof content === 'string') {
      body = content
    } else if (Array.isArray(content)) {
      body = content
        .map((block: any, bi: number) => {
          const t = block?.type
          if (t === 'text') return `(block ${bi} text)\n${block.text ?? ''}`
          if (t === 'image_url') return `(block ${bi} image_url)\n${formatDebugValue(block)}`
          if (t === 'tool_use') {
            return `(block ${bi} tool_use ${block.name})\n${formatDebugValue(block.input)}`
          }
          if (t === 'tool_result') {
            const c = block.content
            const inner =
              typeof c === 'string' ? c : formatDebugValue(c)
            return `(block ${bi} tool_result id=${block.tool_use_id})\n${inner}`
          }
          if (t === 'thinking') {
            return `(block ${bi} thinking)\n${block.thinking ?? ''}`
          }
          return `(block ${bi} ${t ?? '?'})\n${formatDebugValue(block)}`
        })
        .join('\n\n')
    } else if (content != null && typeof content === 'object') {
      body = formatDebugValue(content)
    } else {
      body = formatDebugValue(content)
    }
    parts.push(`    [${i}] ${role}:\n${indent(body, 6)}`)
  }
  return parts.join('\n\n') + '\n'
}

export function llmDebugRequest(provider: string, data: {
  model?: string
  systemPrompt?: unknown
  messages?: unknown[]
  tools?: unknown[]
  [key: string]: unknown
}) {
  if (!isEnabled()) return
  const {
    model,
    systemPrompt,
    messages,
    tools,
    ...requestExtras
  } = data as Record<string, unknown>
  write({
    event: 'llm_request',
    provider,
    model,
    system_prompt: systemPrompt,
    messages: (messages as unknown[]) ?? [],
    message_count: Array.isArray(messages) ? messages.length : 0,
    tool_names: Array.isArray(tools)
      ? tools.map((t: any) => t.name ?? t.function?.name ?? '?')
      : [],
    tool_count: Array.isArray(tools) ? tools.length : 0,
    tools_raw: Array.isArray(tools) ? tools : [],
    request_extras:
      Object.keys(requestExtras).length > 0 ? requestExtras : undefined,
  })
}

export function llmDebugResponse(provider: string, data: {
  content?: unknown
  stopReason?: string
  usage?: unknown
  model?: string
}) {
  if (!isEnabled()) return
  const content = data.content
  let contentFull: string
  if (typeof content === 'string') {
    contentFull = content
  } else if (Array.isArray(content)) {
    contentFull = content
      .map((block: any, bi: number) => {
        if (block.type === 'text') return `(block ${bi} text)\n${block.text ?? ''}`
        if (block.type === 'tool_use') {
          return `(block ${bi} tool_use ${block.name})\n${formatDebugValue(block.input)}`
        }
        if (block.type === 'thinking') {
          return `(block ${bi} thinking)\n${block.thinking ?? ''}`
        }
        return `(block ${bi} ${block.type})\n${formatDebugValue(block)}`
      })
      .join('\n\n---\n\n')
  } else {
    contentFull = formatDebugValue(content)
  }
  write({
    event: 'llm_response',
    provider,
    model: data.model,
    content_full: contentFull,
    stop_reason: data.stopReason,
    usage: data.usage,
  })
}

export function llmDebugToolCall(toolName: string, input: unknown) {
  if (!isEnabled()) return
  write({
    event: 'tool_call',
    tool: toolName,
    input: formatDebugValue(input),
  })
}

export function llmDebugToolResult(toolName: string, durationMs: number, result: unknown) {
  if (!isEnabled()) return
  write({
    event: 'tool_result',
    tool: toolName,
    duration_ms: durationMs,
    result: formatDebugValue(result),
  })
}

export function llmDebugTurn(turnIndex: number, data: Record<string, unknown>) {
  if (!isEnabled()) return
  write({
    event: 'turn',
    turn: turnIndex,
    ...data,
  })
}

export function llmDebugInfo(msg: string, data?: Record<string, unknown>) {
  if (!isEnabled()) return
  write({ event: 'info', msg, ...data })
}
