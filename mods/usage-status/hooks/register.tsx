import { atom, read, update } from 'claude-code'
import type { EngineInterface, Register, SessionContextUsage, SessionRateLimit } from 'claude-code'

import type { Header, Limit, Usage } from '../types'

const usage = atom({ plugin: 'usage-status', key: 'usage' } as const, null)
const header = atom({ plugin: 'usage-status', key: 'header' } as const, null)

// The same 256-color codes as ~/.claude/statusline.py, as hex.
const MODEL = '#87afff' // 111
const META = '#585858' // 240
const VALUE = '#8a8a8a' // 245
const TRACK = '#303030' // 236
const SAGE = '#87af87' // 108
const SAND = '#d7af5f' // 179
const CLAY = '#d75f5f' // 167

const MARK = '#e4e4e4' // 254

const BAR_WIDTH = 12
const FILLED = '▰'
const EMPTY = '▱'
const MARKER = '┃'
const SEPARATOR = '  │  '
const LABELS: Record<string, string> = { five_hour: '5h', seven_day: '7d', spend_limit: 'spend' }
const WINDOW_MS: Record<string, number> = { five_hour: 5 * 3_600_000, seven_day: 7 * 86_400_000 }
const EFFORT: Record<string, string> = { medium: 'med' }

type Segment = { text: string; color: string }

export function levelColor(pct: number): string {
  if (pct >= 90) return CLAY
  if (pct >= 70) return SAND
  return SAGE
}

export function countdown(resetsAt: string | undefined, now: number): string | undefined {
  if (!resetsAt) return undefined
  const secs = Math.floor((Date.parse(resetsAt) - now) / 1000)
  if (Number.isNaN(secs)) return undefined
  if (secs <= 0) return 'now'
  const days = Math.floor(secs / 86400)
  const hours = Math.floor((secs % 86400) / 3600)
  const mins = Math.floor((secs % 3600) / 60)
  if (days) return `${days}d${hours}h`
  if (hours) return `${hours}h${mins}m`
  return `${mins}m`
}

// How much of the window has passed, 0 to 100: where steady use would be now.
export function paceShare(limit: Limit, now: number): number | undefined {
  const windowMs = WINDOW_MS[limit.kind]
  if (windowMs === undefined || !limit.resetsAt) return undefined
  const left = Date.parse(limit.resetsAt) - now
  if (Number.isNaN(left)) return undefined
  return Math.min(100, Math.max(0, ((windowMs - left) / windowMs) * 100))
}

export function paceColor(pct: number, pace: number | undefined): string {
  if (pace === undefined || pct >= 90) return levelColor(pct)
  const ahead = pct - pace
  if (ahead <= 0) return SAGE
  if (ahead <= 20) return SAND
  return CLAY
}

// The bar's cells, runs of one kind joined; the marker takes the cell of the pace.
export function barSegments(pct: number, pace: number | undefined): Segment[] {
  const filled = Math.min(BAR_WIDTH, Math.max(0, Math.round((pct / 100) * BAR_WIDTH)))
  const marker = pace === undefined ? -1 : Math.min(BAR_WIDTH - 1, Math.floor((pace / 100) * BAR_WIDTH))
  const color = paceColor(pct, pace)
  const segments: Segment[] = []
  for (let i = 0; i < BAR_WIDTH; i++) {
    const cell =
      i === marker ? { text: MARKER, color: MARK } : i < filled ? { text: FILLED, color } : { text: EMPTY, color: TRACK }
    const last = segments.at(-1)
    if (last && last.color === cell.color && cell.text !== MARKER && !last.text.includes(MARKER)) {
      last.text += cell.text
    } else {
      segments.push(cell)
    }
  }
  return segments
}

function limitSegments(limit: Limit, now: number): Segment[] {
  const left = countdown(limit.resetsAt, now)
  return [
    { text: (LABELS[limit.kind] ?? limit.kind) + ' ', color: META },
    ...barSegments(limit.percentUsed, paceShare(limit, now)),
    { text: ` ${Math.round(limit.percentUsed)}%`, color: VALUE },
    ...(left === undefined ? [] : [{ text: ' ' + left, color: META }]),
  ]
}

function width(segments: Segment[]): number {
  return segments.reduce((sum, s) => sum + [...s.text].length, 0)
}

// claude-opus-5-5 -> Opus 5.5, claude-haiku-4-5-20251001 -> Haiku 4.5
export function displayName(model: string): string {
  const m = /^claude-([a-z]+)-(\d+)(?:-(\d{1,2}))?(?:-\d{8})?(\[1m\])?$/.exec(model)
  if (!m) return model
  const [, family = '', major, minor, long] = m
  const version = minor === undefined ? major : `${major}.${minor}`
  return `${family.charAt(0).toUpperCase()}${family.slice(1)} ${version}${long ? ' 1M' : ''}`
}

function basename(path: string): string {
  return path.replace(/\/+$/, '').split('/').pop() ?? path
}

function toUsage(context: SessionContextUsage, limits: SessionRateLimit[]): Usage {
  return {
    contextPercent: context.percent,
    limits: limits
      .filter(l => l.kind in LABELS)
      .map(({ kind, percentUsed, resetsAt }) => ({ kind, percentUsed, resetsAt })),
  }
}

async function readHeader($: EngineInterface, effort: string | undefined): Promise<Header> {
  const model = await $.session.model()
  const cwd = await $.session.cwd()
  const rows = await $.config.list()
  const isThinking = rows.some(row => row.key === 'thinking' && row.value === true)
  return { model, cwd, effort, isThinking }
}

export const register: Register = on => {
  on('session.start', async ($, e, next) => {
    const result = await next(e)
    const current = await readHeader($, undefined)
    await update($, header, () => current)
    const now = await $.session.usage()
    await update($, usage, () => toUsage(now.context, now.rateLimits))
    // Countdowns move with the clock, not with the session.
    $.clock.every(60_000, () => $.ui.invalidate('ui.render'))

    return result
  })

  on('session.measure', async ($, e, next) => {
    await update($, usage, () => toUsage(e.context, e.rateLimits))

    return next(e)
  })

  on('turn.step', async function* ($, e, next) {
    if (e.agentId === undefined) {
      const effort = e.effort === undefined ? undefined : String(e.effort)
      const current = await readHeader($, effort)
      await update($, header, () => current)
    }

    return yield* next(e)
  })

  on('ui.render', { component: 'AbovePrompt' }, async ($, e, next) => {
    if (e.props.hasSurvey) return next(e)
    const top = await read($, header)
    if (top === null) return next(e)
    const measured = await read($, usage)
    const ctx = measured?.contextPercent
    const now = await $.clock.now()
    const { Box, Text } = $.ui.resolve(e)

    const meta = [
      ...(top.effort === undefined ? [] : [EFFORT[top.effort] ?? top.effort]),
      ...(top.isThinking ? ['think'] : []),
    ]
    const head: Segment[] = [
      { text: displayName(top.model), color: MODEL },
      ...(meta.length ? [{ text: ' · ' + meta.join(' · '), color: META }] : []),
      { text: '  ' + basename(top.cwd), color: VALUE },
      ...(ctx === undefined
        ? []
        : [
            { text: SEPARATOR + 'ctx ', color: META },
            { text: `${ctx}%`, color: levelColor(ctx) },
          ]),
    ]
    const limits = (measured?.limits ?? []).flatMap((limit, i) => [
      ...(i === 0 ? [] : [{ text: SEPARATOR, color: META }]),
      ...limitSegments(limit, now),
    ])

    const fits = limits.length === 0 || width(head) + SEPARATOR.length + width(limits) <= e.props.bodyColumns
    const rows = fits
      ? [[...head, ...(limits.length ? [{ text: SEPARATOR, color: META }, ...limits] : [])]]
      : [head, limits]

    return (
      // One empty row between the transcript and the band.
      <Box flexDirection="column" marginTop={1}>
        {rows.map((row, i) => (
          <Text key={`row${i}`}>
            {row.map(segment => (
              <Text color={segment.color}>{segment.text}</Text>
            ))}
          </Text>
        ))}
      </Box>
    )
  })
}
