import type { Metadata } from 'next'
import {
  IBM_Plex_Mono,
  JetBrains_Mono,
  Playfair_Display,
  Special_Elite,
  VT323
} from 'next/font/google'

import { Craft } from '@/components/Craft'
import { Navbar } from '@/components/Navbar'
import { Silhouettes } from '@/components/backgrounds/Silhouettes'
import { StarrySky } from '@/components/backgrounds/StarrySky'
import { TerminalRain } from '@/components/backgrounds/TerminalRain'
import { eraScript } from '@/lib/era'

import './globals.css'

// Terminal era
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
// 1889 era
const playfair = Playfair_Display({
  subsets: ['latin', 'vietnamese'],
  weight: ['400', '600'],
  style: ['normal', 'italic'],
  variable: '--font-playfair'
})
const specialElite = Special_Elite({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-special-elite'
})

export const metadata: Metadata = {
  title: { default: 'Le Phuoc Hoang', template: '%s · Le Phuoc Hoang' },
  description:
    'Software engineer in Da Nang, Vietnam: work history, YouTube channels and apps.',
  icons: '/icons/era-terminal.svg'
}

export default function RootLayout({
  children
}: {
  children: React.ReactNode
}) {
  const fonts = [vt323, plexMono, jetbrains, playfair, specialElite].map(
    f => f.variable
  )
  return (
    <html lang="en" className={fonts.join(' ')} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: eraScript }} />
      </head>
      <body className="min-h-dvh antialiased">
        {/* Rough, deckled edges for the 1889 paper cards (see .card in globals.css). */}
        <svg width="0" height="0" className="absolute" aria-hidden>
          <filter id="rough">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.035"
              numOctaves={3}
              seed={4}
              result="noise"
            />
            <feDisplacementMap
              in="SourceGraphic"
              in2="noise"
              scale={7}
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
        </svg>
        <TerminalRain />
        <StarrySky />
        <Silhouettes />
        <div className="sky-scrim starry-only" aria-hidden />
        <div className="crt terminal-only" aria-hidden />
        <Navbar />
        <main className="relative z-[4] mx-auto w-full max-w-3xl px-4 pt-6 pb-16 sm:px-6">
          {children}
        </main>
        <Craft />
      </body>
    </html>
  )
}
