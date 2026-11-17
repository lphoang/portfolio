import { T } from './T'

/** Kanotes isn't on Google Play yet: "Coming soon" sits above a button that goes nowhere. */
export function StoreBadge({ center = false }: { center?: boolean }) {
  return (
    <div className={center ? 'k-store k-store--center' : 'k-store'}>
      <span className="k-soon">
        <T vi="Sắp ra mắt" en="Coming soon" />
      </span>
      <span className="k-play" aria-disabled="true">
        <svg viewBox="0 0 24 24" width={22} height={22} aria-hidden="true">
          <path
            fill="currentColor"
            d="M6 4.5v15a1 1 0 0 0 1.5.86l12.5-7.5a1 1 0 0 0 0-1.72L7.5 3.64A1 1 0 0 0 6 4.5Z"
          />
        </svg>
        <T vi="Tải trên Google Play" en="Get it on Google Play" />
      </span>
    </div>
  )
}
