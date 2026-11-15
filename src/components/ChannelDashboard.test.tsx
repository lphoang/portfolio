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

const video = (
  id: string,
  overrides: Partial<VideoStats> = {}
): VideoStats => ({
  id,
  title: `Video ${id}`,
  url: `https://www.youtube.com/watch?v=${id}`,
  publishedAt: '2026-11-03T10:00:00Z',
  views: 1200,
  likes: 40,
  comments: 3,
  coverUrl: `https://i.ytimg.com/vi/${id}/hqdefault.jpg`,
  portrait: true,
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
  const html = render(
    stats({ latest: [video('a', { likes: null, comments: null })] })
  )
  expect(html).toContain('—')
})

test('totals use the short form with the full number on hover', () => {
  const html = render(stats())
  expect(html).toContain('12.4K')
  expect(html).toContain('title="12,400"')
})

test('each video shows its cover, linking to the video', () => {
  const html = render(stats())
  for (const id of ['a', 'b', 'c']) {
    expect(html).toContain(`src="https://i.ytimg.com/vi/${id}/hqdefault.jpg"`)
    expect(html).toContain(`href="https://www.youtube.com/watch?v=${id}"`)
  }
})

test('a video without a cover gets a plain placeholder, not a broken image', () => {
  const html = render(stats({ latest: [video('a', { coverUrl: null })] }))
  expect(html).not.toContain('<img')
  expect(html).toContain('Video a')
})

test('a Short fills its tile; a landscape video is shown whole over a blurred copy', () => {
  const short = render(stats({ latest: [video('a')] }))
  expect(short.match(/<img/g)).toHaveLength(1)
  expect(short).toContain('object-cover')

  const wide = render(stats({ latest: [video('a', { portrait: false })] }))
  expect(wide.match(/<img/g)).toHaveLength(2)
  expect(wide).toContain('object-contain')
  expect(wide).toContain('blur')
})
