import { readFileSync } from 'node:fs'
import { gzipSync } from 'node:zlib'

import type { Variant } from './model'
import { type FigureData, voxelize } from './voxelize'

const colorsOf = (data: FigureData) => data.groups.map(g => g.color)
const cellCount = (data: FigureData) => data.groups.reduce((n, g) => n + g.cells.length / 3, 0)

test('same input, same output', () => {
  expect(voxelize('dev', 0.5)).toEqual(voxelize('dev', 0.5))
})

test('only surface cubes are kept', () => {
  const data = voxelize('player', 0.5)
  const filled = new Set<string>()
  for (const g of data.groups)
    for (let i = 0; i < g.cells.length; i += 3) filled.add(g.cells.slice(i, i + 3).join(','))
  const buried = [...filled].filter(key => {
    const [i, j, k] = key.split(',').map(Number)
    const around = [[1, 0, 0], [-1, 0, 0], [0, 1, 0], [0, -1, 0], [0, 0, 1], [0, 0, -1]]
    return around.every(([di, dj, dk]) => filled.has(`${i + di},${j + dj},${k + dk}`))
  })
  expect(filled.size).toBeGreaterThan(0)
  expect(buried).toEqual([])
})

test('each outfit has its own props', () => {
  // At the shipped 4x detail: thin props like the phone's front only show up there.
  const dev = colorsOf(voxelize('dev', 0.25))
  const creator = colorsOf(voxelize('creator', 0.25))
  const player = colorsOf(voxelize('player', 0.25))

  expect(dev).toContain('#22252c') // headset
  expect(dev).not.toContain('#ff3b3b')
  expect(creator).toEqual(expect.arrayContaining(['#ff3b3b', '#e05a8a'])) // record light, phone case
  expect(player).toEqual(expect.arrayContaining(['#8bac0f', '#d9d6c8'])) // screen, shell
  for (const colors of [dev, creator, player]) expect(colors).toContain('#6f6440') // glasses
})

test.each<Variant>(['dev', 'player', 'creator'])('baked %s figure is small', variant => {
  const file = readFileSync(`public/figures/${variant}.json`)
  const data = JSON.parse(file.toString()) as FigureData
  expect(data.step).toBe(0.25)
  expect(cellCount(data)).toBeGreaterThan(10_000)
  expect(cellCount(data)).toBeLessThan(30_000)
  expect(gzipSync(file).length).toBeLessThan(150_000)
})
