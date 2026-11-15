import Link from 'next/link'

import { NavLinks } from './NavLinks'
import { ThemeToggle } from './ThemeToggle'

export function Navbar() {
  return (
    <header className="sticky top-0 z-10 border-b border-line bg-bg/80 backdrop-blur">
      <nav className="mx-auto flex w-full max-w-3xl items-center gap-4 px-4 py-3 sm:px-6">
        <Link
          href="/"
          className="mr-auto font-display text-lg font-bold text-accent"
        >
          leph
        </Link>
        <NavLinks />
        <ThemeToggle />
      </nav>
    </header>
  )
}
