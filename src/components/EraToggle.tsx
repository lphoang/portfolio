'use client'

import { useRef } from 'react'

import { type Era, applyEra } from '@/lib/era'
import { createEraSwitcher } from '@/lib/eraSwitch'
import { playPixelFlip } from '@/lib/pixelFlip'
import { useEra } from '@/lib/useEra'

function makeSwitcher() {
  return createEraSwitcher({
    apply: applyEra,
    flip: playPixelFlip,
    reducedMotion: () =>
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
  })
}

export function EraToggle() {
  const era = useEra()
  const switcher = useRef<ReturnType<typeof createEraSwitcher> | null>(null)
  const next: Era = era === 'dev' ? 'vibe' : 'dev'

  return (
    <button
      type="button"
      onClick={() => {
        switcher.current ??= makeSwitcher()
        void switcher.current(next)
      }}
      aria-label={`Switch to ${next} mode`}
      className="era-toggle font-label text-xs"
    >
      <span className="seg seg-vibe">Vibe</span>
      <span className="seg seg-dev">Dev</span>
    </button>
  )
}
