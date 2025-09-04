'use client';

import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getWeatherIconUrl, formatTemperature, WeatherData } from '@/lib/weather-api';
import { useWeather } from '@/contexts/weather-context';

interface WeatherCardProps {
  weatherData: WeatherData;
}

export function WeatherCard({ weatherData }: WeatherCardProps) {
  const { unit } = useWeather();
  const weather = weatherData.weather[0];
  const main = weatherData.main;
  const wind = weatherData.wind;

  return (
    <Card className="w-full max-w-2xl mx-auto" role="region" aria-label="현재 날씨 정보">
      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-center gap-3 text-2xl">
          <Image 
            src={getWeatherIconUrl(weather.icon)} 
            alt={weather.description}
            width={48}
            height={48}
            className="w-12 h-12"
          />
          <div>
            <div>{weatherData.name}, {weatherData.sys.country}</div>
            <div className="text-sm font-normal text-muted-foreground">
              {new Date().toLocaleDateString('ko-KR', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                weekday: 'long'
              })}
            </div>
          </div>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* 현재 온도 */}
        <div className="text-center">
          <div className="text-8xl font-bold text-primary mb-2">
            {formatTemperature(main.temp, unit)}
          </div>
          <div className="text-2xl text-muted-foreground capitalize">
            {weather.description}
          </div>
        </div>

        {/* 상세 정보 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4" role="group" aria-label="날씨 세부 정보">
          <div className="text-center p-4 bg-muted/50 rounded-lg" role="group" aria-label="체감 온도">
            <div className="text-sm text-muted-foreground mb-1">체감 온도</div>
            <div className="text-xl font-semibold" aria-live="polite">
              {formatTemperature(main.feels_like, unit)}
            </div>
          </div>
          
          <div className="text-center p-4 bg-muted/50 rounded-lg" role="group" aria-label="습도">
            <div className="text-sm text-muted-foreground mb-1">습도</div>
            <div className="text-xl font-semibold" aria-live="polite">
              {main.humidity}%
            </div>
          </div>
          
          <div className="text-center p-4 bg-muted/50 rounded-lg" role="group" aria-label="풍속">
            <div className="text-sm text-muted-foreground mb-1">풍속</div>
            <div className="text-xl font-semibold" aria-live="polite">
              {wind.speed} m/s
            </div>
          </div>
          
          <div className="text-center p-4 bg-muted/50 rounded-lg" role="group" aria-label="기압">
            <div className="text-sm text-muted-foreground mb-1">기압</div>
            <div className="text-xl font-semibold" aria-live="polite">
              {main.pressure} hPa
            </div>
          </div>
        </div>

        {/* 추가 정보 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">최고 온도</span>
            <span className="font-semibold">
              {formatTemperature(main.temp_max, unit)}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">최저 온도</span>
            <span className="font-semibold">
              {formatTemperature(main.temp_min, unit)}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">풍향</span>
            <span className="font-semibold">
              {wind.deg}°
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">가시거리</span>
            <span className="font-semibold">
              {weatherData.visibility ? `${weatherData.visibility / 1000} km` : 'N/A'}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
