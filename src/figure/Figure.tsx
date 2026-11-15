'use client'

import dynamic from 'next/dynamic'

import type { Variant } from './model'

// Three.js only loads with the figure, after the rest of the page.
const VoxelFigure = dynamic(() => import('./VoxelFigure'), { ssr: false })

type Props = { variant: Variant; label: string }

// A fixed-size square, so nothing jumps while the figure loads (or if WebGL is missing).
// In dark mode a soft light glow sits behind it: the dark hair and clothes would
// otherwise blend into the dark background.
export function Figure({ variant, label }: Props) {
  return (
    <div
      role="img"
      aria-label={label}
      className="relative mx-auto size-64 rounded-full sm:size-72 dark:bg-[radial-gradient(circle,var(--spot)_0%,transparent_68%)]"
    >
      <VoxelFigure variant={variant} />
    </div>
  )
}
