import config from './next.config'

test('old works and posts links redirect home', async () => {
  expect(await config.redirects!()).toEqual([
    { source: '/works/:path*', destination: '/', permanent: true },
    { source: '/posts/:path*', destination: '/', permanent: true }
  ])
})
