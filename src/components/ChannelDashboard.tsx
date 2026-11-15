import type { ChannelConfig } from '@/data/channels'
import { formatCompact, formatDate } from '@/lib/format'
import type { ChannelStats, VideoStats } from '@/lib/youtube'

import { SectionLabel } from './SectionLabel'
import { Stat } from './Stat'
import { ViewsChart } from './ViewsChart'

type Props = { channel: ChannelConfig; stats: ChannelStats | null }

const count = (n: number | null) => (n === null ? '—' : formatCompact(n))

// "1 like", "3 likes", "— likes" (when the channel hides the number).
const counted = (n: number | null, one: string, many: string) =>
  `${count(n)} ${n === 1 ? one : many}`

// One video per row: a small cover on the left, then title and the numbers.
function VideoRow({ video }: { video: VideoStats }) {
  return (
    <li>
      <a
        href={video.url}
        target="_blank"
        rel="noreferrer"
        className="group flex items-center gap-3 py-2.5"
      >
        <div className="relative aspect-[9/16] w-12 shrink-0 overflow-hidden rounded-[4px] border border-line bg-panel">
          {video.coverUrl && !video.portrait && (
            // Landscape videos: a blurred copy fills the tile behind the whole cover.
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={video.coverUrl}
              alt=""
              loading="lazy"
              className="absolute inset-0 size-full scale-110 object-cover opacity-50 blur-sm"
            />
          )}
          {video.coverUrl && (
            // A remote YouTube thumbnail; CSS crops it, so the image optimizer adds nothing.
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={video.coverUrl}
              alt=""
              loading="lazy"
              className={`relative size-full ${
                video.portrait ? 'object-cover' : 'object-contain'
              }`}
            />
          )}
        </div>
        <div className="min-w-0">
          <p className="line-clamp-2 font-semibold break-words group-hover:text-accent">
            {video.title}
          </p>
          <p className="mt-1 font-label text-[10px] text-muted">
            {formatDate(video.publishedAt)} ·{' '}
            {counted(video.views, 'view', 'views')} ·{' '}
            {counted(video.likes, 'like', 'likes')} ·{' '}
            {counted(video.comments, 'comment', 'comments')}
          </p>
        </div>
      </a>
    </li>
  )
}

export function ChannelDashboard({ channel, stats }: Props) {
  return (
    <article className="card p-4 sm:p-5">
      <header className="flex flex-wrap items-start gap-x-3 gap-y-2">
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
        {/* basis-56: on narrow screens the YouTube link wraps below instead of squeezing the text. */}
        <div className="min-w-0 flex-1 basis-56">
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
