import type { Metadata } from 'next'
import { Doto, Inter, Silkscreen, Space_Grotesk } from 'next/font/google'

import { Navbar } from '@/components/Navbar'
import { themeScript } from '@/lib/theme'

import './globals.css'

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin', 'vietnamese'],
  weight: ['500', '700'],
  variable: '--font-space-grotesk'
})
const inter = Inter({
  subsets: ['latin', 'vietnamese'],
  weight: ['400', '600'],
  variable: '--font-inter'
})
const silkscreen = Silkscreen({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-silkscreen'
})
const doto = Doto({
  subsets: ['latin'],
  weight: '900',
  variable: '--font-doto'
})

export const metadata: Metadata = {
  title: { default: 'Le Phuoc Hoang', template: '%s · Le Phuoc Hoang' },
  description:
    'Software engineer in Da Nang, Vietnam: work history, YouTube channels and apps.',
  icons: '/images/alien.svg'
}

export default function RootLayout({
  children
}: {
  children: React.ReactNode
}) {
  const fonts = [spaceGrotesk, inter, silkscreen, doto].map(f => f.variable)
  return (
    <html lang="en" className={fonts.join(' ')} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
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
