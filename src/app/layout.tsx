import type { Metadata } from 'next'
import {
  IBM_Plex_Mono,
  JetBrains_Mono,
  Playfair_Display,
  Special_Elite,
  VT323
} from 'next/font/google'

import { Navbar } from '@/components/Navbar'
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
        <Navbar />
        <main className="mx-auto w-full max-w-3xl px-4 pt-6 pb-16 sm:px-6">
          {children}
        </main>
      </body>
    </html>
  )
}
