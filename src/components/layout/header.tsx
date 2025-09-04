'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { UnitToggle } from '@/components/weather/unit-toggle';
import { Search, Menu, Sun, Moon } from 'lucide-react';

interface HeaderProps {
  onSearch: (city: string) => void;
  onToggleTheme: () => void;
  isDarkMode: boolean;
}

export function Header({ onSearch, onToggleTheme, isDarkMode }: HeaderProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleSearch = () => {
    if (searchQuery.trim()) {
      onSearch(searchQuery.trim());
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const popularCities = ['Seoul', 'Tokyo', 'New York', 'London', 'Paris'];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60" role="banner">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* 로고 및 제목 */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="text-2xl">🌤️</div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                WeatherApp
              </h1>
            </div>
          </div>

          {/* 데스크톱 검색 바 */}
          <div className="hidden md:flex items-center space-x-4 flex-1 max-w-md mx-8">
            <div className="relative flex-1">
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="도시명을 입력하세요..."
                className="pr-10"
                aria-label="도시 검색"
                role="searchbox"
              />
              <Button
                size="sm"
                onClick={handleSearch}
                className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
                aria-label="검색"
              >
                <Search className="h-4 w-4" aria-hidden="true" />
              </Button>
            </div>
          </div>

          {/* 우측 메뉴 */}
          <div className="flex items-center space-x-2">
            {/* 단위 전환 */}
            <UnitToggle />
            
            {/* 테마 토글 */}
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggleTheme}
              className="h-9 w-9 p-0"
            >
              {isDarkMode ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
            </Button>

            {/* 모바일 메뉴 버튼 */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden h-9 w-9 p-0"
            >
              <Menu className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* 모바일 검색 바 */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <div className="space-y-4">
              <div className="relative">
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="도시명을 입력하세요..."
                  className="pr-10"
                />
                <Button
                  size="sm"
                  onClick={handleSearch}
                  className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
                >
                  <Search className="h-4 w-4" />
                </Button>
              </div>

              {/* 인기 도시 */}
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">인기 도시</p>
                <div className="flex flex-wrap gap-2">
                  {popularCities.map((city) => (
                    <Button
                      key={city}
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSearchQuery(city);
                        onSearch(city);
                        setIsMenuOpen(false);
                      }}
                      className="text-xs"
                    >
                      {city}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
