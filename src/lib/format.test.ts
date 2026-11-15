import { formatCompact, formatDate, formatFull } from './format'

test('short form for big numbers', () => {
  expect(formatCompact(0)).toBe('0')
  expect(formatCompact(950)).toBe('950')
  expect(formatCompact(12_400)).toBe('12.4K')
  expect(formatCompact(1_200_000)).toBe('1.2M')
})

test('full number with thousands separators', () => {
  expect(formatFull(12_400)).toBe('12,400')
})

test('dates read like "Nov 3, 2026" in UTC', () => {
  expect(formatDate('2026-11-03T10:00:00Z')).toBe('Nov 3, 2026')
  expect(formatDate('2026-11-03T23:30:00Z')).toBe('Nov 3, 2026')
})
