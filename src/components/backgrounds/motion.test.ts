import { readFileSync } from 'node:fs'

import { contrastRatio, eraVars } from '@/lib/contrast'

import {
  BLUES,
  RAIN_ALPHA,
  RAIN_GREENS,
  STARS,
  STAR_CORE,
  blend,
  flow,
  needsRefit,
  shouldAnimate
} from './motion'

// The haze opacity per mode, read from the stylesheet so the test follows the CSS.
const css = readFileSync('src/app/globals.css', 'utf8')
const hazeOf = (era: 'vibe' | 'dev') =>
  Number(
    css.match(
      new RegExp(`\\[data-era='${era}'\\][^}]*--haze:\\s*([\\d.]+)`)
    )?.[1]
  )

test('a background animates only in its own mode, visible, without reduced motion', () => {
  const base = {
    era: 'vibe',
    own: 'vibe',
    hidden: false,
    reducedMotion: false
  } as const
  expect(shouldAnimate(base)).toBe(true)
  expect(shouldAnimate({ ...base, era: 'dev' })).toBe(false)
  expect(shouldAnimate({ ...base, hidden: true })).toBe(false)
  expect(shouldAnimate({ ...base, reducedMotion: true })).toBe(false)
})

test('stars stay out of the middle text column', () => {
  for (const [x, y] of STARS) if (y > 0.2) expect(x < 0.3 || x > 0.7).toBe(true)
})

test('the swirl field gives unit vectors', () => {
  for (let x = 0; x <= 1200; x += 150)
    for (let y = 0; y <= 800; y += 100) {
      const [vx, vy] = flow(x, y, 42, 1200, 800)
      expect(Math.hypot(vx, vy)).toBeCloseTo(1)
    }
})

test('vibe text over the haze stays readable at its worst spots in the sky', () => {
  const v = eraVars(css, 'vibe')
  const haze = hazeOf('vibe')
  expect(haze).toBeGreaterThan(0)
  // The haze (the sky color at --haze) sits over the brightest stroke or a star's core.
  const behind = [...BLUES, STAR_CORE].map(color => blend(v.bg, color, haze))
  for (const text of ['ink', 'muted', 'accent', 'label'])
    for (const bg of behind)
      expect(contrastRatio(v[text], bg)).toBeGreaterThanOrEqual(4.5)
})

test('blend mixes two colors', () => {
  expect(blend('#000000', '#ffffff', 0.5)).toBe('#808080')
  expect(blend('#0a1a3f', '#ffffff', 1)).toBe('#0a1a3f')
})

test('dev text over the haze stays readable where rain characters overlap', () => {
  const v = eraVars(css, 'dev')
  const haze = hazeOf('dev')
  expect(haze).toBeGreaterThan(0)
  // Slow columns overlap from frame to frame, so a pixel can build up to about
  // 1.7 glyphs' worth of color.
  const piledUp = Math.min(1, RAIN_ALPHA * 1.7)
  const behind = RAIN_GREENS.map(green =>
    blend(v.bg, blend(green, v.bg, piledUp), haze)
  )
  for (const text of ['ink', 'muted', 'accent', 'label'])
    for (const bg of behind)
      expect(contrastRatio(v[text], bg)).toBeGreaterThanOrEqual(4.5)
})

test('a canvas is rebuilt only when its size really changes', () => {
  const canvas = { width: 390, height: 844 }
  expect(needsRefit(canvas, { width: 390, height: 844 })).toBe(false)
  expect(needsRefit(canvas, { width: 844, height: 390 })).toBe(true)
  expect(needsRefit(canvas, { width: 390, height: 900 })).toBe(true)
})
