import type { Metadata } from 'next'

import { AppCard } from '@/components/AppCard'
import { SectionLabel } from '@/components/SectionLabel'
import { apps } from '@/data/apps'
import { Figure } from '@/figure/Figure'

export const metadata: Metadata = { title: 'Apps' }

export default function AppsPage() {
  return (
    <div className="space-y-8">
      <Figure
        variant="player"
        label="3D figure of Hoang holding a handheld game console"
      />
      <section>
        <SectionLabel>apps</SectionLabel>
        <div className="space-y-3">
          {apps.map(app => (
            <AppCard key={app.name} app={app} href={app.href} />
          ))}
        </div>
      </section>
    </div>
  )
}
