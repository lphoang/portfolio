import Link from 'next/link'

import type { ChannelConfig } from '@/data/channels'
import { formatCompact, formatFull } from '@/lib/format'
import type { ChannelStats } from '@/lib/youtube'

type Props = { channel: ChannelConfig; stats: ChannelStats | null }

// One line on the home page: the channel and its subscriber count, when known.
export function ChannelTeaser({ channel, stats }: Props) {
  const subscribers = stats?.subscribers ?? null
  return (
    <Link
      href="/channels"
      className="card flex items-center justify-between gap-3 p-3 transition-colors hover:border-accent"
    >
      <span className="font-display font-bold">{channel.title}</span>
      {subscribers !== null && (
        <span className="font-label text-[10px] text-muted">
          <span
            className="font-num text-lg text-num"
            title={formatFull(subscribers)}
          >
            {formatCompact(subscribers)}
          </span>{' '}
          subscribers
        </span>
      )}
    </Link>
  )
}
