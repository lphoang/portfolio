'use client'

import { useSyncExternalStore } from 'react'

// Dark mode is the `dark` class on <html> (set by the theme script and the toggle).
function subscribe(onChange: () => void) {
  const observer = new MutationObserver(onChange)
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['class']
  })
  return () => observer.disconnect()
}

const isDarkNow = () => document.documentElement.classList.contains('dark')

export function useIsDark(): boolean {
  return useSyncExternalStore(subscribe, isDarkNow, () => false)
}
