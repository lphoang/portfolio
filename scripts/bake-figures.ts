// Bakes the 3D figure for every page and mode into public/figures/<variant>-<era>.json.
// Run with `npm run figures` after changing src/figure/model.ts.
import { mkdirSync, writeFileSync } from 'node:fs'
import { gzipSync } from 'node:zlib'

import type { Variant } from '../src/figure/model'
import { voxelize } from '../src/figure/voxelize'
import type { Era } from '../src/lib/era'

const STEP = 0.25 // 4x detail
const VARIANTS: Variant[] = ['dev', 'player', 'creator']
const ERAS: Era[] = ['vibe', 'dev']

mkdirSync('public/figures', { recursive: true })
for (const variant of VARIANTS)
  for (const era of ERAS) {
    const data = voxelize(variant, era, STEP)
    const json = JSON.stringify(data)
    writeFileSync(`public/figures/${variant}-${era}.json`, json)
    const cubes = data.groups.reduce((n, g) => n + g.cells.length / 3, 0)
    const kb = (bytes: number) => `${(bytes / 1024).toFixed(0)} KB`
    console.log(
      `${variant}-${era}: ${cubes} cubes, ${kb(json.length)} (${kb(gzipSync(json).length)} gzipped)`
    )
  }
