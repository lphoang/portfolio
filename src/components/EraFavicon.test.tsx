import { renderToStaticMarkup } from 'react-dom/server'

import { EraFavicon } from './EraFavicon'

test('the page gets the era favicon from React (terminal until the era is known)', () => {
  const html = renderToStaticMarkup(<EraFavicon />)
  expect(html).toContain('rel="icon"')
  expect(html).toContain('href="/icons/era-terminal.svg"')
})
