import Image from 'next/image'

import { T } from './T'

type Shot = { src: string; alt: string }

/**
 * A phone around a 1080×2160 screenshot, one per language (CSS shows the
 * visitor's). `hero` marks the side button in yuzu, with a "hold" hint.
 */
export function PhoneFrame({
  vi,
  en,
  hero = false,
  small = false,
  eager = false
}: {
  vi: Shot
  en: Shot
  hero?: boolean
  small?: boolean
  eager?: boolean
}) {
  const classes = [
    'k-phone',
    hero && 'k-phone--hero',
    small && 'k-phone--small'
  ]
  const sizes = small
    ? '(min-width: 640px) 230px, 62vw'
    : '(min-width: 640px) 280px, 72vw'
  const loading = eager ? 'eager' : 'lazy'
  return (
    <div className={classes.filter(Boolean).join(' ')}>
      <Image
        className="k-vi"
        lang="vi"
        src={vi.src}
        alt={vi.alt}
        width={1080}
        height={2160}
        sizes={sizes}
        loading={loading}
      />
      <Image
        className="k-en"
        lang="en"
        src={en.src}
        alt={en.alt}
        width={1080}
        height={2160}
        sizes={sizes}
        loading={loading}
      />
      {hero && (
        <span className="k-hold" aria-hidden="true">
          <T vi="Giữ" en="Hold" />
        </span>
      )}
    </div>
  )
}
