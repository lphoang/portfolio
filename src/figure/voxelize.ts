import type { Era } from '@/lib/era'

import { type Variant, colorAtEra } from './model'

/**
 * Baked figure: cubes grouped by color. `cells` is a flat list of grid indices
 * (i, j, k, i, j, k, …); a cube's center is origin + (index + 0.5) * step.
 */
export type FigureData = {
  step: number
  origin: [number, number, number]
  groups: { color: string; cells: number[] }[]
}

// The box the model fits in, in model units.
const ORIGIN: [number, number, number] = [-9.6, -0.2, -7.6]
// Tall enough for the 1889 top hat.
const SIZE = [19.2, 30.4, 16.4]

const NEIGHBOURS = [
  [1, 0, 0],
  [-1, 0, 0],
  [0, 1, 0],
  [0, -1, 0],
  [0, 0, 1],
  [0, 0, -1]
]

// Samples the shape model on a grid of cubes and keeps only the ones you can see.
export function voxelize(variant: Variant, era: Era, step: number): FigureData {
  const [nx, ny, nz] = SIZE.map(size => Math.ceil(size / step))
  const colors: string[] = []
  const colorIndex = new Map<string, number>()
  const grid = new Int16Array(nx * ny * nz).fill(-1)
  const index = (i: number, j: number, k: number) => (i * ny + j) * nz + k
  const isFilled = (i: number, j: number, k: number) =>
    i >= 0 &&
    j >= 0 &&
    k >= 0 &&
    i < nx &&
    j < ny &&
    k < nz &&
    grid[index(i, j, k)] >= 0

  for (let i = 0; i < nx; i++)
    for (let j = 0; j < ny; j++)
      for (let k = 0; k < nz; k++) {
        const color = colorAtEra(
          variant,
          era,
          ORIGIN[0] + (i + 0.5) * step,
          ORIGIN[1] + (j + 0.5) * step,
          ORIGIN[2] + (k + 0.5) * step,
          step
        )
        if (color === null) continue
        if (!colorIndex.has(color)) {
          colorIndex.set(color, colors.length)
          colors.push(color)
        }
        grid[index(i, j, k)] = colorIndex.get(color)!
      }

  const cells: number[][] = colors.map(() => [])
  for (let i = 0; i < nx; i++)
    for (let j = 0; j < ny; j++)
      for (let k = 0; k < nz; k++) {
        const c = grid[index(i, j, k)]
        if (c < 0) continue
        const hidden = NEIGHBOURS.every(([di, dj, dk]) =>
          isFilled(i + di, j + dj, k + dk)
        )
        if (!hidden) cells[c].push(i, j, k)
      }

  return {
    step,
    origin: ORIGIN,
    groups: colors
      .map((color, c) => ({ color, cells: cells[c] }))
      .filter(group => group.cells.length > 0)
  }
}
