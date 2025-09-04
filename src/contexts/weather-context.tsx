'use client';

import { createContext, useContext, useState, useEffect, ReactNode, useCallback, useRef } from 'react';

interface WeatherContextType {
  unit: 'celsius' | 'fahrenheit';
  toggleUnit: () => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  error: string | null;
  setError: (error: string | null) => void;
  lastUpdated: Date | null;
  setLastUpdated: (date: Date | null) => void;
  refreshWeather: () => Promise<void>;
  isAutoRefreshEnabled: boolean;
  toggleAutoRefresh: () => void;
  retryCount: number;
  setRetryCount: (count: number) => void;
  setRefreshCallback: (callback: () => Promise<void>) => void;
}

const WeatherContext = createContext<WeatherContextType | undefined>(undefined);

export function WeatherProvider({ children }: { children: ReactNode }) {
  const [unit, setUnit] = useState<'celsius' | 'fahrenheit'>('celsius');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [isAutoRefreshEnabled, setIsAutoRefreshEnabled] = useState(true);
  const [retryCount, setRetryCount] = useState(0);
  
  const autoRefreshIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const refreshCallbackRef = useRef<(() => Promise<void>) | null>(null);

  // 단위 설정을 localStorage에서 불러오기
  useEffect(() => {
    const savedUnit = localStorage.getItem('weather-unit') as 'celsius' | 'fahrenheit';
    if (savedUnit) {
      setUnit(savedUnit);
    }
    
    const savedAutoRefresh = localStorage.getItem('weather-auto-refresh');
    if (savedAutoRefresh !== null) {
      setIsAutoRefreshEnabled(JSON.parse(savedAutoRefresh));
    }
  }, []);

  // 단위 변경 시 localStorage에 저장
  const toggleUnit = () => {
    const newUnit = unit === 'celsius' ? 'fahrenheit' : 'celsius';
    setUnit(newUnit);
    localStorage.setItem('weather-unit', newUnit);
  };

  // 자동 새로고침 토글
  const toggleAutoRefresh = () => {
    const newValue = !isAutoRefreshEnabled;
    setIsAutoRefreshEnabled(newValue);
    localStorage.setItem('weather-auto-refresh', JSON.stringify(newValue));
  };

  // 새로고침 함수 (외부에서 설정 가능)
  const refreshWeather = useCallback(async () => {
    if (refreshCallbackRef.current) {
      await refreshCallbackRef.current();
    }
  }, []);

  // 자동 새로고침 설정 (30분마다)
  useEffect(() => {
    if (isAutoRefreshEnabled) {
      autoRefreshIntervalRef.current = setInterval(() => {
        refreshWeather();
      }, 30 * 60 * 1000); // 30분
    } else {
      if (autoRefreshIntervalRef.current) {
        clearInterval(autoRefreshIntervalRef.current);
        autoRefreshIntervalRef.current = null;
      }
    }

    return () => {
      if (autoRefreshIntervalRef.current) {
        clearInterval(autoRefreshIntervalRef.current);
      }
    };
  }, [isAutoRefreshEnabled, refreshWeather]);

  // 컴포넌트 언마운트 시 정리
  useEffect(() => {
    return () => {
      if (autoRefreshIntervalRef.current) {
        clearInterval(autoRefreshIntervalRef.current);
      }
    };
  }, []);

  // 외부에서 새로고침 콜백을 설정할 수 있도록 하는 함수
  const setRefreshCallback = useCallback((callback: () => Promise<void>) => {
    refreshCallbackRef.current = callback;
  }, []);

  return (
    <WeatherContext.Provider
      value={{
        unit,
        toggleUnit,
        isLoading,
        setIsLoading,
        error,
        setError,
        lastUpdated,
        setLastUpdated,
        refreshWeather,
        isAutoRefreshEnabled,
        toggleAutoRefresh,
        retryCount,
        setRetryCount,
        setRefreshCallback,
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


