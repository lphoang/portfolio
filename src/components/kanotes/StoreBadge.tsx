import { T } from './T'

// The signed APK, attached to a release of the public portfolio repo (the app's code stays private).
export const APK_URL =
  'https://github.com/lphoang/portfolio/releases/download/kanotes-v0.1.0/kanotes-0.1.0.apk'

/**
 * Kanotes isn't on Google Play yet: "Coming soon" sits above a Play button that
 * goes nowhere, and the APK can be downloaded meanwhile.
 */
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
      <a className="k-apk" href={APK_URL} download>
        <svg
          viewBox="0 0 24 24"
          width={20}
          height={20}
          fill="none"
          stroke="currentColor"
          strokeWidth={1.8}
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M12 4v11m-5-5 5 5 5-5M5 19.5h14" />
        </svg>
        <T vi="Tải tệp APK" en="Download the APK" />
        <span className="k-apk-size">95 MB</span>
      </a>
      <span className="k-apk-note">
        <T
          vi="Android 12 trở lên. Bản này đọc ngay trên điện thoại; Kanotes Cloud cần bản trên Google Play."
          en="Android 12 or newer. This copy reads on your phone; Kanotes Cloud needs the Google Play version."
        />
      </span>
    </div>
  )
}
