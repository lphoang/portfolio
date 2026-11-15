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

// Text color on background color, per mode. Every pair must reach AA (4.5:1).
// Text pairs need 4.5:1; the focus ring is a UI part and needs 3:1.
const PAIRS: Record<Era, [fg: string, bg: string, min?: number][]> = {
  dev: [
    ['ink', 'bg'],
    ['muted', 'bg'],
    ['accent', 'bg'],
    ['label', 'bg'],
    ['ink', 'panel'],
    ['muted', 'panel'],
    ['accent', 'panel'],
    ['mint', 'panel'],
    ['num', 'panel'],
    ['badge-ink', 'badge'],
    ['focus', 'bg', 3]
  ],
  vibe: [
    ['ink', 'bg'],
    ['muted', 'bg'],
    ['accent', 'bg'],
    ['label', 'bg'],
    ['ink', 'panel'],
    ['muted', 'panel'],
    ['accent', 'panel'],
    ['num', 'panel'],
    ['badge-ink', 'badge'],
    ['focus', 'bg', 3]
  ]
}

const BLOCKS: Record<Era, RegExp> = {
  dev: /\[data-era=['"]dev['"]\]\s*\{([^}]*)\}/,
  vibe: /\[data-era=['"]vibe['"]\]\s*\{([^}]*)\}/
}

// The #rrggbb color variables of one mode, read from the stylesheet.
export function eraVars(css: string, era: Era): Record<string, string> {
  const block = css.match(BLOCKS[era])?.[1] ?? ''
  return Object.fromEntries(
    [...block.matchAll(/--([\w-]+):\s*(#[0-9a-fA-F]{6})\b/g)].map(m => [
      m[1],
      m[2]
    ])
  )
}

// Lists the text-on-background pairs to check, with their colors from the stylesheet.
export function eraTextPairs(
  css: string
): { era: Era; name: string; fg: string; bg: string; min: number }[] {
  return (Object.keys(PAIRS) as Era[]).flatMap(era => {
    const vars = eraVars(css, era)
    return PAIRS[era].map(([fg, bg, min = 4.5]) => ({
      era,
      name: `${fg} on ${bg}`,
      fg: vars[fg],
      bg: vars[bg],
      min
    }))
  })
}
