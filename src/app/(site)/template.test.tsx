import { readFileSync } from 'node:fs'
import { renderToStaticMarkup } from 'react-dom/server'

import Template from './template'

test('every page is wrapped in the enter animation', () => {
  const html = renderToStaticMarkup(
    <Template>
      <p>page</p>
    </Template>
  )
  expect(html).toBe('<div class="page-enter"><p>page</p></div>')
})

test('the parts of a page rise in one after another', () => {
  const css = readFileSync('src/app/globals.css', 'utf8')
  expect(css).toMatch(/\.page-enter > \* > \* \{[^}]*animation: page-rise/)
  const delays = [
    ...css.matchAll(
      /\.page-enter > \* > \*:nth-child\((\d)\) \{\s*animation-delay: (\d+)ms/g
    )
  ].map(m => Number(m[2]))
  expect(delays.length).toBeGreaterThan(3)
  expect(delays).toEqual([...delays].sort((a, b) => a - b))
})
