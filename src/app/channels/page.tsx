import type { Metadata } from 'next'

import { ChannelDashboard } from '@/components/ChannelDashboard'
import { SectionLabel } from '@/components/SectionLabel'
import { channels } from '@/data/channels'
import { getChannelStats } from '@/lib/youtube'

export const metadata: Metadata = { title: 'Channels' }

// Refresh the YouTube numbers at most every 6 hours.
export const revalidate = 21600

export default async function ChannelsPage() {
  const stats = await Promise.all(channels.map(channel => getChannelStats(channel)))
  return (
    <div className="space-y-8">
      {/* The 3D figure goes here. */}
      <section>
        <SectionLabel>channels</SectionLabel>
        <div className="space-y-4">
          {channels.map((channel, i) => (
            <ChannelDashboard key={channel.id} channel={channel} stats={stats[i]} />
          ))}
        </div>
      </section>
    </div>
  )
}
