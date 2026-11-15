import type { Era } from './era'

type Deps = {
  apply: (era: Era) => void
  // Plays the pixel flip and calls onCovered when the page is hidden behind it.
  flip: (era: Era, onCovered: () => void) => Promise<void>
  reducedMotion: () => boolean
}

/**
 * Switches modes behind the pixel flip, or at once with reduced motion.
 * Clicks during a switch are ignored, and the mode always switches, even if
 * the flip can't play.
 */
export function createEraSwitcher(deps: Deps) {
  let busy = false

  return async function switchEra(next: Era) {
    if (busy) return
    busy = true
    let applied = false
    const apply = () => {
      if (applied) return
      applied = true
      deps.apply(next)
    }
    try {
      if (!deps.reducedMotion()) await deps.flip(next, apply)
    } catch {
      // No flip (e.g. no canvas); the mode switches without it.
    } finally {
      apply()
      busy = false
    }
  }
}
