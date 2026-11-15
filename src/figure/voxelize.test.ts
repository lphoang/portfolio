import { readFileSync } from 'node:fs'
import { gzipSync } from 'node:zlib'

import type { Era } from '@/lib/era'

import type { Variant } from './model'
import { type FigureData, voxelize } from './voxelize'

const colorsOf = (data: FigureData) => data.groups.map(g => g.color)
const cellCount = (data: FigureData) =>
  data.groups.reduce((n, g) => n + g.cells.length / 3, 0)

const VARIANTS: Variant[] = ['dev', 'player', 'creator']
const ERAS: Era[] = ['vibe', 'dev']

test('same input, same output', () => {
  expect(voxelize('dev', 'vibe', 0.5)).toEqual(voxelize('dev', 'vibe', 0.5))
})

test('only surface cubes are kept', () => {
  const data = voxelize('player', 'dev', 0.5)
  const filled = new Set<string>()
  for (const g of data.groups)
    for (let i = 0; i < g.cells.length; i += 3)
      filled.add(g.cells.slice(i, i + 3).join(','))
  const around = [
    [1, 0, 0],
    [-1, 0, 0],
    [0, 1, 0],
    [0, -1, 0],
    [0, 0, 1],
    [0, 0, -1]
  ]
  const buried = [...filled].filter(key => {
    const [i, j, k] = key.split(',').map(Number)
    return around.every(([di, dj, dk]) =>
      filled.has(`${i + di},${j + dj},${k + dk}`)
    )
  })
  expect(filled.size).toBeGreaterThan(0)
  expect(buried).toEqual([])
})

// At the shipped 4x detail: thin props like the phone's front only show up there.
test('vibe Home wears the original outfit: headset, dark tee, olive glasses', () => {
  const colors = colorsOf(voxelize('dev', 'vibe', 0.25))
  expect(colors).toEqual(
    expect.arrayContaining(['#22252c', '#1f1f22', '#6f6440'])
  )
  expect(colors).not.toContain('#39ff6a') // no green trim
  expect(colors).not.toContain('#16141a') // no top hat
})

test('dev Home keeps the headset and goes green', () => {
  const colors = colorsOf(voxelize('dev', 'dev', 0.25))
  expect(colors).toEqual(
    expect.arrayContaining(['#22252c', '#39ff6a', '#c6ff3d', '#2bffc6'])
  )
  expect(colors).not.toContain('#16141a') // no top hat
})

test('every page keeps its prop in both modes', () => {
  for (const era of ERAS) {
    expect(colorsOf(voxelize('creator', era, 0.25))).toContain('#e05a8a') // phone case
    expect(colorsOf(voxelize('player', era, 0.25))).toContain('#8bac0f') // handheld screen
  }
})

test.each(VARIANTS.flatMap(v => ERAS.map(era => [v, era] as const)))(
  'baked %s-%s figure is small',
  (variant, era) => {
    const file = readFileSync(`public/figures/${variant}-${era}.json`)
    const data = JSON.parse(file.toString()) as FigureData
    expect(data.step).toBe(0.25)
    expect(cellCount(data)).toBeGreaterThan(10_000)
    expect(cellCount(data)).toBeLessThan(35_000)
    expect(gzipSync(file).length).toBeLessThan(150_000)
  }
)
