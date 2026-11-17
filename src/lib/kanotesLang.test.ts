import {
  languageOnMount,
  languageScript,
  pickLanguage,
  readSavedLanguage
} from './kanotesLang'

test('a saved choice wins', () => {
  expect(pickLanguage('en', ['vi-VN'])).toBe('en')
  expect(pickLanguage('vi', ['en-US'])).toBe('vi')
})

test('otherwise Vietnamese browsers get Vietnamese', () => {
  expect(pickLanguage(null, ['vi-VN', 'en'])).toBe('vi')
  expect(pickLanguage(null, ['en-US', 'vi'])).toBe('vi')
  expect(pickLanguage(null, ['vi'])).toBe('vi')
})

test('everyone else gets English', () => {
  expect(pickLanguage(null, ['en-US'])).toBe('en')
  expect(pickLanguage(null, ['cs-CZ'])).toBe('en')
  expect(pickLanguage(null, [])).toBe('en')
})

test('a saved value that is not vi or en is ignored', () => {
  expect(pickLanguage('fr', ['vi-VN'])).toBe('vi')
  expect(pickLanguage('', ['en-US'])).toBe('en')
})

test('blocked storage reads as nothing saved', () => {
  const throwing = {
    getItem: () => {
      throw new Error('blocked')
    }
  }
  expect(readSavedLanguage(throwing)).toBeNull()
  expect(readSavedLanguage(undefined)).toBeNull()
  expect(readSavedLanguage({ getItem: () => 'vi' })).toBe('vi')
})

test('on a client-side visit the language is set once', () => {
  expect(languageOnMount(undefined, null, ['vi-VN'])).toBe('vi')
  expect(languageOnMount('en', null, ['vi-VN'])).toBeNull()
})

test('the pre-paint script sets the attribute from the same rule', () => {
  expect(languageScript).toContain('kanotes-lang')
  expect(languageScript).toContain('kanotesLang')
})

test('the pre-paint script really runs, even with blocked storage', () => {
  const dataset: Record<string, string> = {}
  const run = new Function(
    'document',
    'navigator',
    'localStorage',
    languageScript
  )
  run(
    { documentElement: { dataset } },
    { languages: ['vi-VN'] },
    { getItem: () => null }
  )
  expect(dataset.kanotesLang).toBe('vi')
  const blocked = {
    getItem: () => {
      throw new Error('blocked')
    }
  }
  run({ documentElement: { dataset } }, { languages: ['en-US'] }, blocked)
  expect(dataset.kanotesLang).toBe('en')
})
