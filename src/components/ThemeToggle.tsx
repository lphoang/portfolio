'use client'

import { applyEra } from '@/lib/era'
import { useEra } from '@/lib/useEra'

// Temporary bridge until the era toggle replaces this button.
export function ThemeToggle() {
  const era = useEra()
  const next = era === 'terminal' ? 'starry' : 'terminal'
  return (
    <button
      type="button"
      onClick={() => applyEra(next)}
      aria-label={`Switch to the ${next === 'starry' ? '1889' : 'terminal'} theme`}
      className="grid size-8 place-items-center rounded-[6px] border border-line text-sm hover:text-accent"
    >
      <span aria-hidden>{era === 'terminal' ? '>_' : '1889'}</span>
    </button>
  )
}
