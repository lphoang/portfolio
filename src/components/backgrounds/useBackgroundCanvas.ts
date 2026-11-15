'use client'

import { useEffect, useRef } from 'react'

import type { Era } from '@/lib/era'
import { useEra } from '@/lib/useEra'
import { useReducedMotion } from '@/lib/useReducedMotion'

import { needsRefit, shouldAnimate } from './motion'
import type { Painter } from './painters'

/**
 * Runs a full-screen background painter for one era: it animates only while that
 * era is shown and the tab is visible, and with reduced motion paints a single
 * still frame instead. The canvas is rebuilt only when its on-screen size really
 * changes: a phone's address bar showing or hiding fires resize events but leaves
 * the canvas (sized to the largest viewport) as it is.
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
    let resizeFrame = 0

    // clientWidth/Height: the canvas's own box, without any scrollbar gutter.
    const fit = () => {
      const size = { width: canvas.clientWidth, height: canvas.clientHeight }
      if (!needsRefit(canvas, size)) return
      canvas.width = size.width
      canvas.height = size.height
      painter.resize(size.width, size.height)
      if (reducedMotion) painter.still()
    }
    const onResize = () => {
      cancelAnimationFrame(resizeFrame)
      resizeFrame = requestAnimationFrame(fit)
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

    // A new painter starts from a blank canvas.
    canvas.width = 0
    fit()
    update()
    window.addEventListener('resize', onResize)
    document.addEventListener('visibilitychange', update)
    return () => {
      cancelAnimationFrame(raf)
      cancelAnimationFrame(resizeFrame)
      window.removeEventListener('resize', onResize)
      document.removeEventListener('visibilitychange', update)
    }
  }, [era, own, reducedMotion, createPainter])

  return ref
}
