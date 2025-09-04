import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 성능 최적화
  compress: true,
  poweredByHeader: false,
  
  // 이미지 최적화
  images: {
    domains: ['openweathermap.org'],
    formats: ['image/webp', 'image/avif'],
  },
};

export default nextConfig;
