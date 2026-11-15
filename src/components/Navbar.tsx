import Link from 'next/link'

import { NavLinks } from './NavLinks'
import { ThemeToggle } from './ThemeToggle'

export function Navbar() {
  return (
    <header className="era-nav sticky top-0 z-10 border-b border-line">
      <nav className="mx-auto flex w-full max-w-3xl items-center gap-4 px-4 py-3 sm:px-6">
        <Link
          href="/"
          className="era-logo mr-auto font-display text-lg text-accent"
        >
          leph
        </Link>
        <NavLinks />
        <ThemeToggle />
      </nav>
    </header>
  )
}
