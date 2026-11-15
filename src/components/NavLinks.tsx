'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const LINKS = [
  { href: '/channels', label: 'Channels' },
  { href: '/apps', label: 'Apps' }
]

export function NavLinks() {
  const pathname = usePathname()
  return (
    <>
      {LINKS.map(link => {
        const active = pathname === link.href
        return (
          <Link
            key={link.href}
            href={link.href}
            aria-current={active ? 'page' : undefined}
            className={`rounded px-1.5 py-0.5 font-label text-xs ${
              active ? 'bg-badge text-badge-ink' : 'text-ink hover:text-accent'
            }`}
          >
            {link.label}
          </Link>
        )
      })}
    </>
  )
}
