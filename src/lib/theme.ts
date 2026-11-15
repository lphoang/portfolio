export type Theme = 'light' | 'dark'

export const THEME_KEY = 'theme'

// A saved choice wins; otherwise follow the system setting.
export function resolveTheme(stored: string | null, systemDark: boolean): Theme {
  if (stored === 'light' || stored === 'dark') return stored
  return systemDark ? 'dark' : 'light'
}

// Runs in <head> before the page paints, so the right theme shows without a flash.
// localStorage can throw (private mode, blocked storage); then we follow the system.
export const themeScript = `(function () {
  var resolveTheme = ${resolveTheme.toString()};
  var stored = null;
  try { stored = localStorage.getItem('${THEME_KEY}'); } catch (e) {}
  var systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  document.documentElement.classList.toggle('dark', resolveTheme(stored, systemDark) === 'dark');
})();`
