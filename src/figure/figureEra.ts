import type { Era } from '@/lib/era'

import type { Variant } from './model'
import type { FigureData } from './voxelize'

export function figureUrl(variant: Variant, era: Era): string {
  return `/figures/${variant}-${era}.json`
}

type Light = [color: string, intensity: number]

// Vibe: plain white light, as the figure had before the modes; Dev: neutral with a
// green rim from behind.
export function lightsFor(era: Era): {
  ambient: Light
  key: Light
  rim: Light
} {
  return era === 'vibe'
    ? { ambient: ['#ffffff', 1.35], key: ['#ffffff', 2.0], rim: ['#000000', 0] }
    : {
        ambient: ['#ffffff', 0.95],
        key: ['#e0ffe8', 1.5],
        rim: ['#39ff6a', 1.3]
      }
}

// Which mode's outfit to show: the current one once it has loaded, otherwise the
// other (already shown) one, so a slow download never leaves an empty square.
export function pickShown(
  loaded: Partial<Record<Era, FigureData>>,
  era: Era
): Era | null {
  if (loaded[era]) return era
  const other: Era = era === 'vibe' ? 'dev' : 'vibe'
  return loaded[other] ? other : null
}

// What to download: the current mode's figure right away, the other mode's once the
// browser is idle; never one that is already loaded or on its way.
export function nextLoads(input: {
  loaded: Partial<Record<Era, FigureData>>
  pending: ReadonlySet<Era>
  era: Era
}): { now: Era | null; later: Era | null } {
  const missing = (era: Era) => !input.loaded[era] && !input.pending.has(era)
  const other: Era = input.era === 'vibe' ? 'dev' : 'vibe'
  return {
    now: missing(input.era) ? input.era : null,
    later: missing(other) ? other : null
  }
}
