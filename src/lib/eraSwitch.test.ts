import type { Era } from './era'
import { createEraSwitcher, transitionMode } from './eraSwitch'

test('transition mode', () => {
  expect(transitionMode({ reducedMotion: true, canTransition: true })).toBe(
    'instant'
  )
  expect(transitionMode({ reducedMotion: false, canTransition: false })).toBe(
    'flyover'
  )
  expect(transitionMode({ reducedMotion: false, canTransition: true })).toBe(
    'curtain'
  )
})

function setup(
  opts: { reducedMotion?: boolean; transition?: 'ok' | 'fails' | 'none' } = {}
) {
  const applied: Era[] = []
  const craft: string[] = []
  let finish: () => void = () => {}
  const startViewTransition =
    opts.transition === 'none'
      ? undefined
      : (update: () => void) => {
          update()
          const finished =
            opts.transition === 'fails'
              ? Promise.reject(new Error('skipped'))
              : new Promise<void>(resolve => (finish = resolve))
          return { finished }
        }
  const switchEra = createEraSwitcher({
    apply: era => applied.push(era),
    startViewTransition,
    showCraft: (era, position) => craft.push(`${era}:${position}`),
    reducedMotion: () => opts.reducedMotion ?? false,
    wait: async () => {}
  })
  return { switchEra, applied, craft, finish: () => finish() }
}

test('curtain: craft starts left, ends right, era applied inside the transition, craft hidden after', async () => {
  const s = setup()
  const done = s.switchEra('starry')
  s.finish()
  await done
  expect(s.applied).toEqual(['starry'])
  expect(s.craft).toEqual(['starry:left', 'starry:right', 'starry:hidden'])
})

test('a second click during a transition is ignored', async () => {
  const s = setup()
  const first = s.switchEra('starry')
  const second = s.switchEra('terminal')
  s.finish()
  await Promise.all([first, second])
  expect(s.applied).toEqual(['starry'])
})

test('a failed transition still applies the era and hides the craft', async () => {
  const s = setup({ transition: 'fails' })
  await expect(s.switchEra('starry')).resolves.toBeUndefined()
  expect(s.applied).toEqual(['starry'])
  expect(s.craft.at(-1)).toBe('starry:hidden')
})

test('reduced motion: apply only, no craft', async () => {
  const s = setup({ reducedMotion: true })
  await s.switchEra('terminal')
  expect(s.applied).toEqual(['terminal'])
  expect(s.craft).toEqual([])
})

test('no view transitions: apply, then the craft flies over and hides', async () => {
  const s = setup({ transition: 'none' })
  await s.switchEra('starry')
  expect(s.applied).toEqual(['starry'])
  expect(s.craft).toEqual(['starry:fly', 'starry:hidden'])
})
