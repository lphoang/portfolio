const compact = new Intl.NumberFormat('en', {
  notation: 'compact',
  maximumFractionDigits: 1
})
const full = new Intl.NumberFormat('en')
const date = new Intl.DateTimeFormat('en', {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
  timeZone: 'UTC'
})

// 12400 → "12.4K"
export const formatCompact = (n: number): string => compact.format(n)

// 12400 → "12,400"
export const formatFull = (n: number): string => full.format(n)

// "2026-11-03T10:00:00Z" → "Nov 3, 2026"
export const formatDate = (iso: string): string => date.format(new Date(iso))
