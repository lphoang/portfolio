import { AppCard } from '@/components/AppCard'
import { ChannelTeaser } from '@/components/ChannelTeaser'
import { SectionLabel } from '@/components/SectionLabel'
import { Timeline } from '@/components/Timeline'
import { apps } from '@/data/apps'
import { channels } from '@/data/channels'
import { profile } from '@/data/profile'
import { education, work } from '@/data/work'
import { Figure } from '@/figure/Figure'
import { getChannelStats } from '@/lib/youtube'

// The channel teasers use YouTube numbers; refresh at most every 6 hours.
export const revalidate = 21600

const links = [
  ...profile.links,
  ...channels.map(channel => ({
    label: 'YouTube',
    text: channel.handle,
    url: channel.url
  }))
]

export default async function Home() {
  const stats = await Promise.all(
    channels.map(channel => getChannelStats(channel))
  )
  return (
    <div className="space-y-10">
      <section className="flex flex-col items-center text-center">
        <Figure variant="dev" label="3D figure of Hoang" />
        <h1 className="era-name mt-2 font-display">{profile.name}</h1>
        <p className="era-tagline mt-2 text-muted">{profile.tagline}</p>
      </section>

      <section>
        <SectionLabel>work</SectionLabel>
        <Timeline jobs={work} born={profile.born} />
      </section>

      <section>
        <SectionLabel>education</SectionLabel>
        <div className="card grid gap-1 p-4 sm:grid-cols-[7.5rem_1fr]">
          <span className="pt-1 font-label text-[10px] text-muted">
            {education.period}
          </span>
          <div>
            <h3 className="font-display font-bold">{education.school}</h3>
            <p className="text-sm">{education.degree}</p>
          </div>
        </div>
      </section>

      <section>
        <SectionLabel>on youtube</SectionLabel>
        <div className="paper-list space-y-2">
          {channels.map((channel, i) => (
            <ChannelTeaser
              key={channel.id}
              channel={channel}
              stats={stats[i]}
            />
          ))}
        </div>
      </section>

      <section>
        <SectionLabel>building</SectionLabel>
        <AppCard app={apps[0]} href="/apps" />
      </section>

      <section>
        <SectionLabel>i ♥</SectionLabel>
        <ul className="paper-list flex flex-wrap gap-2">
          {profile.hobbies.map(hobby => (
            <li key={hobby} className="card px-3 py-1.5 text-sm">
              {hobby}
            </li>
          ))}
        </ul>
      </section>

      <section>
        <SectionLabel>connect</SectionLabel>
        <ul className="space-y-1">
          {links.map(link => (
            <li key={link.url}>
              <a
                href={link.url}
                target="_blank"
                rel="noreferrer"
                className="hover:text-accent"
              >
                <span className="font-label text-[10px] text-muted">
                  {link.label}
                </span>{' '}
                <span className="underline underline-offset-4">
                  {link.text}
                </span>
              </a>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}
