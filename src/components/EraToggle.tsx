'use client'

import { useRef } from 'react'

import { type Era, applyEra } from '@/lib/era'
import { type CraftPosition, createEraSwitcher } from '@/lib/eraSwitch'
import { useEra } from '@/lib/useEra'

// The craft element lives outside the navbar (see Craft); move it by attributes so the
// change is in the DOM before the browser captures the page for the transition.
function showCraft(era: Era, position: CraftPosition) {
  const craft = document.getElementById('craft')
  if (!craft) return
  craft.dataset.craft = era
  craft.dataset.position = position
}

function makeSwitcher() {
  return createEraSwitcher({
    apply: applyEra,
    startViewTransition: document.startViewTransition
      ? update => document.startViewTransition(update)
      : undefined,
    showCraft,
    reducedMotion: () =>
      window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    wait: ms => new Promise(resolve => setTimeout(resolve, ms))
  })
}

export function EraToggle() {
  const era = useEra()
  const switcher = useRef<ReturnType<typeof createEraSwitcher> | null>(null)
  const next: Era = era === 'terminal' ? 'starry' : 'terminal'

  return (
    <button
      type="button"
      onClick={() => {
        switcher.current ??= makeSwitcher()
        void switcher.current(next)
      }}
      aria-label={`Switch to the ${next === 'starry' ? '1889' : 'terminal'} theme`}
      className="era-toggle font-label text-xs"
    >
      <span className="seg seg-starry">1889</span>
      <span className="seg seg-terminal">&gt;_</span>
    </button>
  )
}
