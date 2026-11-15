import type { Era } from './era'

export type CraftPosition = 'left' | 'right' | 'fly' | 'hidden'

// The craft and the curtain take this long; CSS uses the same value.
export const TRANSITION_MS = 1600

export function transitionMode(input: {
  reducedMotion: boolean
  canTransition: boolean
}): 'instant' | 'flyover' | 'curtain' {
  if (input.reducedMotion) return 'instant'
  return input.canTransition ? 'curtain' : 'flyover'
}

type Deps = {
  apply: (era: Era) => void
  startViewTransition?: (update: () => void) => { finished: Promise<void> }
  showCraft: (era: Era, position: CraftPosition) => void
  reducedMotion: () => boolean
  wait: (ms: number) => Promise<void>
}

/**
 * Switches eras with a craft flying left to right:
 * - curtain: the browser reveals the new era behind the craft (View Transitions);
 * - flyover: no View Transitions, so the era switches and the craft just flies over;
 * - instant: reduced motion, no craft.
 * Clicks during a switch are ignored, and the craft is always hidden afterwards.
 */
export function createEraSwitcher(deps: Deps) {
  let busy = false

  return async function switchEra(next: Era) {
    if (busy) return
    busy = true
    const mode = transitionMode({
      reducedMotion: deps.reducedMotion(),
      canTransition: Boolean(deps.startViewTransition)
    })
    try {
      if (mode === 'instant') {
        deps.apply(next)
        return
      }
      if (mode === 'flyover') {
        deps.apply(next)
        deps.showCraft(next, 'fly')
        await deps.wait(TRANSITION_MS)
        return
      }
      deps.showCraft(next, 'left')
      const transition = deps.startViewTransition!(() => {
        deps.apply(next)
        deps.showCraft(next, 'right')
      })
      await transition.finished.catch(() => {
        // Skipped or interrupted (e.g. the tab was hidden); the era is applied anyway.
      })
    } finally {
      if (mode !== 'instant') deps.showCraft(next, 'hidden')
      busy = false
    }
  }
}
