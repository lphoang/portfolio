import { EraFavicon } from '@/components/EraFavicon'
import { Navbar } from '@/components/Navbar'
import { Silhouettes } from '@/components/backgrounds/Silhouettes'
import { StarrySky } from '@/components/backgrounds/StarrySky'
import { TerminalRain } from '@/components/backgrounds/TerminalRain'

// The portfolio's frame: the era backgrounds, the navbar and the page column.
// Pages outside the portfolio's look (Kanotes) don't use it.
export function SiteShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <TerminalRain />
      <StarrySky />
      <Silhouettes />
      <div className="text-haze" aria-hidden />
      <div className="crt dev-only" aria-hidden />
      <Navbar />
      <main className="relative z-[4] mx-auto w-full max-w-3xl px-4 pt-6 pb-16 sm:px-6">
        {children}
      </main>
      <EraFavicon />
    </>
  )
}
