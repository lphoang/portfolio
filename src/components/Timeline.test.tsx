import { renderToStaticMarkup } from 'react-dom/server'

import { profile } from '@/data/profile'
import { work } from '@/data/work'

import { Timeline } from './Timeline'

test('jobs render newest first and the birth line comes last', () => {
  const html = renderToStaticMarkup(
    <Timeline jobs={work} born={profile.born} />
  )
  const order = [
    'mgm technology partners Vietnam',
    'mesoneer',
    'FPT Software',
    'Born in Hue, Vietnam'
  ].map(text => html.indexOf(text))

  expect(order.every(i => i >= 0)).toBe(true)
  expect([...order].sort((a, b) => a - b)).toEqual(order)
  expect(html).toContain('Back End Developer (intern)')
})
