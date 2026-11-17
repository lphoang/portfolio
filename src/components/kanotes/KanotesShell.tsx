import Image from 'next/image'
import Link from 'next/link'

import { LanguageSwitch } from './LanguageSwitch'

// The Kanotes pages' own frame: the app's look, not the portfolio's.
export function KanotesShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="kanotes">
      <header className="k-top">
        <div className="k-wrap k-top-row">
          <Link href="/apps/kanotes" className="k-brand">
            <Image
              src="/apps/kanotes/kapy.svg"
              alt=""
              width={40}
              height={36}
              unoptimized
            />
            Kanotes
          </Link>
          <LanguageSwitch />
        </div>
      </header>
      {children}
    </div>
  )
}
