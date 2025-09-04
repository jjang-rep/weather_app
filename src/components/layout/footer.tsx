'use client';

import { ExternalLink, Heart } from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* 앱 정보 */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="text-2xl">🌤️</div>
              <h3 className="text-lg font-semibold">WeatherApp</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              실시간 날씨 정보를 제공하는 웹 애플리케이션입니다. 
              OpenWeatherMap API를 사용하여 정확한 날씨 데이터를 제공합니다.
            </p>
          </div>

          {/* 기술 스택 */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">기술 스택</h3>
            <div className="space-y-2">
              <div className="text-sm">
                <span className="font-medium">프론트엔드:</span>
                <span className="text-muted-foreground ml-2">Next.js, React, TypeScript</span>
              </div>
              <div className="text-sm">
                <span className="font-medium">UI 라이브러리:</span>
                <span className="text-muted-foreground ml-2">shadcn/ui, Tailwind CSS</span>
              </div>
              <div className="text-sm">
                <span className="font-medium">API:</span>
                <span className="text-muted-foreground ml-2">OpenWeatherMap</span>
              </div>
            </div>
          </div>

          {/* 링크 */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">링크</h3>
            <div className="space-y-2">
              <a
                href="https://openweathermap.org/api"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <ExternalLink className="h-4 w-4" />
                <span>OpenWeatherMap API</span>
              </a>
              <a
                href="https://ui.shadcn.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <ExternalLink className="h-4 w-4" />
                <span>shadcn/ui</span>
              </a>
              <a
                href="https://nextjs.org"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <ExternalLink className="h-4 w-4" />
                <span>Next.js</span>
              </a>
            </div>
          </div>
        </div>

        {/* 하단 구분선 및 저작권 */}
        <div className="mt-8 pt-8 border-t">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <span>Made with</span>
              <Heart className="h-4 w-4 text-red-500" />
              <span>by WeatherApp Team</span>
            </div>
            <div className="text-sm text-muted-foreground">
              © {currentYear} WeatherApp. All rights reserved.
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
