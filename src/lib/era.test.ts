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
  new Function('document', 'localStorage', eraScript)(
    { documentElement: root },
    { getItem }
  )
  return root.dataset.era
}

test('the head script survives blocked storage and picks the terminal', () => {
  expect(
    runScript(() => {
      throw new Error('blocked')
    })
  ).toBe('terminal')
})

test('the head script applies the stored era', () => {
  expect(runScript(() => 'starry')).toBe('starry')
})
