'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface WeatherContextType {
  unit: 'celsius' | 'fahrenheit';
  toggleUnit: () => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  error: string | null;
  setError: (error: string | null) => void;
}

const WeatherContext = createContext<WeatherContextType | undefined>(undefined);

export function WeatherProvider({ children }: { children: ReactNode }) {
  const [unit, setUnit] = useState<'celsius' | 'fahrenheit'>('celsius');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 단위 설정을 localStorage에서 불러오기
  useEffect(() => {
    const savedUnit = localStorage.getItem('weather-unit') as 'celsius' | 'fahrenheit';
    if (savedUnit) {
      setUnit(savedUnit);
    }
  }, []);

  // 단위 변경 시 localStorage에 저장
  const toggleUnit = () => {
    const newUnit = unit === 'celsius' ? 'fahrenheit' : 'celsius';
    setUnit(newUnit);
    localStorage.setItem('weather-unit', newUnit);
  };

  return (
    <WeatherContext.Provider
      value={{
        unit,
        toggleUnit,
        isLoading,
        setIsLoading,
        error,
        setError,
      }}
    >
      {children}
    </WeatherContext.Provider>
  );
}

export function useWeather() {
  const context = useContext(WeatherContext);
  if (context === undefined) {
    throw new Error('useWeather must be used within a WeatherProvider');
  }
  return context;
}

