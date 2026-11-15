// The craft that flies across the screen when the era changes: an airship on the
// way to 1889, a pixel spaceship on the way to the terminal. EraToggle moves it
// by setting data-position and data-craft (see .craft in globals.css).

// Original pixel-art ship: G body, L wings, C cockpit, F flame.
const SHIP_MAP = [
  '......GG........',
  '.....GGGG.......',
  'F.LL.GGGGGG.....',
  'FFLLGGGGGGGGCC..',
  'FFLLGGGGGGGGGCCC',
  'FFLLGGGGGGGGGCCC',
  'FFLLGGGGGGGGCC..',
  'F.LL.GGGGGG.....',
  '.....GGGG.......',
  '......GG........'
]
const SHIP_COLORS: Record<string, string> = {
  G: '#39ff6a',
  L: '#c6ff3d',
  C: '#2bffc6',
  F: '#ffcc33'
}

function PixelShip() {
  return (
    <svg viewBox="0 0 160 100" className="craft-ship">
      {SHIP_MAP.flatMap((row, y) =>
        [...row].map((cell, x) =>
          SHIP_COLORS[cell] ? (
            <rect
              key={`${x}-${y}`}
              x={x * 10}
              y={y * 10}
              width={10}
              height={10}
              fill={SHIP_COLORS[cell]}
            />
          ) : null
        )
      )}
    </svg>
  )
}

function Airship() {
  return (
    <svg viewBox="0 0 220 100" className="craft-airship">
      <g fill="#d9d2c0" opacity=".55">
        <circle cx="10" cy="44" r="7" />
        <circle cx="2" cy="36" r="5" />
        <circle cx="16" cy="32" r="4" />
      </g>
      <path d="M30 40 L14 22 L22 40 L14 58 Z" fill="#7d5a32" />
      <ellipse
        cx="112"
        cy="40"
        rx="86"
        ry="28"
        fill="#c9a46a"
        stroke="#6b4a2b"
        strokeWidth="3"
      />
      <path
        d="M40 40 H184 M56 22 C 100 30, 130 30, 170 22 M56 58 C 100 50, 130 50, 170 58"
        stroke="#8a6a3c"
        strokeWidth="2"
        fill="none"
      />
      <path
        d="M86 66 L92 76 M138 66 L132 76"
        stroke="#4a3220"
        strokeWidth="2"
      />
      <rect
        x="86"
        y="74"
        width="50"
        height="15"
        rx="3"
        fill="#5a3b22"
        stroke="#3a2614"
        strokeWidth="2"
      />
      <g fill="#f4d35e">
        <rect x="94" y="78" width="7" height="6" />
        <rect x="107" y="78" width="7" height="6" />
        <rect x="120" y="78" width="7" height="6" />
      </g>
      <path d="M196 40 L206 26 L206 54 Z" fill="#7a1f2b" />
    </svg>
  )
}

export function Craft() {
  return (
    <div
      id="craft"
      className="craft"
      data-position="hidden"
      data-craft="starry"
      aria-hidden
    >
      <Airship />
      <PixelShip />
    </div>
  )
}
