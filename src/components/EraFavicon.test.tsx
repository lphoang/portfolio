import { renderToStaticMarkup } from 'react-dom/server'

import { EraFavicon } from './EraFavicon'

test('the page gets the mode favicon from React (dev until the mode is known)', () => {
  const html = renderToStaticMarkup(<EraFavicon />)
  expect(html).toContain('rel="icon"')
  expect(html).toContain('href="/icons/era-dev.svg"')
})
