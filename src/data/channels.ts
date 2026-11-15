export type ChannelConfig = {
  id: string
  handle: string
  url: string
  title: string
  blurb: string
}

// IDs come from each channel's public page (its canonical /channel/UC… link).
export const channels: ChannelConfig[] = [
  {
    id: 'UC-Ovok_ecGTuAEWuhe9N3zA',
    handle: '@mike.thedreamER18',
    url: 'https://www.youtube.com/@mike.thedreamER18',
    title: 'mike.thedreamER',
    blurb:
      'An English comic series of "what if" questions: every video is a new comic issue.'
  },
  {
    id: 'UCn8Zip4XNqeOyGgOvVeFnYw',
    handle: '@codingmate',
    url: 'https://www.youtube.com/@codingmate',
    title: 'The Coding Mate',
    blurb:
      'Algorithms, data structures, system design and everyday trade-offs, one question at a time.'
  }
]
