'use client';

import Image from 'next/image';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { getWeatherIconUrl, formatTemperature, ForecastData } from '@/lib/weather-api';
import { useWeather } from '@/contexts/weather-context';

interface ForecastCardProps {
  forecastData: ForecastData;
}

export function ForecastCard({ forecastData }: ForecastCardProps) {
  const { unit } = useWeather();
  // 5일 예보 데이터를 일별로 그룹화
  const dailyForecasts = forecastData.list.reduce((acc: Array<{date: string, items: typeof forecastData.list}>, item) => {
    const date = new Date(item.dt_txt).toDateString();
    const existingDay = acc.find(day => day.date === date);
    
    if (existingDay) {
      existingDay.items.push(item);
    } else {
      acc.push({
        date,
        items: [item]
      });
    }
    
    return acc;
  }, []);

  // 각 날짜별로 대표 데이터 선택 (12시 데이터 우선, 없으면 첫 번째)
  const representativeForecasts = dailyForecasts.map(day => {
    const noonItem = day.items.find(item => 
      new Date(item.dt_txt).getHours() === 12
    );
    return noonItem || day.items[0];
  });

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span>📅</span>
          <span>5일 예보</span>
          <span className="text-sm font-normal text-muted-foreground">
            - {forecastData.city.name}, {forecastData.city.country}
          </span>
        </CardTitle>
        <CardDescription>
          향후 5일간의 날씨 예보입니다
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {representativeForecasts.slice(0, 5).map((forecast, index: number) => {
            const date = new Date(forecast.dt_txt);
            const isToday = index === 0;
            
            return (
              <div key={forecast.dt} className="text-center p-4 bg-muted/30 rounded-lg">
                <div className="text-sm font-medium text-muted-foreground mb-2">
                  {isToday ? '오늘' : date.toLocaleDateString('ko-KR', { 
                    month: 'short', 
                    day: 'numeric',
                    weekday: 'short'
                  })}
                </div>
                
                <div className="mb-3">
                  <Image 
                    src={getWeatherIconUrl(forecast.weather[0].icon)} 
                    alt={forecast.weather[0].description}
                    width={48}
                    height={48}
                    className="w-12 h-12 mx-auto"
                  />
                </div>
                
                <div className="space-y-1">
                  <div className="text-lg font-semibold">
                    {formatTemperature(forecast.main.temp, unit)}
                  </div>
                  <div className="text-xs text-muted-foreground capitalize">
                    {forecast.weather[0].description}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    체감 {formatTemperature(forecast.main.feels_like, unit)}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
