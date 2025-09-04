'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { MainLayout } from '@/components/layout/main-layout';
import { WeatherCard } from '@/components/weather/weather-card';
import { ForecastCard } from '@/components/weather/forecast-card';
import { HourlyForecast } from '@/components/weather/hourly-forecast';
import { getCurrentWeather, getWeatherForecast, WeatherData, ForecastData } from '@/lib/weather-api';
import { useWeather } from '@/contexts/weather-context';

export default function Home() {
  const [city, setCity] = useState('Seoul');
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [forecastData, setForecastData] = useState<ForecastData | null>(null);
  const { isLoading, setIsLoading, error, setError } = useWeather();

  const fetchWeather = useCallback(async (searchCity: string) => {
    if (!searchCity.trim()) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      // 현재 날씨와 예보 데이터를 병렬로 가져오기
      const [currentWeather, forecast] = await Promise.all([
        getCurrentWeather(searchCity),
        getWeatherForecast(searchCity)
      ]);
      
      setWeatherData(currentWeather);
      setForecastData(forecast);
      setCity(searchCity);
    } catch (err) {
      setError(err instanceof Error ? err.message : '날씨 데이터를 가져오는데 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  }, [setIsLoading, setError]);

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

          {/* 로딩 상태 */}
          {isLoading && (
            <Card className="max-w-md mx-auto">
              <CardContent className="pt-6 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-muted-foreground">날씨 데이터를 가져오는 중...</p>
              </CardContent>
            </Card>
          )}

          {/* 에러 메시지 */}
          {error && (
            <Alert variant="destructive" className="max-w-md mx-auto">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* 날씨 정보 표시 */}
          {weatherData && !isLoading && (
            <div className="space-y-6">
              <WeatherCard weatherData={weatherData} />
              
              {/* 시간별 예보 */}
              {forecastData && (
                <HourlyForecast forecastData={forecastData} />
              )}
              
              {/* 5일 예보 */}
              {forecastData && (
                <ForecastCard forecastData={forecastData} />
              )}
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
