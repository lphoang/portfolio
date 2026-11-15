import Link from 'next/link'

import type { AppInfo } from '@/data/apps'

type Props = { app: AppInfo; href?: string }

export function AppCard({ app, href }: Props) {
  const body = (
    <>
      <div className="flex items-center justify-between gap-3">
        <h3 className="font-display text-lg font-bold">{app.name}</h3>
        <span className="shrink-0 rounded bg-badge px-2 py-0.5 font-label text-[10px] text-badge-ink">
          {app.status}
        </span>
      </div>
      <p className="mt-1 text-sm text-muted">{app.blurb}</p>
    </>
  )

  if (!href) return <div className="card p-4">{body}</div>
  return (
    <Link href={href} className="card block p-4 transition-colors hover:border-accent">
      {body}
    </Link>
  )
}
