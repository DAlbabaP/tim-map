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

  // Настройки изображений (для статического экспорта)
  images: {
    unoptimized: true,
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
  basePath: process.env.NODE_ENV === 'production' ? '/tim-map' : '',
  assetPrefix: process.env.NODE_ENV === 'production' ? '/tim-map' : '',
}

module.exports = nextConfig 