import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'

import { SectionLabel } from '@/components/SectionLabel'

export const metadata: Metadata = {
  title: 'Kanotes',
  description:
    'Hold the side button and Kapy turns any screen into a calendar event or a note. Coming soon to Google Play.'
}

// Placeholders for now; the real phone captures replace these files (1080×2340).
const screens = [
  {
    src: '/apps/kanotes/screen-1.png',
    alt: "Kapy's card over a chat, with the event it found"
  },
  { src: '/apps/kanotes/screen-2.png', alt: 'Kapy reading the screen' },
  {
    src: '/apps/kanotes/screen-3.png',
    alt: 'Kanotes home with events and notes'
  },
  {
    src: '/apps/kanotes/screen-4.png',
    alt: 'Telling Kapy a plan in your own words'
  }
]

const features = [
  {
    title: 'Read any screen',
    text: 'Hold the side button, tap the Quick Settings tile, share, or copy text. Kapy hands you a filled-in card to check and save.'
  },
  {
    title: 'Vietnamese chats first',
    text: '“Mai 8h cf nha”, “thứ 6 tuần sau 7h tối”, “20/11 2h chiều”: Kapy reads them, even typed without accents.'
  },
  {
    title: 'Calendar and notes',
    text: 'Events go to a separate Kanotes calendar with a reminder; notes stay in the app. Old items clean themselves up.'
  },
  {
    title: 'Private by default',
    text: 'Kapy reads on your phone with Gemini Nano or Gemma. No account, no ads, no tracking. Kanotes Cloud is optional.'
  }
]

export default function KanotesPage() {
  return (
    <div className="space-y-8">
      <section className="card flex flex-col items-center gap-4 p-6 text-center">
        <Image
          src="/apps/kanotes/kapy.svg"
          alt="Kapy, the Kanotes capybara"
          width={112}
          height={100}
          unoptimized
        />
        <h1 className="font-display text-4xl font-bold">Kanotes</h1>
        <p className="max-w-md text-muted">
          Hold the side button and Kapy turns any screen into a calendar event
          or a note.
        </p>
        <div className="flex flex-col items-center gap-2">
          <span className="rounded bg-badge px-2 py-0.5 font-label text-[10px] text-badge-ink">
            Coming soon
          </span>
          <PlayButton />
        </div>
        <p className="font-label text-[10px] text-muted">
          Android · Tiếng Việt & English
        </p>
      </section>

      <section>
        <SectionLabel>screens</SectionLabel>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {screens.map(screen => (
            <Image
              key={screen.src}
              src={screen.src}
              alt={screen.alt}
              width={1080}
              height={2340}
              sizes="(min-width: 640px) 25vw, 50vw"
              className="h-auto w-full rounded-xl border border-line"
            />
          ))}
        </div>
      </section>

      <section>
        <SectionLabel>what it does</SectionLabel>
        <div className="grid gap-3 sm:grid-cols-2">
          {features.map(feature => (
            <div key={feature.title} className="card p-4">
              <h3 className="font-display text-lg font-bold">
                {feature.title}
              </h3>
              <p className="mt-1 text-sm text-muted">{feature.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <SectionLabel>privacy</SectionLabel>
        <div className="card p-4 text-sm">
          <p>
            By default, what&apos;s on your screen never leaves your phone. Only
            Kanotes Cloud, an optional subscription, sends it to Google to be
            read.
          </p>
          <Link
            href="/apps/kanotes/privacy"
            className="mt-2 inline-block text-accent underline-offset-4 hover:underline"
          >
            Read the privacy policy
          </Link>
        </div>
      </section>
    </div>
  )
}

/** Kanotes isn't on Google Play yet, so the button is shown but goes nowhere. */
function PlayButton() {
  return (
    <span
      aria-disabled="true"
      className="inline-flex cursor-not-allowed items-center gap-3 rounded-xl border border-line bg-panel px-4 py-2 opacity-70"
    >
      <svg
        viewBox="0 0 24 24"
        aria-hidden="true"
        className="h-6 w-6 fill-current"
      >
        <path d="M6 4.5v15a1 1 0 0 0 1.5.86l12.5-7.5a1 1 0 0 0 0-1.72L7.5 3.64A1 1 0 0 0 6 4.5Z" />
      </svg>
      <span className="text-left leading-tight">
        <span className="block font-label text-[9px] uppercase text-muted">
          Get it on
        </span>
        <span className="block font-display text-lg font-bold">
          Google Play
        </span>
      </span>
    </span>
  )
}
