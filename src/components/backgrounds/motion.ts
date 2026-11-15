import type { Era } from '@/lib/era'

// A background animates only in its own era, while the tab is visible, and never
// with reduced motion (then it shows one still frame instead).
export function shouldAnimate(input: {
  era: Era
  own: Era
  hidden: boolean
  reducedMotion: boolean
}): boolean {
  return input.era === input.own && !input.hidden && !input.reducedMotion
}

// ---------- 1889: the swirling night sky ----------

// Star positions as fractions of the viewport, and their radius in px.
// Kept out of the middle text column (x 0.3–0.7) below the top 20%.
export const STARS: [x: number, y: number, r: number][] = [
  [0.12, 0.16, 26],
  [0.27, 0.07, 18],
  [0.73, 0.09, 16],
  [0.86, 0.32, 20],
  [0.2, 0.4, 14],
  [0.92, 0.08, 12],
  [0.08, 0.62, 12],
  [0.84, 0.58, 14],
  [0.15, 0.84, 12],
  [0.9, 0.8, 12]
]

// The bright center of a star, and the blues of the brush strokes.
export const STAR_CORE = '#fff6c8'
export const BLUES = [
  '#1d3f8f',
  '#2a56ad',
  '#3a6fc0',
  '#1a2f6e',
  '#5b86c9',
  '#203e86',
  '#7fa6d9'
]

// Swirl centers as fractions of the viewport, and their reach.
const VORTICES: [x: number, y: number, r: number][] = [
  [0.42, 0.32, 0.16],
  [0.6, 0.36, 0.12],
  [0.22, 0.24, 0.1]
]

// Direction the brush strokes flow at a point: a gentle drift to the right,
// curled around the swirl centers. Returns a unit vector.
export function flow(
  x: number,
  y: number,
  t: number,
  w: number,
  h: number
): [number, number] {
  let vx = 1
  let vy = 0.35 * Math.sin(x * 0.004 + t * 0.002) + 0.2 * Math.cos(y * 0.006)
  for (const [cx, cy, r] of VORTICES) {
    const dx = x - cx * w
    const dy = y - cy * h
    const reach = r * Math.min(w, h) * 1.6
    const d = Math.hypot(dx, dy) || 1
    const strength = 2.6 * Math.exp(-((d / reach) ** 2))
    vx += (-dy / d) * strength
    vy += (dx / d) * strength
  }
  const m = Math.hypot(vx, vy)
  return [vx / m, vy / m]
}

// How strongly the night-blue haze covers the painting behind the text column.
export const SCRIM_ALPHA = 0.78

// The color you see when `top` covers `bottom` with the given opacity.
export function blend(top: string, bottom: string, alpha: number): string {
  const channel = (hex: string, i: number) => parseInt(hex.slice(i, i + 2), 16)
  return (
    '#' +
    [1, 3, 5]
      .map(i =>
        Math.round(alpha * channel(top, i) + (1 - alpha) * channel(bottom, i))
          .toString(16)
          .padStart(2, '0')
      )
      .join('')
  )
}

// ---------- terminal: falling characters ----------

export const RAIN_GLYPHS = '01<>/{}[]=+*#$%&ABCDEF'
export const RAIN_GREENS = [
  '#39ff6a',
  '#c6ff3d',
  '#2bffc6',
  '#19d3c5',
  '#7dff5a'
]
