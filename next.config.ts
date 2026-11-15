import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // The site used to have Works and Posts pages; keep old links working.
  async redirects() {
    return [
      { source: '/works/:path*', destination: '/', permanent: true },
      { source: '/posts/:path*', destination: '/', permanent: true }
    ]
  }
}

export default nextConfig
