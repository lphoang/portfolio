'use client'

import { createRainPainter } from './painters'
import { useBackgroundCanvas } from './useBackgroundCanvas'

export function TerminalRain() {
  const ref = useBackgroundCanvas('dev', createRainPainter)
  return <canvas ref={ref} className="era-bg dev-only" aria-hidden />
}
