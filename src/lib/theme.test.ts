import { resolveTheme } from './theme'

test('stored choice wins over the system', () => {
  expect(resolveTheme('dark', false)).toBe('dark')
  expect(resolveTheme('light', true)).toBe('light')
})

test('no or unknown stored value follows the system', () => {
  expect(resolveTheme(null, true)).toBe('dark')
  expect(resolveTheme(null, false)).toBe('light')
  expect(resolveTheme('purple', true)).toBe('dark')
})
