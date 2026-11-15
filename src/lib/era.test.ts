import { eraScript, faviconFor, resolveEra } from './era'

test('a stored valid era wins', () => {
  expect(resolveEra('starry')).toBe('starry')
  expect(resolveEra('terminal')).toBe('terminal')
})

test('anything else falls back to the terminal', () => {
  for (const stored of [null, 'light', 'dark', 'purple'])
    expect(resolveEra(stored)).toBe('terminal')
})

test('favicons follow the era', () => {
  expect(faviconFor('terminal')).toBe('/icons/era-terminal.svg')
  expect(faviconFor('starry')).toBe('/icons/era-starry.svg')
})

// Runs the inline head script against a tiny fake page.
function runScript(getItem: () => string | null) {
  const root = { dataset: {} as Record<string, string> }
  const icon = { href: '/icons/era-terminal.svg' }
  const fakeDocument = {
    documentElement: root,
    querySelector: (selector: string) =>
      selector === 'link[rel="icon"]' ? icon : null
  }
  const fakeStorage = { getItem }
  new Function('document', 'localStorage', eraScript)(fakeDocument, fakeStorage)
  return { era: root.dataset.era, icon: icon.href }
}

test('the head script survives blocked storage and picks the terminal', () => {
  const result = runScript(() => {
    throw new Error('blocked')
  })
  expect(result).toEqual({ era: 'terminal', icon: '/icons/era-terminal.svg' })
})

test('the head script applies the stored era and its favicon', () => {
  expect(runScript(() => 'starry')).toEqual({
    era: 'starry',
    icon: '/icons/era-starry.svg'
  })
})
