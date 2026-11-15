import { readFileSync } from 'node:fs'

import { eraVars } from './contrast'
import {
  COVERED_MS,
  FLIP_COLORS,
  TILE,
  TOTAL_MS,
  layoutTiles,
  playPixelFlip,
  tileCoverAt
} from './pixelFlip'

test('the tiles cover the whole screen, even its last partial row and column', () => {
  const tiles = layoutTiles(390, 844)
  expect(tiles).toHaveLength(Math.ceil(390 / TILE) * Math.ceil(844 / TILE))
  expect(Math.max(...tiles.map(t => t.x + TILE))).toBeGreaterThanOrEqual(390)
  expect(Math.max(...tiles.map(t => t.y + TILE))).toBeGreaterThanOrEqual(844)
})

test('the wave runs from the top-left corner to the bottom-right', () => {
  const tiles = layoutTiles(1440, 900, () => 0.5)
  const first = tiles.find(t => t.x === 0 && t.y === 0)!
  const last = tiles.at(-1)!
  expect(first.delay).toBeLessThan(last.delay)
})

test('a tile turns from edge-on to flat, stays flat, then turns away', () => {
  const delay = 100
  expect(tileCoverAt(0, delay)).toBe(0)
  expect(tileCoverAt(delay + 60, delay)).toBeGreaterThan(0)
  expect(tileCoverAt(delay + 60, delay)).toBeLessThan(1)
  expect(tileCoverAt(COVERED_MS, delay)).toBe(1)
  expect(tileCoverAt(TOTAL_MS, delay)).toBe(0)
})

test('every tile is flat when the mode switches underneath', () => {
  for (const random of [() => 0, () => 0.999])
    for (const tile of layoutTiles(1920, 1080, random))
      expect(tileCoverAt(COVERED_MS, tile.delay)).toBe(1)
})

test('the tiles take the colors of the mode being switched to', () => {
  const css = readFileSync('src/app/globals.css', 'utf8')
  for (const era of ['vibe', 'dev'] as const) {
    const vars = eraVars(css, era)
    expect(FLIP_COLORS[era]).toEqual({ fill: vars.panel, edge: vars.accent })
  }
})

// A fake page: a canvas whose drawing calls do nothing, and a frame clock we drive.
function fakePage() {
  const frames: ((time: number) => void)[] = []
  const canvas = {
    width: 0,
    height: 0,
    className: '',
    removed: false,
    setAttribute() {},
    getContext: () => new Proxy({}, { get: () => () => {}, set: () => true }),
    remove() {
      canvas.removed = true
    }
  }
  vi.stubGlobal('window', { innerWidth: 390, innerHeight: 844 })
  vi.stubGlobal('document', {
    createElement: () => canvas,
    body: { append() {} }
  })
  vi.stubGlobal('requestAnimationFrame', (cb: (time: number) => void) =>
    frames.push(cb)
  )
  const tick = (time: number) => frames.shift()?.(time)
  return { canvas, tick }
}

afterEach(() => vi.unstubAllGlobals())

test('the mode switches once, while covered, even when frames are skipped', async () => {
  const page = fakePage()
  const covered: number[] = []
  const done = playPixelFlip('vibe', () => covered.push(1))
  page.tick(1000)
  page.tick(1016)
  expect(covered).toEqual([])
  // The tab stalls and the next frame lands after the whole flip.
  page.tick(1000 + TOTAL_MS + 500)
  await done
  expect(covered).toEqual([1])
  expect(page.canvas.removed).toBe(true)
})
