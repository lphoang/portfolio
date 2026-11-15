import type { ChannelConfig } from '@/data/channels'
import { formatCompact, formatDate } from '@/lib/format'
import type { ChannelStats, VideoStats } from '@/lib/youtube'

import { SectionLabel } from './SectionLabel'
import { Stat } from './Stat'
import { ViewsChart } from './ViewsChart'

type Props = { channel: ChannelConfig; stats: ChannelStats | null }

const count = (n: number | null) => (n === null ? '—' : formatCompact(n))

function VideoRow({ video }: { video: VideoStats }) {
  return (
    <li className="py-2.5">
      <a
        href={video.url}
        target="_blank"
        rel="noreferrer"
        className="line-clamp-2 font-semibold break-words hover:text-accent"
      >
        {video.title}
      </a>
      <div className="mt-1 flex flex-wrap gap-x-3 font-label text-[10px] text-muted">
        <span>{formatDate(video.publishedAt)}</span>
        <span>{count(video.views)} views</span>
        <span>{count(video.likes)} likes</span>
        <span>{count(video.comments)} comments</span>
      </div>
    </li>
  )
}

export function ChannelDashboard({ channel, stats }: Props) {
  return (
    <article className="card p-4 sm:p-5">
      <header className="flex items-start gap-3">
        {stats?.avatarUrl && (
          // A 48px remote avatar does not need the image optimizer or its domain config.
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={stats.avatarUrl}
            alt=""
            width={48}
            height={48}
            className="size-12 shrink-0 rounded-full border border-line"
          />
        )}
        <div className="min-w-0 flex-1">
          <h3 className="font-display text-lg font-bold">{channel.title}</h3>
          <p className="text-sm text-muted">{channel.blurb}</p>
        </div>
        <a
          href={channel.url}
          target="_blank"
          rel="noreferrer"
          className="shrink-0 font-label text-[10px] text-accent underline underline-offset-4"
        >
          Open on YouTube
        </a>
      </header>

      {stats === null ? (
        <p className="mt-4 text-sm text-muted">
          Stats are taking a break. The videos are still on YouTube.
        </p>
      ) : (
        <div className="mt-4 space-y-5">
          <div className="grid grid-cols-3 gap-2">
            <Stat label="subscribers" value={stats.subscribers} />
            <Stat label="views" value={stats.views} />
            <Stat label="videos" value={stats.videos} />
          </div>
          <section>
            <SectionLabel>latest uploads</SectionLabel>
            {stats.latest.length === 0 ? (
              <p className="text-sm text-muted">No videos yet.</p>
            ) : (
              <>
                <ViewsChart videos={stats.latest} />
                <ol className="mt-3 divide-y divide-line">
                  {stats.latest.map(video => (
                    <VideoRow key={video.id} video={video} />
                  ))}
                </ol>
              </>
            )}
          </section>
        </div>
      )}
    </article>
  )
}
