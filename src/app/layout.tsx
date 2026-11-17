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

import { eraScript } from '@/lib/era'
import { languageScript } from '@/lib/kanotesLang'

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
        {/* Picks the Kanotes page's language before paint; must run from the root
            layout, since client-side navigation never runs a nested layout's script. */}
        <script dangerouslySetInnerHTML={{ __html: languageScript }} />
      </head>
      {/* The portfolio's frame is in (site)/layout.tsx; Kanotes has its own. */}
      <body className="min-h-dvh antialiased">{children}</body>
    </html>
  )
}
