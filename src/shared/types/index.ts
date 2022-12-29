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
}

export type LayoutProps = {
  title: string
  children: JSX.Element | string
}
