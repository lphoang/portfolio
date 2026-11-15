export type Era = 'starry' | 'terminal'

export const ERA_KEY = 'era'
export const DEFAULT_ERA: Era = 'terminal'

// A saved era wins; anything else (nothing saved, an old light/dark value) is the terminal.
export function resolveEra(stored: string | null): Era {
  return stored === 'starry' || stored === 'terminal' ? stored : 'terminal'
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
