import { appendFileSync, mkdirSync } from 'fs'
import { join } from 'path'

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
        formatMessages(entry.messages as any[]) +
        `  Tools (${entry.tool_count}): ${(entry.tool_names as string[]).join(', ')}\n` +
        `${THIN_SEP}\n` +
        `  System Prompt:\n${indent(String(entry.system_prompt), 4)}\n`
      break

    case 'llm_response':
      text = `\n${SEPARATOR}\n` +
        `<<< RESPONSE ← ${entry.provider}  |  ${time}\n` +
        `${SEPARATOR}\n` +
        `  Model: ${entry.model ?? '?'}\n` +
        `  Stop Reason: ${entry.stop_reason ?? '?'}\n` +
        `  Content:\n${indent(String(entry.content_summary), 4)}\n`
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
        text += '  ' + Object.entries(rest).map(([k, v]) => `${k}=${JSON.stringify(v)}`).join('  ')
      }
      text += `  |  ${time}\n`
      break

    default:
      text = `[${event}] ${JSON.stringify(entry)}  |  ${time}\n`
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

function formatMessages(messages: any[]): string {
  if (!Array.isArray(messages) || messages.length === 0) return '    (empty)\n'
  return messages.map((m, i) => {
    const role = m.role ?? '?'
    const summary = m.summary ?? ''
    return `    [${i}] ${role}: ${summary}`
  }).join('\n') + '\n'
}

function truncate(val: unknown, maxLen = 2000): string {
  const s = typeof val === 'string' ? val : JSON.stringify(val)
  if (!s) return ''
  return s.length > maxLen ? s.slice(0, maxLen) + `...(truncated, total ${s.length})` : s
}

function summarizeMessages(messages: unknown[]): unknown[] {
  if (!Array.isArray(messages)) return []
  return messages.map((m: any) => {
    const role = m.role ?? m.type ?? 'unknown'
    const content = m.content ?? m.message?.content
    let summary: string
    if (typeof content === 'string') {
      summary = truncate(content, 500)
    } else if (Array.isArray(content)) {
      summary = content.map((block: any) => {
        if (block.type === 'text') return truncate(block.text, 300)
        if (block.type === 'tool_use') return `[tool_use: ${block.name}(${truncate(JSON.stringify(block.input), 200)})]`
        if (block.type === 'tool_result') return `[tool_result: ${block.tool_use_id} → ${truncate(block.content, 200)}]`
        if (block.type === 'thinking') return `[thinking: ${truncate(block.thinking, 200)}]`
        return `[${block.type}]`
      }).join(' | ')
    } else {
      summary = truncate(content, 300)
    }
    return { role, summary }
  })
}

export function llmDebugRequest(provider: string, data: {
  model?: string
  systemPrompt?: unknown
  messages?: unknown[]
  tools?: unknown[]
  [key: string]: unknown
}) {
  if (!isEnabled()) return
  write({
    event: 'llm_request',
    provider,
    model: data.model,
    system_prompt: truncate(data.systemPrompt, 3000),
    messages: summarizeMessages(data.messages ?? []),
    message_count: data.messages?.length ?? 0,
    tool_names: Array.isArray(data.tools)
      ? data.tools.map((t: any) => t.name ?? t.function?.name ?? '?')
      : [],
    tool_count: data.tools?.length ?? 0,
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
  let summary: string
  if (typeof content === 'string') {
    summary = truncate(content, 3000)
  } else if (Array.isArray(content)) {
    summary = content.map((block: any) => {
      if (block.type === 'text') return truncate(block.text, 1000)
      if (block.type === 'tool_use') return `[tool_use: ${block.name}(${truncate(JSON.stringify(block.input), 500)})]`
      if (block.type === 'thinking') return `[thinking: ${truncate(block.thinking, 500)}]`
      return `[${block.type}]`
    }).join(' | ')
  } else {
    summary = truncate(content, 1000)
  }
  write({
    event: 'llm_response',
    provider,
    model: data.model,
    content_summary: summary,
    stop_reason: data.stopReason,
    usage: data.usage,
  })
}

export function llmDebugToolCall(toolName: string, input: unknown) {
  if (!isEnabled()) return
  write({
    event: 'tool_call',
    tool: toolName,
    input: truncate(input, 3000),
  })
}

export function llmDebugToolResult(toolName: string, durationMs: number, result: unknown) {
  if (!isEnabled()) return
  write({
    event: 'tool_result',
    tool: toolName,
    duration_ms: durationMs,
    result: truncate(result, 3000),
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
