'use client'

import { THEME_KEY } from '@/lib/theme'
import { useIsDark } from '@/lib/useIsDark'

export function ThemeToggle() {
  const dark = useIsDark()

  function toggle() {
    const next = !dark
    document.documentElement.classList.toggle('dark', next)
    try {
      localStorage.setItem(THEME_KEY, next ? 'dark' : 'light')
    } catch {
      // Storage can be blocked; the choice then lasts until reload.
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
      className="grid size-8 place-items-center rounded-[6px] border border-line text-sm hover:text-accent"
    >
      <span aria-hidden>{dark ? '☀' : '☾'}</span>
    </button>
  )
}
