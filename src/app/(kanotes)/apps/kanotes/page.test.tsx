import { renderToStaticMarkup } from 'react-dom/server'

import { apps } from '@/data/apps'

import KanotesPage from './page'
import KanotesPrivacyPage from './privacy/page'

const html = renderToStaticMarkup(<KanotesPage />)

test('Kanotes is one of my apps and its card opens its own page', () => {
  const kanotes = apps.find(app => app.name === 'Kanotes')
  expect(kanotes?.href).toBe('/apps/kanotes')
  expect(kanotes?.status).toBe('Coming soon')
})

test('both languages tell the same hero', () => {
  expect(html).toContain(
    '<span lang="vi" class="k-vi">Một chạm, Kapy lưu giúp bạn nha</span>'
  )
  expect(html).toContain(
    '<span lang="en" class="k-en">One click, Kapy saves it for you</span>'
  )
})

test('"Coming soon" sits above the Google Play button, in both languages', () => {
  expect(html.indexOf('Sắp ra mắt')).toBeGreaterThan(-1)
  expect(html.indexOf('Tải trên Google Play')).toBeGreaterThan(
    html.indexOf('Sắp ra mắt')
  )
  expect(html.indexOf('Get it on Google Play')).toBeGreaterThan(
    html.indexOf('Coming soon')
  )
  // Not on sale yet, so the button goes nowhere.
  expect(html).toMatch(/aria-disabled="true"[^>]*>[\s\S]*Google Play/)
  expect(html).not.toContain('play.google.com')
})

test('each language shows its own screenshots', () => {
  for (const n of [1, 2, 3, 4]) {
    expect(html).toContain(`%2Fapps%2Fkanotes%2Fscreen-${n}.png`)
    expect(html).toContain(`%2Fapps%2Fkanotes%2Fvi%2Fscreen-${n}.png`)
  }
})

test('the page links the privacy policy and ends with one back button to my apps', () => {
  expect(html).toContain('href="/apps/kanotes/privacy"')
  const links = [...html.matchAll(/<a [^>]*href="([^"]+)"/g)].map(m => m[1])
  expect(links.at(-1)).toBe('/apps')
  expect(links.filter(href => href === '/apps')).toHaveLength(1)
  expect(html).toContain('My apps')
  expect(html).toContain('Ứng dụng của tôi')
})

test('the privacy policy says where screen text goes, in English and Vietnamese', () => {
  const policy = renderToStaticMarkup(<KanotesPrivacyPage />)
  expect(policy).toContain('It does not leave your phone.')
  expect(policy).toContain('Chữ không rời khỏi điện thoại.')
  expect(policy).toContain('Kanotes Cloud')
  expect(policy).toContain('lephuochoang1810@gmail.com')
})

test('the privacy policy shows one language at a time and links back to Kanotes', () => {
  const policy = renderToStaticMarkup(<KanotesPrivacyPage />)
  expect(policy).toMatch(/<section lang="en" class="k-en/)
  expect(policy).toMatch(/<section lang="vi" class="k-vi/)
  expect(policy).toMatch(
    /<a [^>]*href="\/apps\/kanotes"[^>]*>[\s\S]*Kanotes<\/a>/
  )
  expect(policy).not.toContain('section-label')
})

test('visitors can download the signed APK from its GitHub release', () => {
  const apk =
    'https://github.com/lphoang/kanotes/releases/download/v0.1.0/kanotes-0.1.0.apk'
  expect(html).toContain(`href="${apk}"`)
  expect(html).toContain('Download the APK')
  expect(html).toContain('Tải tệp APK')
})
