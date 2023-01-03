/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      "localhost",
      "images.microcms-assets.io",
    ],
  },
}

module.exports = nextConfig
