// The cypress on the left and the sleeping village along the bottom (1889 only).
export function Silhouettes() {
  return (
    <div className="starry-only" aria-hidden>
      <svg
        className="cypress"
        viewBox="0 0 120 520"
        preserveAspectRatio="xMinYMax meet"
      >
        <path
          d="M60 0 C 74 70, 66 120, 82 170 C 98 230, 74 260, 92 320 C 110 380, 96 430, 112 520 L 8 520 C 22 440, 12 400, 26 340 C 40 280, 22 250, 38 190 C 50 140, 42 80, 60 0 Z"
          fill="#0e1a12"
        />
        <path
          d="M58 40 C 66 90, 56 130, 70 180 M46 220 C 56 260, 44 300, 58 350 M76 260 C 88 310, 80 350, 94 410"
          stroke="#1d3324"
          strokeWidth="5"
          fill="none"
          strokeLinecap="round"
        />
      </svg>
      <svg
        className="village"
        viewBox="0 0 1200 140"
        preserveAspectRatio="none"
      >
        <path
          d="M0 140 L0 96 C 120 80, 220 110, 340 92 L 360 92 L 360 70 L 400 52 L 440 70 L 440 92 L 520 92 L 520 64 L 556 64 L 556 92 L 610 92 L 640 14 L 670 92 L 760 88 L 760 66 L 800 48 L 840 66 L 840 90 C 980 80, 1080 104, 1200 90 L 1200 140 Z"
          fill="#081227"
        />
        <g fill="#f4d35e" opacity=".8">
          <rect x="378" y="74" width="7" height="7" />
          <rect x="536" y="72" width="7" height="7" />
          <rect x="784" y="70" width="7" height="7" />
          <rect x="420" y="76" width="6" height="6" />
        </g>
      </svg>
    </div>
  )
}
