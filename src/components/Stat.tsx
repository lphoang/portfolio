import { formatCompact, formatFull } from '@/lib/format'

type Props = { label: string; value: number | null }

// A big dot-matrix number; null means the channel hides it.
export function Stat({ label, value }: Props) {
  return (
    <div className="card p-3 text-center">
      {value === null ? (
        <div className="font-label text-sm leading-7 text-muted">hidden</div>
      ) : (
        <div className="font-num text-2xl leading-7 text-num" title={formatFull(value)}>
          {formatCompact(value)}
        </div>
      )}
      <div className="mt-1 font-label text-[10px] text-muted">{label}</div>
    </div>
  )
}
