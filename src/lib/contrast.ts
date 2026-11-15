import type { Era } from './era'

// WCAG relative luminance of a #rrggbb color.
function luminance(hex: string): number {
  const [r, g, b] = [1, 3, 5].map(i => {
    const c = parseInt(hex.slice(i, i + 2), 16) / 255
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4
  })
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

export function contrastRatio(a: string, b: string): number {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x)
  return (hi + 0.05) / (lo + 0.05)
}

// Text color on background color, per era. Every pair must reach AA (4.5:1).
const PAIRS: Record<Era, [fg: string, bg: string][]> = {
  terminal: [
    ['ink', 'bg'],
    ['muted', 'bg'],
    ['accent', 'bg'],
    ['label', 'bg'],
    ['ink', 'panel'],
    ['muted', 'panel'],
    ['accent', 'panel'],
    ['mint', 'panel'],
    ['num', 'panel'],
    ['badge-ink', 'badge']
  ],
  starry: [
    ['ink', 'bg'],
    ['muted', 'bg'],
    ['accent', 'bg'],
    ['label', 'bg'],
    ['paper-ink', 'paper'],
    ['paper-muted', 'paper'],
    ['date', 'paper'],
    ['prussian', 'paper'],
    ['seal-ink', 'seal'],
    ['badge-ink', 'badge']
  ]
}

const BLOCKS: Record<Era, RegExp> = {
  terminal: /\[data-era=['"]terminal['"]\]\s*\{([^}]*)\}/,
  starry: /\[data-era=['"]starry['"]\]\s*\{([^}]*)\}/
}

// Reads the era color variables out of the stylesheet and lists the pairs to check.
export function eraTextPairs(
  css: string
): { era: Era; name: string; fg: string; bg: string; min: number }[] {
  return (Object.keys(PAIRS) as Era[]).flatMap(era => {
    const block = css.match(BLOCKS[era])?.[1] ?? ''
    const vars = Object.fromEntries(
      [...block.matchAll(/--([\w-]+):\s*(#[0-9a-fA-F]{6})\b/g)].map(m => [
        m[1],
        m[2]
      ])
    )
    return PAIRS[era].map(([fg, bg]) => ({
      era,
      name: `${fg} on ${bg}`,
      fg: vars[fg],
      bg: vars[bg],
      min: 4.5
    }))
  })
}
