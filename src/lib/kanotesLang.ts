// The Kanotes page is in Vietnamese and English. Both are in the HTML; the
// `data-kanotes-lang` attribute on <html> decides which one shows.
export type KanotesLang = 'vi' | 'en'

export const LANG_KEY = 'kanotes-lang'
/** The `dataset` key of `data-kanotes-lang`. */
export const LANG_ATTR = 'kanotesLang'

// A saved choice wins; otherwise a browser that lists Vietnamese gets
// Vietnamese, everyone else English. Self-contained: the pre-paint script
// below runs this exact function.
export function pickLanguage(
  saved: string | null,
  languages: readonly string[]
): KanotesLang {
  if (saved === 'vi' || saved === 'en') return saved
  for (const language of languages) {
    if (language.toLowerCase().startsWith('vi')) return 'vi'
  }
  return 'en'
}

// Storage can be missing or throw (private mode, blocked site data).
export function readSavedLanguage(
  storage: Pick<Storage, 'getItem'> | undefined
): string | null {
  try {
    return storage?.getItem(LANG_KEY) ?? null
  } catch {
    return null
  }
}

// The pre-paint script doesn't run when someone arrives through a client-side
// link, so the switch sets the language when it mounts, if nothing has yet.
export function languageOnMount(
  current: string | undefined,
  saved: string | null,
  languages: readonly string[]
): KanotesLang | null {
  if (current === 'vi' || current === 'en') return null
  return pickLanguage(saved, languages)
}

export function applyLanguage(lang: KanotesLang, remember: boolean) {
  document.documentElement.dataset[LANG_ATTR] = lang
  if (!remember) return
  try {
    localStorage.setItem(LANG_KEY, lang)
  } catch {
    // Storage can be blocked; the choice then lasts until the page reloads.
  }
}

// Runs before the page paints, so the right language shows without a flash.
export const languageScript = `(function () {
  var pickLanguage = ${pickLanguage.toString()};
  var saved = null;
  try { saved = localStorage.getItem('${LANG_KEY}'); } catch (e) {}
  var languages = navigator.languages && navigator.languages.length ? navigator.languages : [navigator.language || ''];
  document.documentElement.dataset.${LANG_ATTR} = pickLanguage(saved, languages);
})();`
