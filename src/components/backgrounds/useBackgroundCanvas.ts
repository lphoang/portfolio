'use client'

import { useEffect, useRef } from 'react'

import type { Era } from '@/lib/era'
import { useEra } from '@/lib/useEra'
import { useReducedMotion } from '@/lib/useReducedMotion'

import { shouldAnimate } from './motion'
import type { Painter } from './painters'

/**
 * Runs a full-screen background painter for one era: it animates only while that
 * era is shown and the tab is visible, follows window resizes, and with reduced
 * motion paints a single still frame instead.
 */
export function useBackgroundCanvas(
  own: Era,
  createPainter: (ctx: CanvasRenderingContext2D) => Painter
) {
  const ref = useRef<HTMLCanvasElement>(null)
  const era = useEra()
  const reducedMotion = useReducedMotion()

  useEffect(() => {
    if (era !== own) return
    const canvas = ref.current!
    const painter = createPainter(canvas.getContext('2d')!)
    let raf = 0

    const fit = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      painter.resize(canvas.width, canvas.height)
      if (reducedMotion) painter.still()
    }
    const loop = (time: number) => {
      painter.frame(time)
      raf = requestAnimationFrame(loop)
    }
    const update = () => {
      cancelAnimationFrame(raf)
      if (shouldAnimate({ era, own, hidden: document.hidden, reducedMotion }))
        raf = requestAnimationFrame(loop)
    }

    fit()
    update()
    window.addEventListener('resize', fit)
    document.addEventListener('visibilitychange', update)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', fit)
      document.removeEventListener('visibilitychange', update)
    }
  }, [era, own, reducedMotion, createPainter])

  return ref
}
