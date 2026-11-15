// The two looks of the site: Vibe mode (Game Boy greens on a starry night sky)
// and Dev mode (a green terminal). The code calls them eras.
export type Era = 'vibe' | 'dev'

export const ERA_KEY = 'era'
export const DEFAULT_ERA: Era = 'dev'

// A saved mode wins; anything else (nothing saved, a value from an older version
// of the site) is Dev mode.
export function resolveEra(stored: string | null): Era {
  return stored === 'vibe' || stored === 'dev' ? stored : 'dev'
}

export function faviconFor(era: Era): string {
  return `/icons/era-${era}.svg`
}

// Switches the page to an era and remembers it.
export function applyEra(next: Era) {
  document.documentElement.dataset.era = next
  try {
    localStorage.setItem(ERA_KEY, next)
  } catch {
    // Storage can be blocked; the choice then lasts until reload.
  }
}

// Runs in <head> before the page paints, so the right era shows without a flash.
// localStorage can throw (private mode, blocked storage); then we use the default.
export const eraScript = `(function () {
  var resolveEra = ${resolveEra.toString()};
  var stored = null;
  try { stored = localStorage.getItem('${ERA_KEY}'); } catch (e) {}
  var era = resolveEra(stored);
  document.documentElement.dataset.era = era;
})();`
