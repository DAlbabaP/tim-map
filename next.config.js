/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    optimizePackageImports: ['ol', 'lucide-react']
  },
  
  // Оптимизация для OpenLayers
  webpack: (config) => {
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack']
    });
    
    // Оптимизация для OpenLayers
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      path: false
    };
    
    return config;
  },

  // Настройки изображений
  images: {
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },

  // Сжатие
  compress: true,

  // Строгий режим React
  reactStrictMode: true,

  // Производительность
  poweredByHeader: false,
  
  // Статические файлы
  trailingSlash: false,
  
  // Настройки для статического экспорта (если нужно)
  output: process.env.NODE_ENV === 'production' ? 'export' : undefined,
  distDir: 'dist',
  basePath: process.env.NODE_ENV === 'production' ? '/university-map' : '',
  assetPrefix: process.env.NODE_ENV === 'production' ? '/university-map' : '',
}

module.exports = nextConfig 