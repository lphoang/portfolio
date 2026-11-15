import type { Metadata } from 'next'

import { AppCard } from '@/components/AppCard'
import { SectionLabel } from '@/components/SectionLabel'
import { apps } from '@/data/apps'

export const metadata: Metadata = { title: 'Apps' }

export default function AppsPage() {
  return (
    <div className="space-y-8">
      {/* The 3D figure goes here. */}
      <section>
        <SectionLabel>apps</SectionLabel>
        <div className="space-y-3">
          {apps.map(app => (
            <AppCard key={app.name} app={app} />
          ))}
        </div>
      </section>
    </div>
  )
}
