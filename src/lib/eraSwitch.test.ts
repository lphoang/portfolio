import type { Era } from './era'
import { createEraSwitcher } from './eraSwitch'

function setup(opts: { reducedMotion?: boolean; flip?: 'ok' | 'fails' } = {}) {
  const events: string[] = []
  let finish: () => void = () => {}
  const switchEra = createEraSwitcher({
    apply: (era: Era) => events.push(`apply ${era}`),
    flip: (era, onCovered) => {
      events.push(`flip ${era}`)
      if (opts.flip === 'fails') return Promise.reject(new Error('no canvas'))
      onCovered()
      return new Promise<void>(resolve => (finish = resolve))
    },
    reducedMotion: () => opts.reducedMotion ?? false
  })
  return { switchEra, events, finish: () => finish() }
}

test('the mode switches while the tiles cover the page', async () => {
  const s = setup()
  const done = s.switchEra('vibe')
  s.finish()
  await done
  expect(s.events).toEqual(['flip vibe', 'apply vibe'])
})

test('a second click during a flip is ignored', async () => {
  const s = setup()
  const first = s.switchEra('vibe')
  const second = s.switchEra('dev')
  s.finish()
  await Promise.all([first, second])
  expect(s.events).toEqual(['flip vibe', 'apply vibe'])
})

test('a failed flip still switches the mode', async () => {
  const s = setup({ flip: 'fails' })
  await expect(s.switchEra('vibe')).resolves.toBeUndefined()
  expect(s.events).toEqual(['flip vibe', 'apply vibe'])
})

test('with reduced motion the mode switches at once, without tiles', async () => {
  const s = setup({ reducedMotion: true })
  await s.switchEra('dev')
  expect(s.events).toEqual(['apply dev'])
})
