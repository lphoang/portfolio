import { renderToStaticMarkup } from 'react-dom/server'

import type { ChannelConfig } from '@/data/channels'
import type { ChannelStats, VideoStats } from '@/lib/youtube'

import { ChannelDashboard } from './ChannelDashboard'

const channel: ChannelConfig = {
  id: 'UC_test',
  handle: '@codingmate',
  url: 'https://www.youtube.com/@codingmate',
  title: 'The Coding Mate',
  blurb: 'One question at a time.'
}

const video = (id: string, overrides: Partial<VideoStats> = {}): VideoStats => ({
  id,
  title: `Video ${id}`,
  url: `https://www.youtube.com/watch?v=${id}`,
  publishedAt: '2026-11-03T10:00:00Z',
  views: 1200,
  likes: 40,
  comments: 3,
  ...overrides
})

const stats = (overrides: Partial<ChannelStats> = {}): ChannelStats => ({
  title: 'The Coding Mate',
  avatarUrl: null,
  subscribers: 12_400,
  views: 1_200_000,
  videos: 148,
  latest: [video('a'), video('b'), video('c')],
  ...overrides
})

const render = (s: ChannelStats | null) =>
  renderToStaticMarkup(<ChannelDashboard channel={channel} stats={s} />)

test('null stats shows the fallback and the channel link', () => {
  const html = render(null)
  expect(html).toContain('Stats are taking a break')
  expect(html).toContain('href="https://www.youtube.com/@codingmate"')
})

test('hidden subscribers read "hidden"', () => {
  expect(render(stats({ subscribers: null }))).toContain('hidden')
})

test('three videos draw three bars and list three titles', () => {
  const html = render(stats())
  expect(html.match(/<rect/g)).toHaveLength(3)
  for (const id of ['a', 'b', 'c']) expect(html).toContain(`Video ${id}`)
})

test('no uploads shows "No videos yet" and no chart', () => {
  const html = render(stats({ latest: [] }))
  expect(html).toContain('No videos yet')
  expect(html).not.toContain('<svg')
})

test('a video with likes off shows —', () => {
  const html = render(stats({ latest: [video('a', { likes: null, comments: null })] }))
  expect(html).toContain('—')
})

test('totals use the short form with the full number on hover', () => {
  const html = render(stats())
  expect(html).toContain('12.4K')
  expect(html).toContain('title="12,400"')
})
