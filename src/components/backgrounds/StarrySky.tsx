'use client'

import { createStarryPainter } from './painters'
import { useBackgroundCanvas } from './useBackgroundCanvas'

export function StarrySky() {
  const ref = useBackgroundCanvas('vibe', createStarryPainter)
  return <canvas ref={ref} className="era-bg vibe-only" aria-hidden />
}
