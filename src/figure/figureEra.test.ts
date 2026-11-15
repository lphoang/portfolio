import { figureUrl, lightsFor, pickShown } from './figureEra'
import type { FigureData } from './voxelize'

const data = { step: 0.25, origin: [0, 0, 0], groups: [] } as FigureData

test('each page and era has its own figure file', () => {
  expect(figureUrl('dev', 'starry')).toBe('/figures/dev-starry.json')
  expect(figureUrl('player', 'terminal')).toBe('/figures/player-terminal.json')
})

test('lights per era', () => {
  expect(lightsFor('starry')).toEqual({
    ambient: ['#9fb4ff', 1.0],
    key: ['#ffe2a8', 1.9],
    rim: ['#000000', 0]
  })
  expect(lightsFor('terminal')).toEqual({
    ambient: ['#ffffff', 0.95],
    key: ['#e0ffe8', 1.5],
    rim: ['#39ff6a', 1.3]
  })
})

test('after a switch, the old outfit stays until the new one has loaded', () => {
  expect(pickShown({ terminal: data }, 'starry')).toBe('terminal')
  expect(pickShown({ terminal: data, starry: data }, 'starry')).toBe('starry')
  expect(pickShown({}, 'starry')).toBeNull()
})
