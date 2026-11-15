'use client'

import { createRainPainter } from './painters'
import { useBackgroundCanvas } from './useBackgroundCanvas'

export function TerminalRain() {
  const ref = useBackgroundCanvas('terminal', createRainPainter)
  return <canvas ref={ref} className="era-bg terminal-only" aria-hidden />
}
