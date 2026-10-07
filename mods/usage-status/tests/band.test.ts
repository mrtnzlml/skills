import { expect, mock, test } from 'claude-code/testing'
import type { On } from 'claude-code'

import { barSegments, displayName, paceColor, paceShare } from '../hooks/register'

const props = (bodyColumns: number) => ({
  hasSurvey: false,
  isWorking: false,
  maxRows: 20,
  bodyColumns,
  scroll: { offset: 0, bodyRows: 20 },
  view: {},
})

const BAND = { plugin: 'usage-status', component: 'AbovePrompt', props: props(200) } as const

const MIN = 60_000
const HOUR = 60 * MIN
const DAY = 24 * HOUR
const START = Date.parse('2026-10-07T10:00:00Z')
const at = (ms: number) => new Date(START + ms).toISOString()

const SAGE = '#87af87'
const SAND = '#d7af5f'
const CLAY = '#d75f5f'
const MARK = '#e4e4e4'

// 5h: 78% used, 3h12m of 5h gone (64%). 7d: 12% used, 3d of 7d gone (43%).
function engine(on: On) {
  on('session.start', ($, e) => ({ cwd: e.cwd }))
  on('session.model', () => ({ value: 'claude-opus-5-5' }))
  on('session.cwd', () => ({ value: '/work/skills' }))
  on('config.list', () => ({
    value: [{ key: 'thinking', label: 'Thinking mode', kind: 'boolean', value: true, provider: { plugin: 'engine', tier: 'core' }, isLocked: true }],
  }))
  on('session.measure', ($, e) => ({ changed: e.changed }))
  // The engine's own band, drawn when the plugin passes.
  on('ui.render', () => ({ type: 'Text', children: ['engine band'] }))
  on('session.usage', () => ({
    value: {
      startedAt: START,
      context: { window: 200000, tokens: 68000, percent: 34 },
      rateLimits: [
        { kind: 'five_hour', percentUsed: 78, resetsAt: at(HOUR + 48 * MIN) },
        { kind: 'seven_day', percentUsed: 12, resetsAt: at(4 * DAY) },
      ],
    },
  }))
}

async function drain<C, R>(stream: AsyncGenerator<C, R> & { readonly result: Promise<R> }) {
  for await (const _ of stream);
  return stream.result
}

// A Text whose shown text is exactly this, not a row that contains it.
const exact = (text: string) => new RegExp('^' + text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '$')

const rowCount = async (ui: { drawn: () => Promise<unknown> }) =>
  ((await ui.drawn()) as { children?: unknown[] }).children?.length

const SESSION = { cwd: '/work/skills', surface: 'terminal', isInteractive: true } as const

test('pace share is the part of the window that has passed', () => {
  expect(Math.round(paceShare({ kind: 'five_hour', percentUsed: 0, resetsAt: at(HOUR + 48 * MIN) }, START) ?? 0)).toBe(64)
  expect(Math.round(paceShare({ kind: 'seven_day', percentUsed: 0, resetsAt: at(4 * DAY) }, START) ?? 0)).toBe(43)
  expect(paceShare({ kind: 'five_hour', percentUsed: 0, resetsAt: at(-MIN) }, START)).toBe(100)
  expect(paceShare({ kind: 'five_hour', percentUsed: 0 }, START)).toBeUndefined()
  expect(paceShare({ kind: 'spend_limit', percentUsed: 0, resetsAt: at(HOUR) }, START)).toBeUndefined()
})

test('the bar color follows pace', () => {
  expect(paceColor(40, 64)).toBe(SAGE)
  expect(paceColor(64, 64)).toBe(SAGE)
  expect(paceColor(78, 64)).toBe(SAND)
  expect(paceColor(85, 64)).toBe(CLAY)
  expect(paceColor(91, 99)).toBe(CLAY)
  expect(paceColor(75, undefined)).toBe(SAND)
})

test('the marker takes the cell of the elapsed share', () => {
  const texts = (pct: number, pace: number | undefined) => barSegments(pct, pace).map(s => s.text)
  expect(texts(78, 64)).toEqual(['▰▰▰▰▰▰▰', '┃', '▰', '▱▱▱'])
  expect(texts(12, 300 / 7)).toEqual(['▰', '▱▱▱▱', '┃', '▱▱▱▱▱▱'])
  expect(texts(100, 100)).toEqual(['▰▰▰▰▰▰▰▰▰▰▰', '┃'])
  expect(texts(50, undefined)).toEqual(['▰▰▰▰▰▰', '▱▱▱▱▱▱'])
  expect(barSegments(78, 64)[1]?.color).toBe(MARK)
})

test('a wide band is one row', async ($, on) => {
  engine(on)
  mock.clock(on, { now: START })
  await $.session.start(SESSION)

  for (const surface of ['terminal', 'desktop'] as const) {
    const ui = await $.ui.mount({ ...BAND, surface })
    expect(await rowCount(ui)).toBe(1)
    expect(await ui.drawn()).toMatchObject({ type: 'Box', props: { marginTop: 1 } })
    expect(await ui.find({ type: 'Text', text: exact('Opus 5.5') })).toBeDefined()
    expect(await ui.find({ type: 'Text', text: exact(' · think') })).toBeDefined()
    expect(await ui.find({ type: 'Text', text: exact('  skills') })).toBeDefined()
    expect((await ui.find({ type: 'Text', text: exact('34%') }))?.props).toMatchObject({ color: SAGE })
    expect((await ui.find({ type: 'Text', text: exact('▰▰▰▰▰▰▰') }))?.props).toMatchObject({ color: SAND })
    expect(await ui.find({ type: 'Text', text: exact(' 78%') })).toBeDefined()
    expect(await ui.find({ type: 'Text', text: exact(' 1h48m') })).toBeDefined()
    expect(await ui.find({ type: 'Text', text: exact(' 4d0h') })).toBeDefined()
    expect(await ui.findAll({ type: 'Text', text: exact('┃') })).toHaveLength(2)
    await ui.unmount()
  }
})

test('a narrow band puts the limits on a second row', async ($, on) => {
  engine(on)
  mock.clock(on, { now: START })
  await $.session.start(SESSION)
  const ui = await $.ui.mount({ ...BAND, props: props(60), surface: 'terminal' })

  expect(await rowCount(ui)).toBe(2)
  expect(await ui.find({ type: 'Text', text: exact('5h ') })).toBeDefined()
})

test('a measurement redraws the band', async ($, on) => {
  engine(on)
  mock.clock(on, { now: START })
  await $.session.start(SESSION)
  const ui = await $.ui.mount({ ...BAND, surface: 'terminal' })

  await $.session.measure({
    context: { window: 200000, tokens: 150000, percent: 75 },
    rateLimits: [{ kind: 'five_hour', percentUsed: 60, resetsAt: at(HOUR) }],
    changed: ['context', 'rateLimits'],
  })

  expect((await ui.find({ type: 'Text', text: exact('75%') }))?.props).toMatchObject({ color: SAND })
  // 60% used with 80% of the window gone is under pace.
  expect((await ui.find({ type: 'Text', text: exact('▰▰▰▰▰▰▰') }))?.props).toMatchObject({ color: SAGE })
  expect(await ui.find({ type: 'Text', text: exact('7d ') })).toBeUndefined()
})

test('the countdown and the marker move with the clock', async ($, on) => {
  engine(on)
  const clock = mock.clock(on, { now: START })
  await $.session.start(SESSION)
  const ui = await $.ui.mount({ ...BAND, surface: 'terminal' })

  await clock.advance(HOUR + MIN)

  expect(await ui.find({ type: 'Text', text: exact(' 47m') })).toBeDefined()
  // 4h13m of 5h gone (84%) moves the marker past the 9 filled cells, under pace.
  const filled = await ui.find({ type: 'Text', text: exact('▰▰▰▰▰▰▰▰▰') })
  expect(filled?.props).toMatchObject({ color: SAGE })
})

test('the effort of a main-thread request shows after the model', async ($, on) => {
  engine(on)
  mock.clock(on, { now: START })
  on('turn.step', async function* (_$, e) {
    return { turnId: e.turnId, index: e.index, answer: '', toolUses: [], stopReason: 'end_turn', usage: null }
  })
  await $.session.start(SESSION)
  const ui = await $.ui.mount({ ...BAND, surface: 'terminal' })

  await drain($.turn.step({ turnId: 't1', index: 0, model: 'claude-opus-5-5', effort: 'medium', messageCount: 1 }))
  expect(await ui.find({ type: 'Text', text: exact(' · med · think') })).toBeDefined()

  await drain($.turn.step({ turnId: 't1', index: 1, model: 'claude-haiku', effort: 'low', messageCount: 1, agentId: 'a1' }))
  expect(await ui.find({ type: 'Text', text: exact(' · low · think') })).toBeUndefined()
})

test('the band yields to a survey', async ($, on) => {
  engine(on)
  mock.clock(on, { now: START })
  await $.session.start(SESSION)
  const ui = await $.ui.mount({ ...BAND, props: { ...props(200), hasSurvey: true }, surface: 'terminal' })
  expect(await ui.find({ type: 'Text', text: exact('Opus 5.5') })).toBeUndefined()
  expect(await ui.find({ type: 'Text', text: exact('engine band') })).toBeDefined()
})

test('model ids read as names', () => {
  expect(displayName('claude-opus-5-5')).toBe('Opus 5.5')
  expect(displayName('claude-haiku-4-5-20251001')).toBe('Haiku 4.5')
  expect(displayName('claude-sonnet-5-5[1m]')).toBe('Sonnet 5.5 1M')
  expect(displayName('claude-opus-4-20250514')).toBe('Opus 4')
  expect(displayName('gpt-x')).toBe('gpt-x')
})
