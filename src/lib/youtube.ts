import 'server-only'

import type { ChannelConfig } from '@/data/channels'

export type VideoStats = {
  id: string
  title: string
  url: string
  publishedAt: string
  views: number
  likes: number | null
  comments: number | null
  coverUrl: string | null
  portrait: boolean
}

export type ChannelStats = {
  title: string
  avatarUrl: string | null
  subscribers: number | null
  views: number
  videos: number
  latest: VideoStats[]
}

export const REVALIDATE_SECONDS = 21600 // 6 hours

const API = 'https://www.googleapis.com/youtube/v3'
const LATEST_COUNT = 10

// Only the fields we read from the YouTube Data API v3 responses.
type ChannelsResponse = {
  items?: {
    snippet: { title: string; thumbnails?: { default?: { url?: string } } }
    statistics: {
      subscriberCount?: string
      hiddenSubscriberCount?: boolean
      viewCount?: string
      videoCount?: string
    }
    contentDetails: { relatedPlaylists: { uploads: string } }
  }[]
}
type Thumbnails = Partial<
  Record<'default' | 'medium' | 'high', { url: string }>
>
type PlaylistResponse = { items?: { contentDetails: { videoId: string } }[] }
type VideosResponse = {
  items?: {
    id: string
    snippet: {
      title: string
      publishedAt: string
      thumbnails?: Thumbnails
    }
    // Only present when the request sets maxHeight; gives the video's shape.
    player?: { embedWidth?: number | string; embedHeight?: number | string }
    statistics: {
      viewCount?: string
      likeCount?: string
      commentCount?: string
    }
  }[]
}

class YouTubeError extends Error {}

// Shorts are taller than wide; anything unknown is treated as landscape so nothing gets cut.
const isPortrait = (player?: {
  embedWidth?: number | string
  embedHeight?: number | string
}) => Number(player?.embedHeight) > Number(player?.embedWidth)

// The cover to show. For Shorts the "high" thumbnail (480×360) holds the portrait
// cover in its middle, which the page crops to 9:16; landscape videos use the 16:9
// "medium" one, which has no black bars.
const coverOf = (thumbnails: Thumbnails | undefined, portrait: boolean) => {
  const order = portrait
    ? [thumbnails?.high, thumbnails?.medium, thumbnails?.default]
    : [thumbnails?.medium, thumbnails?.high, thumbnails?.default]
  return order.find(t => t?.url)?.url ?? null
}

const toNumber = (value?: string) =>
  value === undefined ? null : Number(value)

/**
 * Stats for one channel, or null when the dashboard should show its fallback.
 *
 * A failed refresh on the live site throws instead: Next.js then keeps serving
 * the last good page. During the build and in development there is no earlier
 * page to keep, so a failure returns null and the fallback shows.
 */
export async function getChannelStats(
  channel: ChannelConfig,
  apiKey = process.env.YOUTUBE_API_KEY,
  fetchImpl: typeof fetch = fetch
): Promise<ChannelStats | null> {
  if (!apiKey) return null

  async function get<T>(
    path: string,
    params: Record<string, string>
  ): Promise<T> {
    const query = new URLSearchParams({ ...params, key: apiKey! })
    const res = await fetchImpl(`${API}/${path}?${query}`, {
      next: { revalidate: REVALIDATE_SECONDS }
    })
    // The URL holds the key, so errors only mention the path and the status.
    if (!res.ok) throw new YouTubeError(`${path} returned HTTP ${res.status}`)
    return (await res.json()) as T
  }

  try {
    const channels = await get<ChannelsResponse>('channels', {
      part: 'snippet,statistics,contentDetails',
      id: channel.id
    })
    const item = channels.items?.[0]
    if (!item) throw new YouTubeError('channel not found')

    // A channel without videos has no uploads playlist yet (YouTube answers 404).
    const hasVideos = Number(item.statistics.videoCount ?? 0) > 0
    const playlist = hasVideos
      ? await get<PlaylistResponse>('playlistItems', {
          part: 'contentDetails',
          maxResults: String(LATEST_COUNT),
          playlistId: item.contentDetails.relatedPlaylists.uploads
        })
      : { items: [] }
    const ids = (playlist.items ?? []).map(
      entry => entry.contentDetails.videoId
    )

    let latest: VideoStats[] = []
    if (ids.length > 0) {
      const videos = await get<VideosResponse>('videos', {
        part: 'snippet,statistics,player',
        maxHeight: '360',
        id: ids.join(',')
      })
      const byId = new Map((videos.items ?? []).map(v => [v.id, v]))
      latest = ids.flatMap(id => {
        const v = byId.get(id)
        if (!v) return []
        return [
          {
            id,
            title: v.snippet.title,
            url: `https://www.youtube.com/watch?v=${id}`,
            publishedAt: v.snippet.publishedAt,
            views: Number(v.statistics.viewCount ?? 0),
            likes: toNumber(v.statistics.likeCount),
            comments: toNumber(v.statistics.commentCount),
            coverUrl: coverOf(v.snippet.thumbnails, isPortrait(v.player)),
            portrait: isPortrait(v.player)
          }
        ]
      })
    }

    const stats = item.statistics
    return {
      title: item.snippet.title,
      avatarUrl: item.snippet.thumbnails?.default?.url ?? null,
      subscribers: stats.hiddenSubscriberCount
        ? null
        : toNumber(stats.subscriberCount),
      views: Number(stats.viewCount ?? 0),
      videos: Number(stats.videoCount ?? 0),
      latest
    }
  } catch (error) {
    const reason =
      error instanceof YouTubeError ? error.message : 'network error'
    const message = `YouTube stats for ${channel.title} failed: ${reason}`
    console.error(message)
    const liveRefresh =
      process.env.NODE_ENV === 'production' &&
      process.env.NEXT_PHASE !== 'phase-production-build'
    if (liveRefresh) throw new Error(message)
    return null
  }
}
