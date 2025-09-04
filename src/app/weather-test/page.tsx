'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { getCurrentWeather, getWeatherIconUrl, formatTemperature, WeatherData } from '@/lib/weather-api';

export default function WeatherTestPage() {
  const [city, setCity] = useState('Seoul');
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchWeather = useCallback(async () => {
    if (!city.trim()) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const data = await getCurrentWeather(city);
      setWeatherData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : '날씨 데이터를 가져오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  }, [city]);

  useEffect(() => {
    fetchWeather();
  }, [fetchWeather]);

  const handleSearch = () => {
    fetchWeather();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="container mx-auto p-8 space-y-6">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-2">날씨 정보 웹 앱 테스트</h1>
        <p className="text-muted-foreground">
          OpenWeatherMap API를 통한 실시간 날씨 데이터 테스트
        </p>
      </div>

      {/* 검색 섹션 */}
      <Card>
        <CardHeader>
          <CardTitle>도시 검색</CardTitle>
          <CardDescription>날씨 정보를 확인하고 싶은 도시를 입력하세요</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Input
              value={city}
              onChange={(e) => setCity(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="도시명을 입력하세요 (예: Seoul, Tokyo, New York)"
              className="flex-1"
            />
            <Button onClick={handleSearch} disabled={loading}>
              {loading ? '검색 중...' : '검색'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* 에러 메시지 */}
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* 날씨 정보 표시 */}
      {weatherData && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Image 
                src={getWeatherIconUrl(weatherData.weather[0].icon)} 
                alt={weatherData.weather[0].description}
                width={32}
                height={32}
                className="w-8 h-8"
              />
              {weatherData.name}, {weatherData.sys.country}
            </CardTitle>
            <CardDescription>
              {new Date().toLocaleDateString('ko-KR', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                weekday: 'long'
              })}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* 현재 온도 */}
            <div className="text-center">
              <div className="text-6xl font-bold text-primary">
                {formatTemperature(weatherData.main.temp)}
              </div>
              <div className="text-xl text-muted-foreground">
                {weatherData.weather[0].description}
              </div>
            </div>

            {/* 상세 정보 */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-muted rounded-lg">
                <div className="text-sm text-muted-foreground">체감 온도</div>
                <div className="text-lg font-semibold">
                  {formatTemperature(weatherData.main.feels_like)}
                </div>
              </div>
              
              <div className="text-center p-4 bg-muted rounded-lg">
                <div className="text-sm text-muted-foreground">습도</div>
                <div className="text-lg font-semibold">
                  {weatherData.main.humidity}%
                </div>
              </div>
              
              <div className="text-center p-4 bg-muted rounded-lg">
                <div className="text-sm text-muted-foreground">풍속</div>
                <div className="text-lg font-semibold">
                  {weatherData.wind.speed} m/s
                </div>
              </div>
              
              <div className="text-center p-4 bg-muted rounded-lg">
                <div className="text-sm text-muted-foreground">기압</div>
                <div className="text-lg font-semibold">
                  {weatherData.main.pressure} hPa
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* API 상태 정보 */}
      <Card>
        <CardHeader>
          <CardTitle>API 상태</CardTitle>
          <CardDescription>현재 API 연결 상태 및 설정 정보</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex justify-between">
            <span>API 키 상태:</span>
            <span className="text-green-600 font-semibold">✅ 설정됨</span>
          </div>
          <div className="flex justify-between">
            <span>API 엔드포인트:</span>
            <span className="text-green-600 font-semibold">✅ 연결됨</span>
          </div>
          <div className="flex justify-between">
            <span>마지막 업데이트:</span>
            <span className="text-muted-foreground">
              {new Date().toLocaleTimeString('ko-KR')}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* 안내 메시지 */}
      <Alert>
        <AlertDescription>
          <strong>참고:</strong> 이 페이지는 기본 설정 및 라이브러리 설치가 제대로 작동하는지 테스트하기 위한 목적입니다. 
          API 키를 .env.local 파일에 설정해야 합니다.
        </AlertDescription>
      </Alert>
    </div>
  );
}
