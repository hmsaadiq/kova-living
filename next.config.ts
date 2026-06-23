import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  reactStrictMode: false, // prevents double-mount killing WebGL context in dev
  turbopack: {
    root: __dirname,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lnsnqosxarmgechnveky.supabase.co',
      },
      // Unsplash for placeholder product images during dev
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
}

export default nextConfig