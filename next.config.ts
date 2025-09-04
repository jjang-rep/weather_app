import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 성능 최적화
  compress: true,
  poweredByHeader: false,
  
  // Docker 배포를 위한 standalone 출력
  output: 'standalone',
  
  // 이미지 최적화
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'openweathermap.org',
        port: '',
        pathname: '/img/wn/**',
      },
    ],
    formats: ['image/webp', 'image/avif'],
  },
  
  // 실험적 기능
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
};

export default nextConfig;
