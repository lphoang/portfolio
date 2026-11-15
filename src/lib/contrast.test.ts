import { readFileSync } from 'node:fs'

import { contrastRatio, eraTextPairs } from './contrast'

test('contrast ratio follows WCAG', () => {
  expect(contrastRatio('#000000', '#ffffff')).toBeCloseTo(21, 0)
  expect(contrastRatio('#777777', '#777777')).toBe(1)
})

test('every era text pair meets WCAG AA', () => {
  const pairs = eraTextPairs(readFileSync('src/app/globals.css', 'utf8'))
  const names = pairs.map(p => `${p.era}:${p.name}`)
  for (const expected of [
    'terminal:ink on bg',
    'terminal:muted on panel',
    'terminal:num on panel',
    'terminal:badge-ink on badge',
    'starry:ink on bg',
    'starry:label on bg',
    'starry:paper-ink on paper',
    'starry:prussian on paper',
    'starry:seal-ink on seal',
    'starry:date on paper-rim',
    'starry:seal-ink on seal-light'
  ])
    expect(names).toContain(expected)

  const failing = pairs
    .map(p => ({ ...p, ratio: contrastRatio(p.fg, p.bg) }))
    .filter(p => p.ratio < p.min)
    .map(p => `${p.era}:${p.name} ${p.ratio.toFixed(2)}`)
  expect(failing).toEqual([])
})
