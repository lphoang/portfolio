import type { Era } from './era'

// Switching modes: the screen turns into square tiles that flip over in a wave
// from the top-left corner, covering the page; the mode changes underneath, and
// the tiles flip away again in the same wave, showing the new mode.

export const TILE = 32 // px
const FLIP_MS = 180 // one tile turning over
const WAVE_MS = 420 // from the first tile starting to turn to the last one
const HOLD_MS = 100 // fully covered, while the new mode paints underneath

// The mode switches at COVERED_MS; the tiles are gone at TOTAL_MS.
export const COVERED_MS = WAVE_MS + FLIP_MS
export const TOTAL_MS = 2 * COVERED_MS + HOLD_MS

// The tiles wear the new mode's card color, outlined in its accent
// (--panel and --accent in globals.css; a test keeps them the same).
export const FLIP_COLORS: Record<Era, { fill: string; edge: string }> = {
  vibe: { fill: '#16291c', edge: '#9bd96b' },
  dev: { fill: '#06110a', edge: '#39ff6a' }
}

export type Tile = { x: number; y: number; delay: number }

// The grid of tiles over a width × height screen. A tile starts turning later the
// further it is from the top-left corner, with a little randomness so the wave
// looks like pixels flipping, not a straight line.
export function layoutTiles(
  width: number,
  height: number,
  random: () => number = Math.random
): Tile[] {
  const cols = Math.ceil(width / TILE)
  const rows = Math.ceil(height / TILE)
  const farthest = Math.max(1, cols + rows - 2)
  const tiles: Tile[] = []
  for (let row = 0; row < rows; row++)
    for (let col = 0; col < cols; col++)
      tiles.push({
        x: col * TILE,
        y: row * TILE,
        delay:
          ((col + row) / farthest) * WAVE_MS * 0.75 + random() * WAVE_MS * 0.25
      })
  return tiles
}

const turned = (ms: number) => {
  const p = Math.min(1, Math.max(0, ms / FLIP_MS))
  return p * p * (3 - 2 * p) // ease in and out
}

// How much of its square a tile covers at `time` ms into the flip:
// 0 is edge-on (invisible), 1 is flat.
export function tileCoverAt(time: number, delay: number): number {
  if (time <= COVERED_MS) return turned(time - delay)
  return 1 - turned(time - COVERED_MS - HOLD_MS - delay)
}

function draw(
  ctx: CanvasRenderingContext2D,
  tiles: Tile[],
  time: number,
  colors: { fill: string; edge: string }
) {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
  for (const tile of tiles) {
    const cover = tileCoverAt(time, tile.delay)
    if (cover <= 0) continue
    // Narrow, centered: the tile seen while it turns.
    const width = TILE * cover
    const x = tile.x + (TILE - width) / 2
    ctx.globalAlpha = 1
    ctx.fillStyle = colors.fill
    ctx.fillRect(x, tile.y, width, TILE)
    // Light catches a tile as it turns, and its outline draws the pixel grid.
    ctx.fillStyle = colors.edge
    ctx.globalAlpha = (1 - cover) * 0.6
    ctx.fillRect(x, tile.y, width, TILE)
    ctx.strokeStyle = colors.edge
    ctx.globalAlpha = 0.35
    ctx.strokeRect(x + 0.5, tile.y + 0.5, Math.max(0, width - 1), TILE - 1)
  }
}

/**
 * Plays the flip over the whole screen and calls `onCovered` exactly once, when the
 * tiles hide the page (or later, if the browser skipped frames). Resolves when the
 * tiles are gone.
 */
export function playPixelFlip(next: Era, onCovered: () => void): Promise<void> {
  return new Promise(resolve => {
    const width = window.innerWidth
    const height = window.innerHeight
    const scale = window.devicePixelRatio || 1
    const canvas = document.createElement('canvas')
    canvas.className = 'pixel-flip'
    canvas.setAttribute('aria-hidden', 'true')
    canvas.width = Math.round(width * scale)
    canvas.height = Math.round(height * scale)
    const ctx = canvas.getContext('2d')
    if (!ctx) {
      onCovered()
      resolve()
      return
    }
    ctx.scale(scale, scale)
    document.body.append(canvas)

    const tiles = layoutTiles(width, height)
    let start: number | null = null
    let covered = false

    const frame = (now: number) => {
      start ??= now
      const time = now - start
      if (!covered && time >= COVERED_MS) {
        covered = true
        onCovered()
      }
      if (time >= TOTAL_MS) {
        canvas.remove()
        resolve()
        return
      }
      draw(ctx, tiles, time, FLIP_COLORS[next])
      requestAnimationFrame(frame)
    }
    requestAnimationFrame(frame)
  })
}
