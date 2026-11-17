import { renderToStaticMarkup } from 'react-dom/server'

import { KanotesShell } from './KanotesShell'
import { T } from './T'

test('the Kanotes shell has its own top bar and no portfolio navbar', () => {
  const html = renderToStaticMarkup(
    <KanotesShell>
      <p>page</p>
    </KanotesShell>
  )
  expect(html).toContain('class="kanotes')
  expect(html).toContain('/apps/kanotes/kapy.svg')
  expect(html).not.toContain('era-nav')
  expect(html).toMatch(/aria-pressed="(true|false)"[^>]*>VI/)
  expect(html).toMatch(/aria-pressed="(true|false)"[^>]*>EN/)
  expect(html).toContain('<p>page</p>')
})

test('T puts each language in its own lang element', () => {
  const html = renderToStaticMarkup(<T vi="Xin chào" en="Hello" />)
  expect(html).toBe(
    '<span lang="vi" class="k-vi">Xin chào</span><span lang="en" class="k-en">Hello</span>'
  )
})
