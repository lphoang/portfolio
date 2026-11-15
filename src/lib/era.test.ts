import { eraScript, faviconFor, resolveEra } from './era'

test('a stored valid mode wins', () => {
  expect(resolveEra('vibe')).toBe('vibe')
  expect(resolveEra('dev')).toBe('dev')
})

test('anything else falls back to dev mode', () => {
  for (const stored of [null, 'light', 'dark', 'starry', 'terminal', 'purple'])
    expect(resolveEra(stored)).toBe('dev')
})

test('favicons follow the mode', () => {
  expect(faviconFor('dev')).toBe('/icons/era-dev.svg')
  expect(faviconFor('vibe')).toBe('/icons/era-vibe.svg')
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

test('the head script survives blocked storage and picks dev mode', () => {
  expect(
    runScript(() => {
      throw new Error('blocked')
    })
  ).toBe('dev')
})

test('the head script applies the stored mode', () => {
  expect(runScript(() => 'vibe')).toBe('vibe')
})
