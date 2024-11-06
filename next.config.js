const path = require('path')

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  reactStrictMode: false,
  outputFileTracingRoot: path.join(__dirname, './src'),
  eslint: {
    ignoreDuringBuilds: true // Ignora linting durante o build
  },
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
}

module.exports = nextConfig
