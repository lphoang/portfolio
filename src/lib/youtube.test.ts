import type { ChannelConfig } from '@/data/channels'

import { getChannelStats } from './youtube'

vi.mock('server-only', () => ({}))

const channel: ChannelConfig = {
  id: 'UC_test',
  handle: '@test',
  url: 'https://www.youtube.com/@test',
  title: 'Test channel',
  blurb: 'A test channel.'
}

const channelsResponse = {
  items: [
    {
      snippet: {
        title: 'Test channel',
        thumbnails: { default: { url: 'https://yt3.example/avatar.jpg' } }
      },
      statistics: {
        subscriberCount: '12400',
        hiddenSubscriberCount: false,
        viewCount: '1200000',
        videoCount: '148'
      },
      contentDetails: { relatedPlaylists: { uploads: 'UU_test' } }
    }
  ]
}

const playlistResponse = {
  items: [
    { contentDetails: { videoId: 'b' } },
    { contentDetails: { videoId: 'a' } }
  ]
}

const video = (id: string, statistics: Record<string, string>) => ({
  id,
  snippet: { title: `Video ${id}`, publishedAt: '2026-11-03T10:00:00Z' },
  statistics
})

// YouTube may return videos in any order; the playlist order is the one to keep.
const videosResponse = {
  items: [
    video('a', { viewCount: '100', likeCount: '5', commentCount: '1' }),
    video('b', { viewCount: '300', likeCount: '20', commentCount: '4' })
  ]
}

type Responses = {
  channels?: unknown
  playlist?: unknown
  videos?: unknown
  status?: number
}

function fakeFetch(responses: Responses) {
  const calls: string[] = []
  const impl = (async (input: RequestInfo | URL) => {
    const url = new URL(String(input))
    calls.push(url.pathname)
    const body = url.pathname.endsWith('/channels')
      ? responses.channels
      : url.pathname.endsWith('/playlistItems')
        ? responses.playlist
        : responses.videos
    return new Response(JSON.stringify(body ?? {}), {
      status: responses.status ?? 200
    })
  }) as typeof fetch
  return { impl, calls }
}

const ok = {
  channels: channelsResponse,
  playlist: playlistResponse,
  videos: videosResponse
}

afterEach(() => {
  vi.unstubAllEnvs()
  vi.restoreAllMocks()
})

test('returns totals and the latest uploads in playlist order', async () => {
  const stats = await getChannelStats(channel, 'key', fakeFetch(ok).impl)
  expect(stats).toMatchObject({
    title: 'Test channel',
    avatarUrl: 'https://yt3.example/avatar.jpg',
    subscribers: 12_400,
    views: 1_200_000,
    videos: 148
  })
  expect(stats!.latest.map(v => v.id)).toEqual(['b', 'a'])
  expect(stats!.latest[0]).toEqual({
    id: 'b',
    title: 'Video b',
    url: 'https://www.youtube.com/watch?v=b',
    publishedAt: '2026-11-03T10:00:00Z',
    views: 300,
    likes: 20,
    comments: 4
  })
})

test('hidden subscriber count becomes null', async () => {
  const hidden = structuredClone(channelsResponse)
  hidden.items[0].statistics.hiddenSubscriberCount = true
  const stats = await getChannelStats(
    channel,
    'key',
    fakeFetch({ ...ok, channels: hidden }).impl
  )
  expect(stats!.subscribers).toBeNull()
})

test('missing likeCount and commentCount become null', async () => {
  const videos = {
    items: [video('b', { viewCount: '300' }), video('a', { viewCount: '100' })]
  }
  const stats = await getChannelStats(
    channel,
    'key',
    fakeFetch({ ...ok, videos }).impl
  )
  expect(stats!.latest[0].likes).toBeNull()
  expect(stats!.latest[0].comments).toBeNull()
})

test('no uploads gives an empty list without asking for videos', async () => {
  const fake = fakeFetch({ ...ok, playlist: { items: [] } })
  const stats = await getChannelStats(channel, 'key', fake.impl)
  expect(stats!.latest).toEqual([])
  expect(fake.calls.some(path => path.endsWith('/videos'))).toBe(false)
})

test('missing key returns null without calling fetch', async () => {
  const fake = fakeFetch(ok)
  expect(await getChannelStats(channel, '', fake.impl)).toBeNull()
  expect(fake.calls).toEqual([])
})

test('a non-OK response returns null', async () => {
  vi.spyOn(console, 'error').mockImplementation(() => {})
  expect(
    await getChannelStats(channel, 'key', fakeFetch({ status: 403 }).impl)
  ).toBeNull()
})

test('a thrown network error returns null', async () => {
  vi.spyOn(console, 'error').mockImplementation(() => {})
  const failing = (async () => {
    throw new TypeError('fetch failed')
  }) as typeof fetch
  expect(await getChannelStats(channel, 'key', failing)).toBeNull()
})

test('an unknown channel id returns null', async () => {
  vi.spyOn(console, 'error').mockImplementation(() => {})
  const fake = fakeFetch({ ...ok, channels: { items: [] } })
  expect(await getChannelStats(channel, 'key', fake.impl)).toBeNull()
})

test('errors never log the key', async () => {
  const errors = vi.spyOn(console, 'error').mockImplementation(() => {})
  await getChannelStats(channel, 'secret-key', fakeFetch({ status: 403 }).impl)
  expect(errors).toHaveBeenCalled()
  expect(JSON.stringify(errors.mock.calls)).not.toContain('secret-key')
})

test('a failed refresh on the live site throws, so Next keeps the last good page', async () => {
  vi.spyOn(console, 'error').mockImplementation(() => {})
  vi.stubEnv('NODE_ENV', 'production')
  vi.stubEnv('NEXT_PHASE', '')
  await expect(
    getChannelStats(channel, 'key', fakeFetch({ status: 403 }).impl)
  ).rejects.toThrow('Test channel')
})

test('a failure during the production build still returns null', async () => {
  vi.spyOn(console, 'error').mockImplementation(() => {})
  vi.stubEnv('NODE_ENV', 'production')
  vi.stubEnv('NEXT_PHASE', 'phase-production-build')
  expect(
    await getChannelStats(channel, 'key', fakeFetch({ status: 403 }).impl)
  ).toBeNull()
})
