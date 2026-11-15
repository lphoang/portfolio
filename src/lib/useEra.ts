'use client'

import { useSyncExternalStore } from 'react'

import { DEFAULT_ERA, type Era, resolveEra } from './era'

// The era is the `data-era` attribute on <html> (set by the head script and the toggle).
function subscribe(onChange: () => void) {
  const observer = new MutationObserver(onChange)
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['data-era']
  })
  return () => observer.disconnect()
}

const eraNow = (): Era =>
  resolveEra(document.documentElement.dataset.era ?? null)

export function useEra(): Era {
  return useSyncExternalStore(subscribe, eraNow, () => DEFAULT_ERA)
}
