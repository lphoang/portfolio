'use client'

import dynamic from 'next/dynamic'
import { Component, type ReactNode, useEffect, useRef, useState } from 'react'

import type { Variant } from './model'

// Three.js only loads with the figure, after the rest of the page.
const VoxelFigure = dynamic(() => import('./VoxelFigure'), { ssr: false })

// If anything in the 3D figure fails (GPU, driver, memory), keep the placeholder
// instead of taking the whole page down.
class FigureErrorBoundary extends Component<
  { children: ReactNode },
  { failed: boolean }
> {
  state = { failed: false }
  static getDerivedStateFromError() {
    return { failed: true }
  }
  render() {
    return this.state.failed ? null : this.props.children
  }
}

// True while the element is on screen, so the figure stops drawing when scrolled away.
function useInView<T extends Element>() {
  const ref = useRef<T>(null)
  const [inView, setInView] = useState(true)
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) =>
      setInView(entry.isIntersecting)
    )
    observer.observe(ref.current!)
    return () => observer.disconnect()
  }, [])
  return { ref, inView }
}

type Props = { variant: Variant; label: string }

// A fixed-size square, so nothing jumps while the figure loads (or if WebGL is missing).
// A soft glow sits behind it (pale green in Vibe mode, bright green in Dev mode): the
// dark hair and clothes would otherwise blend into the dark background.
export function Figure({ variant, label }: Props) {
  const { ref, inView } = useInView<HTMLDivElement>()
  return (
    <div
      ref={ref}
      role="img"
      aria-label={label}
      className="relative mx-auto size-64 rounded-full [background:var(--glow-bg)] sm:size-72"
    >
      <FigureErrorBoundary>
        <VoxelFigure variant={variant} inView={inView} />
      </FigureErrorBoundary>
    </div>
  )
}
