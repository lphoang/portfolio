'use client'

import { useEffect, useSyncExternalStore } from 'react'

import {
  type KanotesLang,
  applyLanguage,
  languageOnMount,
  readSavedLanguage
} from '@/lib/kanotesLang'

// The language is the `data-kanotes-lang` attribute on <html>.
function subscribe(onChange: () => void) {
  const observer = new MutationObserver(onChange)
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['data-kanotes-lang']
  })
  return () => observer.disconnect()
}

const languageNow = (): KanotesLang =>
  document.documentElement.dataset.kanotesLang === 'vi' ? 'vi' : 'en'

function savedLanguage(): string | null {
  try {
    return readSavedLanguage(window.localStorage)
  } catch {
    // Even reading window.localStorage can throw when site data is blocked.
    return null
  }
}

const choices: { lang: KanotesLang; label: string; name: string }[] = [
  { lang: 'vi', label: 'VI', name: 'Tiếng Việt' },
  { lang: 'en', label: 'EN', name: 'English' }
]

export function LanguageSwitch() {
  const current = useSyncExternalStore(subscribe, languageNow, () => 'en')

  useEffect(() => {
    const lang = languageOnMount(
      document.documentElement.dataset.kanotesLang,
      savedLanguage(),
      navigator.languages ?? [navigator.language]
    )
    if (lang) applyLanguage(lang, false)
  }, [])

  return (
    <div className="k-switch" role="group" aria-label="Ngôn ngữ / Language">
      {choices.map(choice => (
        <button
          key={choice.lang}
          type="button"
          title={choice.name}
          onClick={() => applyLanguage(choice.lang, true)}
          aria-pressed={current === choice.lang}
          lang={choice.lang}
        >
          {choice.label}
        </button>
      ))}
    </div>
  )
}
