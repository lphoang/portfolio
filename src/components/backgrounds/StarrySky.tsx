'use client'

import { createStarryPainter } from './painters'
import { useBackgroundCanvas } from './useBackgroundCanvas'

export function StarrySky() {
  const ref = useBackgroundCanvas('starry', createStarryPainter)
  return <canvas ref={ref} className="era-bg starry-only" aria-hidden />
}
