import { renderToStaticMarkup } from 'react-dom/server'

import { apps } from '@/data/apps'

import KanotesPage from './page'
import KanotesPrivacyPage from './privacy/page'

test('Kanotes is one of my apps and its card opens its own page', () => {
  const kanotes = apps.find(app => app.name === 'Kanotes')
  expect(kanotes?.href).toBe('/apps/kanotes')
  expect(kanotes?.status).toBe('Coming soon')
})

test('the landing page puts "Coming soon" above the Google Play button', () => {
  const html = renderToStaticMarkup(<KanotesPage />)
  const comingSoon = html.indexOf('Coming soon')
  const play = html.indexOf('Google Play')
  expect(comingSoon).toBeGreaterThan(-1)
  expect(play).toBeGreaterThan(comingSoon)
  // Not on sale yet, so the button goes nowhere.
  expect(html).toMatch(/aria-disabled="true"[^>]*>[\s\S]*Google Play/)
})

test('the landing page shows the screenshots and links the privacy policy', () => {
  const html = renderToStaticMarkup(<KanotesPage />)
  for (const n of [1, 2, 3, 4]) expect(html).toContain(`screen-${n}.png`)
  expect(html).toContain('href="/apps/kanotes/privacy"')
})

test('the privacy policy says where screen text goes, in English and Vietnamese', () => {
  const html = renderToStaticMarkup(<KanotesPrivacyPage />)
  expect(html).toContain('It does not leave your phone.')
  expect(html).toContain('Chữ không rời khỏi điện thoại.')
  expect(html).toContain('Kanotes Cloud')
  expect(html).toContain('lephuochoang1810@gmail.com')
})
