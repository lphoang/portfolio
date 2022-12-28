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
  delay: string
}
