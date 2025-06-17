/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  images: {
    domains: ['server8.mp3quran.net'],
    unoptimized: true,
  },
  env: {
    NEXT_PUBLIC_TELEGRAM_BOT_TOKEN: process.env.NEXT_PUBLIC_TELEGRAM_BOT_TOKEN,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
}

export default nextConfig
