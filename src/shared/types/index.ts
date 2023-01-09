import { Router } from 'next/router'

export type MainProps = {
  children: JSX.Element
  router: Router
}

export type LinkItemProps = {
  children: JSX.Element | string
  href: string
  path: string
}

export type NavbarProps = {
  path: string
}

export type SectionProps = {
  children: JSX.Element | JSX.Element[]
  delay?: string
}

export type GridItemProps = {
  children: JSX.Element | string
  href: string
  title: string
  thumbnail: string
}

export type WorkGridItemProps = Omit<GridItemProps, 'href'> & {
  id: string
  content: 'works' | 'posts'
}

export type LayoutProps = {
  title: string
  children: JSX.Element | string
}

export type ThumbnailType = {
  url: string
  width: number
  height: number
}

export type WorkType = {
  id: string
  createdAt?: string
  updatedAt?: string
  title: string
  description: string
  platform: string
  url?: string
  stack: string
  firstThumbnail: ThumbnailType
  secondThumbnail: ThumbnailType
  thirdThumbnail?: ThumbnailType
  videoUrl?: string
}

export type GetWorks = {
  contents: WorkType[]
  totalCount: number
  offset: number
  limit: number
}

export type PostType = {
  id: string
  createdAt?: string
  updatedAt?: string
  title: string
  body: string
  thumbnail: ThumbnailType
  description: string
}

export type GetPosts = {
  contents: PostType[]
  totalCount: number
  offset: number
  limit: number
}
