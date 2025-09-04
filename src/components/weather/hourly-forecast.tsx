'use client';

import Image from 'next/image';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { getWeatherIconUrl, formatTemperature, ForecastData } from '@/lib/weather-api';
import { useWeather } from '@/contexts/weather-context';

interface HourlyForecastProps {
  forecastData: ForecastData;
}

export function HourlyForecast({ forecastData }: HourlyForecastProps) {
  const { unit } = useWeather();
  // 다음 24시간의 예보 데이터만 가져오기
  const next24Hours = forecastData.list.slice(0, 8); // 3시간 간격이므로 8개 = 24시간

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span>⏰</span>
          <span>24시간 예보</span>
          <span className="text-sm font-normal text-muted-foreground">
            - {forecastData.city.name}, {forecastData.city.country}
          </span>
        </CardTitle>
        <CardDescription>
          향후 24시간의 시간별 날씨 예보입니다
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <div className="overflow-x-auto">
          <div className="flex gap-4 min-w-max">
            {next24Hours.map((forecast) => {
              const date = new Date(forecast.dt_txt);
              const time = date.toLocaleTimeString('ko-KR', { 
                hour: '2-digit', 
                minute: '2-digit' 
              });
              
              return (
                <div key={forecast.dt} className="flex-shrink-0 text-center p-3 bg-muted/30 rounded-lg min-w-[100px]">
                  <div className="text-sm font-medium text-muted-foreground mb-2">
                    {time}
                  </div>
                  
                  <div className="mb-2">
                    <Image 
                      src={getWeatherIconUrl(forecast.weather[0].icon)} 
                      alt={forecast.weather[0].description}
                      width={32}
                      height={32}
                      className="w-8 h-8 mx-auto"
                    />
                  </div>
                  
                  <div className="space-y-1">
                    <div className="text-sm font-semibold">
                      {formatTemperature(forecast.main.temp, unit)}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {forecast.main.humidity}%
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {forecast.wind.speed} m/s
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
