import { readFileSync } from 'node:fs'

import { contrastRatio } from '@/lib/contrast'

const css = readFileSync('src/app/(kanotes)/kanotes.css', 'utf8')

// Every rule's selectors, with @media blocks opened up and @keyframes steps left out.
function selectorsIn(source: string): string[] {
  const text = source.replace(/\/\*[\s\S]*?\*\//g, '')
  const keyframes = /@keyframes[^{]*\{(?:[^{}]*\{[^}]*\})*[^{}]*\}/g
  return [...text.replace(keyframes, '').matchAll(/([^{};]+)\{/g)]
    .map(m => m[1].trim())
    .filter(prelude => !prelude.startsWith('@'))
    .flatMap(prelude => prelude.split(',').map(s => s.trim()))
    .filter(Boolean)
}

test('Kanotes styles never reach portfolio pages', () => {
  const selectors = selectorsIn(css)
  expect(selectors.length).toBeGreaterThan(10)
  for (const selector of selectors)
    expect(selector).toMatch(
      /^(\.kanotes\b|html(\[data-kanotes-lang|:not\(\[data-kanotes-lang|:has\(\.kanotes\)))/
    )
})

test('without the Vietnamese attribute, Vietnamese text is hidden (English shows without JS)', () => {
  expect(css).toMatch(
    /html:not\(\[data-kanotes-lang='vi'\]\) \.k-vi[^{]*\{[^}]*display: none/
  )
  expect(css).toMatch(
    /html\[data-kanotes-lang='vi'\] \.k-en[^{]*\{[^}]*display: none/
  )
})

test('the whole viewport takes the Kanotes background', () => {
  expect(css).toMatch(/html:has\(\.kanotes\) body\s*\{[^}]*background/)
})

test('Kanotes text colors meet WCAG AA', () => {
  const pairs = [
    ['#1E2B25', '#E8F6EF'],
    ['#55665D', '#E8F6EF'],
    ['#12795F', '#E8F6EF'],
    ['#1C140F', '#FFB347']
  ]
  for (const [fg, bg] of pairs)
    expect(contrastRatio(fg, bg)).toBeGreaterThanOrEqual(4.5)
})

test('Kanotes is always light mint, whatever the device prefers', () => {
  expect(css).not.toContain('prefers-color-scheme')
})
