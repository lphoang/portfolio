/** [href]: the app's own page, when it has one; otherwise its card links to the apps list. */
export type AppInfo = {
  name: string
  blurb: string
  status: 'Coming soon'
  href?: string
}

export const apps: AppInfo[] = [
  {
    name: 'Kanotes',
    blurb:
      'An Android app: hold the side button and Kapy, a little capybara, turns any screen into a calendar event or a note. Made for Vietnamese chats first, and it reads on your phone.',
    status: 'Coming soon',
    href: '/apps/kanotes'
  },
  {
    name: '2Eat',
    blurb:
      'A free meal planner for iPhone and Android that plans your meals to hit your daily protein and calorie targets within your grocery budget, and writes the shopping list.',
    status: 'Coming soon'
  }
]
