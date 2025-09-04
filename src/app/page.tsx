'use client';

import { useState, useEffect, useCallback } from 'react';
import { MainLayout } from '@/components/layout/main-layout';
import { WeatherCard } from '@/components/weather/weather-card';
import { ForecastCard } from '@/components/weather/forecast-card';
import { HourlyForecast } from '@/components/weather/hourly-forecast';
import { RefreshControls } from '@/components/weather/refresh-controls';
import { LoadingIndicator } from '@/components/weather/loading-indicator';
import { getCurrentWeather, getWeatherForecast, WeatherData, ForecastData } from '@/lib/weather-api';
import { useWeather } from '@/contexts/weather-context';

export default function Home() {
  const [city, setCity] = useState('Seoul');
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [forecastData, setForecastData] = useState<ForecastData | null>(null);
  const { 
    isLoading, 
    setIsLoading, 
    error, 
    setError, 
    lastUpdated, 
    setLastUpdated,
    setRefreshCallback,
    retryCount,
    setRetryCount
  } = useWeather();

  const fetchWeather = useCallback(async (searchCity: string, useCache: boolean = true) => {
    if (!searchCity.trim()) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      // 현재 날씨와 예보 데이터를 병렬로 가져오기
      const [currentWeather, forecast] = await Promise.all([
        getCurrentWeather(searchCity, useCache),
        getWeatherForecast(searchCity, useCache)
      ]);
      
      setWeatherData(currentWeather);
      setForecastData(forecast);
      setCity(searchCity);
      setLastUpdated(new Date());
      setRetryCount(0); // 성공 시 재시도 카운트 리셋
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '날씨 데이터를 가져오는데 실패했습니다.';
      setError(errorMessage);
      setRetryCount(retryCount + 1);
    } finally {
      setIsLoading(false);
    }
  }, [setIsLoading, setError, setLastUpdated, setRetryCount]);

  // 수동 새로고침 함수 (캐시 무시)
  const handleManualRefresh = useCallback(() => {
    fetchWeather(city, false);
  }, [city, fetchWeather]);

  // 재시도 함수
  const handleRetry = useCallback(() => {
    fetchWeather(city, false);
  }, [city, fetchWeather]);

  // 자동 새로고침 콜백을 context에 등록
  useEffect(() => {
    setRefreshCallback(() => fetchWeather(city, false));
  }, [setRefreshCallback, city, fetchWeather]);

  useEffect(() => {
    fetchWeather(city);
  }, [city, fetchWeather]);

  const handleSearch = (searchCity: string) => {
    fetchWeather(searchCity);
  };

  return (
    <MainLayout onSearch={handleSearch}>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto p-8 space-y-6">
          {/* 환영 메시지 */}
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              🌤️ 날씨 정보 웹 앱
            </h1>
            <p className="text-muted-foreground">
              실시간 날씨 정보를 확인하세요
            </p>
          </div>

          {/* 새로고침 컨트롤 */}
          <RefreshControls 
            onManualRefresh={handleManualRefresh}
            isRefreshing={isLoading}
          />

          {/* 로딩 및 에러 상태 */}
          <LoadingIndicator
            isLoading={isLoading}
            error={error}
            retryCount={retryCount}
            onRetry={handleRetry}
          />

          {/* 날씨 정보 표시 */}
          {weatherData && !isLoading && (
            <div className="space-y-6">
              {/* 현재 날씨 카드 */}
              <WeatherCard weatherData={weatherData} />
              
              {/* 오늘 날씨와 15일 예보를 세로로 배치 */}
              <div className="w-full max-w-2xl mx-auto space-y-6">
                {/* 시간별 예보 */}
                {forecastData && (
                  <HourlyForecast forecastData={forecastData} />
                )}
                
                {/* 15일 예보 */}
                {forecastData && (
                  <ForecastCard forecastData={forecastData} />
                )}
              </div>
            </div>
          )}

          {/* 테스트 링크 */}
          <div className="text-center space-y-2">
            <p className="text-sm text-muted-foreground">
              개발 환경 테스트를 원하시면 아래 링크를 클릭하세요
            </p>
            <div className="flex gap-4 justify-center">
              <a 
                href="/test" 
                className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
              >
                기본 테스트
          </a>
          <a
                href="/weather-test" 
                className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
              >
                상세 테스트
              </a>
            </div>
          </div>
        </div>
    </div>
    </MainLayout>
  );
}
