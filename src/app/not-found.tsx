import Link from 'next/link'

import { SiteShell } from '@/components/SiteShell'

// The 404 renders under the root layout only, so it brings the site's frame itself.
export default function NotFound() {
  return (
    <SiteShell>
      <section className="py-16">
        <h1 className="font-display text-3xl font-bold">Not found</h1>
        <p className="mt-2 text-muted">
          The page you are looking for does not exist.
        </p>
        <Link
          href="/"
          className="mt-6 inline-block font-label text-xs text-accent underline underline-offset-4"
        >
          Back home
        </Link>
      </section>
    </SiteShell>
  )
}
