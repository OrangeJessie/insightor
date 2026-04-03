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

/** Full system prompt + unclipped assistant/tool lines in log. */
function isVerboseDebug(): boolean {
  return (
    process.env.INSIGHTOR_DEBUG_VERBOSE === '1' ||
    process.env.INSIGHTOR_DEBUG_VERBOSE === 'true'
  )
}

/** Optional: only log message index (char counts), not bodies — huge sessions. */
function omitMessageBodies(): boolean {
  return (
    process.env.INSIGHTOR_DEBUG_OMIT_MESSAGE_BODIES === '1' ||
    process.env.INSIGHTOR_DEBUG_OMIT_MESSAGE_BODIES === 'true'
  )
}

const MAX_ASSISTANT_LOG = 24_000
const MAX_TOOL_IO_LOG = 96_000

function getMaxAssistant(): number {
  return isVerboseDebug() ? Number.MAX_SAFE_INTEGER : MAX_ASSISTANT_LOG
}

function getMaxToolIo(): number {
  return isVerboseDebug() ? Number.MAX_SAFE_INTEGER : MAX_TOOL_IO_LOG
}

function clipForLog(s: string, max: number): string {
  if (max === Number.MAX_SAFE_INTEGER || s.length <= max) return s
  return (
    s.slice(0, max) +
    `\n... [truncated at ${max} chars, total ${s.length}; INSIGHTOR_DEBUG_VERBOSE=1 removes this cap]`
  )
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
        `  Model: ${entry.model}  |  prior messages: ${entry.message_count}  |  tools registered: ${entry.tool_count}\n`
      break

    case 'llm_request': {
      const sysRaw = formatDebugValue(entry.system_prompt)
      const msgs = entry.messages as unknown[]
      const msgSection = omitMessageBodies()
        ? `  Messages (index only — unset INSIGHTOR_DEBUG_OMIT_MESSAGE_BODIES to log full conversation memory):\n${summarizeMessagesIndex(msgs)}`
        : `  Conversation memory — full messages (${entry.message_count}) as sent to the model:\n${formatMessagesFull(msgs)}`
      const sysSection = isVerboseDebug()
        ? `  System / policy (full):\n${indent(sysRaw, 4)}\n`
        : `  System / policy (static): [omitted ${sysRaw.length} chars — INSIGHTOR_DEBUG_VERBOSE=1 for full]\n`
      text = `\n${SEPARATOR}\n` +
        `>>> REQUEST → ${entry.provider}  |  ${time}\n` +
        `${SEPARATOR}\n` +
        `  Model: ${entry.model}\n` +
        msgSection +
        `\n${THIN_SEP}\n` +
        sysSection +
        `  Tools registered (names): ${(entry.tool_names as string[]).join(', ') || '(none)'} (${entry.tool_count})\n` +
        formatRequestExtras(entry.request_extras)
      break
    }

    case 'llm_response':
      text = `\n${SEPARATOR}\n` +
        `<<< LLM REPLY  ← ${entry.provider}  |  ${time}\n` +
        `${SEPARATOR}\n` +
        `  Model: ${entry.model ?? '?'}\n` +
        `  Stop: ${entry.stop_reason ?? '?'}\n` +
        `  Output:\n${indent(clipForLog(String(entry.content_full), getMaxAssistant()), 4)}\n`
      if (entry.usage) {
        const u = entry.usage as any
        text += `  Usage: in=${u.input_tokens ?? '?'} out=${u.output_tokens ?? '?'}\n`
      }
      break

    case 'tool_call':
      text = `\n${SEPARATOR}\n` +
        `  TOOL CALL: ${entry.tool}  |  ${time}\n` +
        `  Input:\n${indent(clipForLog(String(entry.input), getMaxToolIo()), 4)}\n`
      break

    case 'tool_result':
      text = `${SEPARATOR}\n` +
        `  TOOL RESULT: ${entry.tool}  (${entry.duration_ms}ms)  |  ${time}\n` +
        `  Output:\n${indent(clipForLog(String(entry.result), getMaxToolIo()), 4)}\n`
      break

    case 'info':
      text = `  ℹ️  ${entry.msg}`
      const rest = { ...entry }
      delete rest.event
      delete rest.msg
      if (Object.keys(rest).length > 0) {
        const cap = isVerboseDebug() ? Number.MAX_SAFE_INTEGER : 4_000
        text +=
          '  ' +
          Object.entries(rest)
            .map(([k, v]) => `${k}=${clipForLog(formatDebugValue(v), cap)}`)
            .join('  ')
      }
      text += `  |  ${time}\n`
      break

    default:
      text = `[${event}] ${clipForLog(formatDebugValue(entry), 8_000)}  |  ${time}\n`
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
  if (isVerboseDebug()) {
    return `${THIN_SEP}\n  Request extras:\n${indent(formatDebugValue(extras), 4)}\n`
  }
  const parts = keys.map(k => {
    const v = (extras as Record<string, unknown>)[k]
    if (v !== null && typeof v === 'object') {
      const ser = formatDebugValue(v)
      return `${k}=<${ser.length} chars>`
    }
    const s = String(v)
    return `${k}=${s.length > 80 ? `${s.slice(0, 80)}…` : s}`
  })
  return `  Extras: ${parts.join(' | ')}\n`
}

/** Full serialization (internal / verbose). */
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

function summarizeArrayTextPartsLen(c: unknown): number {
  if (!Array.isArray(c)) return 0
  let n = 0
  for (const b of c as Array<{ type?: string; text?: string }>) {
    if (b?.type === 'text' && typeof b.text === 'string') n += b.text.length
  }
  return n
}

function summarizeContentBlocks(content: unknown): string {
  if (typeof content === 'string') {
    return `${content.length} chars (omitted)`
  }
  if (!Array.isArray(content)) {
    const s = formatDebugValue(content)
    return s.length > 300 ? `${s.length} chars serialized (omitted)` : s
  }
  const names: string[] = []
  let textChars = 0
  let toolResults = 0
  for (const block of content as Array<{ type?: string; name?: string; text?: string }>) {
    const t = block?.type
    if (t === 'text' && typeof block.text === 'string') textChars += block.text.length
    else if (t === 'tool_use') names.push(String(block.name ?? '?'))
    else if (t === 'tool_result') toolResults++
  }
  const bits: string[] = []
  if (textChars) bits.push(`text ${textChars} chars`)
  if (names.length) bits.push(`tool_use: ${names.join(', ')}`)
  if (toolResults) bits.push(`tool_result ×${toolResults}`)
  return bits.length ? bits.join('; ') : 'empty'
}

function summarizeOneMessageForLog(m: unknown, index: number): string {
  if (m == null || typeof m !== 'object') return `[${index}] ?`
  const o = m as Record<string, unknown>

  if (typeof o.type === 'string' && o.message && typeof o.message === 'object') {
    const msg = o.message as Record<string, unknown>
    const t = o.type
    const c = msg.content
    if (t === 'user') return `[${index}] user — ${summarizeContentBlocks(c)}`
    if (t === 'assistant') return `[${index}] assistant — ${summarizeContentBlocks(c)}`
    return `[${index}] ${t}`
  }

  if (typeof o.role === 'string') {
    const role = o.role
    if (role === 'tool') {
      const id = String(o.tool_call_id ?? '')
      const body = typeof o.content === 'string' ? o.content.length : 0
      return `[${index}] tool — id ${id.slice(0, 12)}${id.length > 12 ? '…' : ''}, ${body} chars (omitted)`
    }
    if (role === 'assistant') {
      const tc = o.tool_calls as Array<{ function?: { name?: string } }> | undefined
      const tnames = Array.isArray(tc)
        ? tc.map(x => x.function?.name).filter(Boolean).join(', ')
        : ''
      const c = o.content
      const tlen =
        typeof c === 'string' ? c.length : summarizeArrayTextPartsLen(c)
      if (tnames) {
        return `[${index}] assistant — tool_calls: ${tnames}` +
          (tlen ? `; text ${tlen} chars` : '')
      }
      return `[${index}] assistant — text ${tlen} chars (omitted)`
    }
    if (role === 'user' || role === 'system') {
      const c = o.content
      const lab = role === 'system' ? 'system' : 'user'
      if (typeof c === 'string') {
        return `[${index}] ${lab} — ${c.length} chars (omitted)`
      }
      return `[${index}] ${lab} — ${summarizeContentBlocks(c)}`
    }
  }

  return `[${index}] (unknown shape)`
}

function summarizeMessagesIndex(messages: unknown[]): string {
  if (!Array.isArray(messages) || messages.length === 0) {
    return '    (empty)\n'
  }
  return messages.map((m, i) => '    ' + summarizeOneMessageForLog(m, i)).join('\n') + '\n'
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
        if (block.type === 'text') return `(text)\n${block.text ?? ''}`
        if (block.type === 'tool_use') {
          return `(tool_use ${block.name})\n${formatDebugValue(block.input)}`
        }
        if (block.type === 'thinking') {
          return `(thinking)\n${block.thinking ?? ''}`
        }
        return `(${block.type})\n${formatDebugValue(block)}`
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
