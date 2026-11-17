import type { Metadata } from 'next'
import { Nunito } from 'next/font/google'

import { KanotesShell } from '@/components/kanotes/KanotesShell'

import '../../kanotes.css'

// The app's own rounded face, with Vietnamese diacritics.
const nunito = Nunito({
  subsets: ['latin', 'vietnamese'],
  weight: ['400', '700', '800', '900'],
  variable: '--font-nunito'
})

export const metadata: Metadata = {
  title: { absolute: 'Kanotes: notes from any screen' },
  description:
    'Hold the side button and Kapy turns any screen into an event or a note. Coming soon to Google Play.',
  icons: { icon: '/apps/kanotes/kapy.svg' }
}

// The language is picked before paint by the script in the root layout
// (languageScript in src/lib/kanotesLang.ts).
export default function KanotesLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <div className={nunito.variable}>
      <KanotesShell>{children}</KanotesShell>
    </div>
  )
}
