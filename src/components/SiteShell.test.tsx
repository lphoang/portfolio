import { renderToStaticMarkup } from 'react-dom/server'

import NotFound from '@/app/not-found'

import { SiteShell } from './SiteShell'

test('the site shell draws the navbar around the page', () => {
  const html = renderToStaticMarkup(
    <SiteShell>
      <p>page</p>
    </SiteShell>
  )
  expect(html).toContain('era-nav')
  expect(html).toMatch(/<main[^>]*>[\s\S]*<p>page<\/p>[\s\S]*<\/main>/)
})

test('the 404 page keeps the site shell', () => {
  const html = renderToStaticMarkup(<NotFound />)
  expect(html).toContain('era-nav')
  expect(html).toContain('Not found')
})
