import { readFileSync } from 'node:fs'

import { contrastRatio, eraVars } from '@/lib/contrast'

import {
  BLUES,
  SCRIM_ALPHA,
  STARS,
  STAR_CORE,
  blend,
  flow,
  shouldAnimate
} from './motion'

test('a background animates only in its own era, visible, without reduced motion', () => {
  const base = {
    era: 'starry',
    own: 'starry',
    hidden: false,
    reducedMotion: false
  } as const
  expect(shouldAnimate(base)).toBe(true)
  expect(shouldAnimate({ ...base, era: 'terminal' })).toBe(false)
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

test('1889 text over the haze stays readable at its worst spots', () => {
  const v = eraVars(readFileSync('src/app/globals.css', 'utf8'), 'starry')
  // The haze (the sky color at SCRIM_ALPHA) sits over the brightest stroke or a star's core.
  const brightest = [...BLUES, STAR_CORE]
  const behind = brightest.map(color => blend(v.bg, color, SCRIM_ALPHA))
  for (const text of ['ink', 'muted', 'label'])
    for (const bg of behind)
      expect(contrastRatio(v[text], bg)).toBeGreaterThanOrEqual(4.5)
})

test('blend mixes two colors', () => {
  expect(blend('#000000', '#ffffff', 0.5)).toBe('#808080')
  expect(blend('#0a1a3f', '#ffffff', 1)).toBe('#0a1a3f')
})
