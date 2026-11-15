import { formatCompact, formatFull } from '@/lib/format'
import type { VideoStats } from '@/lib/youtube'

const WIDTH = 300
const HEIGHT = 80
const TOP = 12 // room for the max label
const GAP = 2
const RADIUS = 2

// A bar with rounded top corners and a square base on the baseline.
function barPath(x: number, w: number, h: number) {
  const r = Math.min(RADIUS, w / 2, h)
  const y = HEIGHT - h
  return `M${x},${HEIGHT}V${y + r}Q${x},${y} ${x + r},${y}H${x + w - r}Q${x + w},${y} ${x + w},${y + r}V${HEIGHT}Z`
}

// Views per upload, oldest on the left. Single series: no legend, the label names it.
export function ViewsChart({ videos }: { videos: VideoStats[] }) {
  const ordered = [...videos].reverse()
  const max = Math.max(1, ...ordered.map(v => v.views))
  const barWidth = (WIDTH - GAP * (ordered.length - 1)) / ordered.length

  return (
    <figure>
      <svg
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        className="h-auto w-full"
        role="img"
        aria-label={`Views of the latest ${ordered.length} videos`}
      >
        <text x={WIDTH} y={8} textAnchor="end" className="fill-muted font-label text-[7px]">
          max {formatCompact(max)}
        </text>
        {ordered.map((video, i) => {
          const x = i * (barWidth + GAP)
          const h = Math.max(1, (video.views / max) * (HEIGHT - TOP))
          return (
            <g key={video.id} data-bar className="group">
              <title>{`${video.title}: ${formatFull(video.views)} views`}</title>
              {/* Full-height hover target, bigger than the bar itself. */}
              <rect x={x} y={0} width={barWidth} height={HEIGHT} fill="transparent" />
              <path d={barPath(x, barWidth, h)} className="fill-bar group-hover:fill-accent" />
            </g>
          )
        })}
        <line x1={0} x2={WIDTH} y1={HEIGHT} y2={HEIGHT} className="stroke-line" />
      </svg>
      <figcaption className="mt-1 font-label text-[10px] text-muted">
        views per video, oldest → newest
      </figcaption>
    </figure>
  )
}
