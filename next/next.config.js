/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@mui/material', '@mui/system', '@mui/icons-material'],
  images: {
    domains: ['localhost'],
  },
  // تنظیمات زیر برای بهبود عملکرد بیلد و کاهش خطاهای احتمالی است
  swcMinify: true,
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
}

module.exports = nextConfig
