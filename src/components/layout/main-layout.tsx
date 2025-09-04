'use client';

import { useState, useEffect } from 'react';
import { Header } from './header';
import { Footer } from './footer';

interface MainLayoutProps {
  children: React.ReactNode;
  onSearch?: (city: string) => void;
}

export function MainLayout({ children, onSearch }: MainLayoutProps) {
  const [isDarkMode, setIsDarkMode] = useState(false);

  // 테마 초기화
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    } else {
      setIsDarkMode(false);
      document.documentElement.classList.remove('dark');
    }
  }, []);

  // 테마 토글
  const toggleTheme = () => {
    const newTheme = !isDarkMode;
    setIsDarkMode(newTheme);
    
    if (newTheme) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  // 검색 핸들러
  const handleSearch = (city: string) => {
    if (onSearch) {
      onSearch(city);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header 
        onSearch={handleSearch}
        onToggleTheme={toggleTheme}
        isDarkMode={isDarkMode}
      />
      
      <main className="flex-1">
        {children}
      </main>
      
      <Footer />
    </div>
  );
}
