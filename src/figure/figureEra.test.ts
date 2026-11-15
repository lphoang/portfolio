import { figureUrl, lightsFor, nextLoads, pickShown } from './figureEra'
import type { FigureData } from './voxelize'

const data = { step: 0.25, origin: [0, 0, 0], groups: [] } as FigureData

test('each page and mode has its own figure file', () => {
  expect(figureUrl('dev', 'vibe')).toBe('/figures/dev-vibe.json')
  expect(figureUrl('player', 'dev')).toBe('/figures/player-dev.json')
})

test('lights per mode', () => {
  expect(lightsFor('vibe')).toEqual({
    ambient: ['#ffffff', 1.35],
    key: ['#ffffff', 2.0],
    rim: ['#000000', 0]
  })
  expect(lightsFor('dev')).toEqual({
    ambient: ['#ffffff', 0.95],
    key: ['#e0ffe8', 1.5],
    rim: ['#39ff6a', 1.3]
  })
})

test('after a switch, the old outfit stays until the new one has loaded', () => {
  expect(pickShown({ dev: data }, 'vibe')).toBe('dev')
  expect(pickShown({ dev: data, vibe: data }, 'vibe')).toBe('vibe')
  expect(pickShown({}, 'vibe')).toBeNull()
})

test('loads the current mode now and the other one later, each only once', () => {
  const none = new Set<'vibe' | 'dev'>()
  expect(nextLoads({ loaded: {}, pending: none, era: 'dev' })).toEqual({
    now: 'dev',
    later: 'vibe'
  })
  // Both loaded: switching modes downloads nothing.
  expect(
    nextLoads({
      loaded: { dev: data, vibe: data },
      pending: none,
      era: 'vibe'
    })
  ).toEqual({ now: null, later: null })
  // The other mode is already on its way: don't ask again.
  expect(
    nextLoads({
      loaded: { dev: data },
      pending: new Set(['vibe']),
      era: 'vibe'
    })
  ).toEqual({ now: null, later: null })
})
