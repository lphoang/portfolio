import type { Metadata } from 'next'
import {
  Doto,
  IBM_Plex_Mono,
  Inter,
  JetBrains_Mono,
  Silkscreen,
  Space_Grotesk,
  VT323
} from 'next/font/google'

import { EraFavicon } from '@/components/EraFavicon'
import { Navbar } from '@/components/Navbar'
import { Silhouettes } from '@/components/backgrounds/Silhouettes'
import { StarrySky } from '@/components/backgrounds/StarrySky'
import { TerminalRain } from '@/components/backgrounds/TerminalRain'
import { eraScript } from '@/lib/era'

import './globals.css'

// Dev mode
const vt323 = VT323({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-vt323'
})
const plexMono = IBM_Plex_Mono({
  subsets: ['latin', 'vietnamese'],
  weight: ['400', '600'],
  variable: '--font-plex-mono'
})
const jetbrains = JetBrains_Mono({
  subsets: ['latin'],
  weight: '800',
  variable: '--font-jetbrains'
})
// Vibe mode. Dev is the default mode, so these load when needed.
const spaceGrotesk = Space_Grotesk({
  subsets: ['latin', 'vietnamese'],
  weight: ['500', '700'],
  variable: '--font-space-grotesk',
  preload: false
})
const inter = Inter({
  subsets: ['latin', 'vietnamese'],
  weight: ['400', '600'],
  variable: '--font-inter',
  preload: false
})
const silkscreen = Silkscreen({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-silkscreen',
  preload: false
})
const doto = Doto({
  subsets: ['latin'],
  weight: '900',
  variable: '--font-doto',
  preload: false
})

export const metadata: Metadata = {
  title: { default: 'Le Phuoc Hoang', template: '%s · Le Phuoc Hoang' },
  description:
    'Software engineer in Da Nang, Vietnam: work history, YouTube channels and apps.'
}

export default function RootLayout({
  children
}: {
  children: React.ReactNode
}) {
  const fonts = [
    vt323,
    plexMono,
    jetbrains,
    spaceGrotesk,
    inter,
    silkscreen,
    doto
  ].map(f => f.variable)
  return (
    // data-era is the default mode for the first paint (and without JS); the head
    // script switches it to the saved mode before paint.
    <html
      lang="en"
      data-era="dev"
      className={fonts.join(' ')}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: eraScript }} />
      </head>
      <body className="min-h-dvh antialiased">
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
      </body>
    </html>
  )
}
