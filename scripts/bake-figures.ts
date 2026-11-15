// Bakes the three outfits of the 3D figure into public/figures/<variant>.json.
// Run with `npm run figures` after changing src/figure/model.ts.
import { mkdirSync, writeFileSync } from 'node:fs'
import { gzipSync } from 'node:zlib'

import type { Variant } from '../src/figure/model'
import { voxelize } from '../src/figure/voxelize'

const STEP = 0.25 // 4x detail
const VARIANTS: Variant[] = ['dev', 'player', 'creator']

mkdirSync('public/figures', { recursive: true })
for (const variant of VARIANTS) {
  const data = voxelize(variant, STEP)
  const json = JSON.stringify(data)
  writeFileSync(`public/figures/${variant}.json`, json)
  const cubes = data.groups.reduce((n, g) => n + g.cells.length / 3, 0)
  const kb = (bytes: number) => `${(bytes / 1024).toFixed(0)} KB`
  console.log(
    `${variant}: ${cubes} cubes, ${kb(json.length)} (${kb(gzipSync(json).length)} gzipped)`
  )
}
