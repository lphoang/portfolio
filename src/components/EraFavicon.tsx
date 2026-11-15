'use client'

import { faviconFor } from '@/lib/era'
import { useEra } from '@/lib/useEra'

// The tab icon follows the era. React renders (and hoists into <head>) this link
// and updates it when the era changes; the server renders the default era's icon.
export function EraFavicon() {
  const era = useEra()
  return <link rel="icon" href={faviconFor(era)} type="image/svg+xml" />
}
