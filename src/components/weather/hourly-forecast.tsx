'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { getWeatherIconUrl, formatTemperature, ForecastData } from '@/lib/weather-api';
import { useWeather } from '@/contexts/weather-context';

interface HourlyForecastProps {
  forecastData: ForecastData;
}

export function HourlyForecast({ forecastData }: HourlyForecastProps) {
  const { unit } = useWeather();
  const [interval, setInterval] = useState<'1h' | '2h'>('2h');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  // 현재 시간에 맞는 인덱스 계산
  const getCurrentHourIndex = useCallback(() => {
    const now = new Date();
    const currentHour = now.getHours();
    const step = interval === '1h' ? 1 : 2;
    
    // 현재 시간에 가장 가까운 시간대 찾기
    let closestIndex = 0;
    let minDiff = Infinity;
    
    for (let hour = 0; hour < 24; hour += step) {
      const diff = Math.abs(hour - currentHour);
      if (diff < minDiff) {
        minDiff = diff;
        closestIndex = Math.floor(hour / step);
      }
    }
    
    return closestIndex;
  }, [interval]);

  // 오늘 날짜의 데이터만 필터링
  const today = new Date();
  const todayString = today.toISOString().split('T')[0];
  
  const todayForecasts = forecastData.list.filter(item => {
    const itemDate = new Date(item.dt_txt).toISOString().split('T')[0];
    return itemDate === todayString;
  });

  // 보간법을 사용한 시간대 생성
  const generateTimeSlots = () => {
    const slots = [];
    const step = interval === '1h' ? 1 : 2;
    
    // 3시간 간격 데이터를 기반으로 보간
    const interpolateData = (hour: number) => {
      // 가장 가까운 두 데이터 포인트 찾기
      const beforeHour = Math.floor(hour / 3) * 3;
      const afterHour = Math.ceil(hour / 3) * 3;
      
      const beforeData = todayForecasts.find(item => {
        const itemHour = new Date(item.dt_txt).getHours();
        return itemHour === beforeHour;
      });
      
      const afterData = todayForecasts.find(item => {
        const itemHour = new Date(item.dt_txt).getHours();
        return itemHour === afterHour;
      });

      if (!beforeData && !afterData) return null;
      if (!beforeData) return afterData;
      if (!afterData) return beforeData;

      // 선형 보간 계산 (NaN 방지)
      const ratio = afterHour !== beforeHour ? (hour - beforeHour) / (afterHour - beforeHour) : 0;
      
      return {
        ...beforeData,
        main: {
          ...beforeData.main,
          temp: Number((beforeData.main.temp + (afterData.main.temp - beforeData.main.temp) * ratio).toFixed(1)),
          feels_like: Number((beforeData.main.feels_like + (afterData.main.feels_like - beforeData.main.feels_like) * ratio).toFixed(1)),
          humidity: Math.round(beforeData.main.humidity + (afterData.main.humidity - beforeData.main.humidity) * ratio),
        },
        wind: {
          ...beforeData.wind,
          speed: Number((beforeData.wind.speed + (afterData.wind.speed - beforeData.wind.speed) * ratio).toFixed(1)),
        },
        weather: beforeData.weather, // 날씨 상태는 보간하지 않고 이전 값 사용
      };
    };
    
    for (let hour = 0; hour < 24; hour += step) {
      const timeString = `${hour.toString().padStart(2, '0')}:00`;
      const forecast = interpolateData(hour);
      
      slots.push({
        hour,
        timeString,
        forecast: forecast || null
      });
    }
    
    return slots;
  };

  const timeSlots = generateTimeSlots();

  // 현재 시간에 맞는 인덱스로 초기화 및 중앙 정렬
  useEffect(() => {
    const currentIndex = getCurrentHourIndex();
    setSelectedIndex(currentIndex);
    
    // 중앙 정렬을 위해 스크롤 위치 계산
    if (scrollContainerRef.current) {
      const itemWidth = 120;
      const containerWidth = scrollContainerRef.current.clientWidth;
      const scrollPosition = (currentIndex * itemWidth) - (containerWidth / 2) + (itemWidth / 2);
      
      setTimeout(() => {
        if (scrollContainerRef.current) {
          scrollContainerRef.current.scrollLeft = Math.max(0, scrollPosition);
        }
      }, 100);
    }
  }, [getCurrentHourIndex, interval]);

  // 드래그 시작
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (!scrollContainerRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - scrollContainerRef.current.offsetLeft);
    setScrollLeft(scrollContainerRef.current.scrollLeft);
  }, []);

  // 드래그 중
  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging || !scrollContainerRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollContainerRef.current.offsetLeft;
    const walk = (x - startX) * 2; // 드래그 속도 조절
    scrollContainerRef.current.scrollLeft = scrollLeft - walk;
  }, [isDragging, startX, scrollLeft]);

  // 드래그 종료
  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  // 터치 이벤트 지원
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (!scrollContainerRef.current) return;
    setIsDragging(true);
    setStartX(e.touches[0].pageX - scrollContainerRef.current.offsetLeft);
    setScrollLeft(scrollContainerRef.current.scrollLeft);
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!isDragging || !scrollContainerRef.current) return;
    const x = e.touches[0].pageX - scrollContainerRef.current.offsetLeft;
    const walk = (x - startX) * 2;
    scrollContainerRef.current.scrollLeft = scrollLeft - walk;
  }, [isDragging, startX, scrollLeft]);

  const handleTouchEnd = useCallback(() => {
    setIsDragging(false);
  }, []);

  // 클릭으로 선택
  const handleItemClick = (index: number) => {
    if (!scrollContainerRef.current) return;
    const itemWidth = 120;
    const scrollLeft = index * itemWidth;
    scrollContainerRef.current.scrollTo({ left: scrollLeft, behavior: 'smooth' });
    setSelectedIndex(index);
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <span>🌅</span>
              <span>오늘 날씨</span>
              <span className="text-sm font-normal text-muted-foreground">
                - {forecastData.city.name}, {forecastData.city.country}
              </span>
            </CardTitle>
          </div>
          
          {/* 시간 간격 토글 버튼 */}
          <div className="flex gap-2">
            <Button
              variant={interval === '1h' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setInterval('1h')}
            >
              1시간
            </Button>
            <Button
              variant={interval === '2h' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setInterval('2h')}
            >
              2시간
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="relative">

          {/* 시간대 표시 */}
          <div 
            ref={scrollContainerRef}
            className="flex gap-4 overflow-x-auto cursor-grab active:cursor-grabbing"
            style={{ 
              scrollbarWidth: 'none', 
              msOverflowStyle: 'none',
              WebkitOverflowScrolling: 'touch'
            }}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {timeSlots.map((slot, index) => (
              <div 
                key={slot.hour} 
                className={`flex-shrink-0 text-center p-3 rounded-lg min-w-[100px] cursor-pointer transition-all duration-200 select-none ${
                  index === selectedIndex 
                    ? 'bg-primary text-primary-foreground shadow-lg scale-105' 
                    : 'bg-muted/30 hover:bg-muted/50'
                }`}
                onClick={() => handleItemClick(index)}
              >
                <div className="text-sm font-medium mb-2">
                  {slot.timeString}
                </div>
                
                {slot.forecast ? (
                  <>
                    <div className="mb-2">
                      <Image 
                        src={getWeatherIconUrl(slot.forecast.weather[0].icon)} 
                        alt={slot.forecast.weather[0].description}
                        width={32}
                        height={32}
                        className="w-8 h-8 mx-auto"
                      />
                    </div>
                    
                    <div className="space-y-1">
                      <div className="text-sm font-semibold">
                        {formatTemperature(Math.round(slot.forecast.main.temp), unit)}
                      </div>
                      <div className="text-xs opacity-80">
                        {slot.forecast.main.humidity}%
                      </div>
                      <div className="text-xs opacity-80">
                        {slot.forecast.wind.speed.toFixed(1)} m/s
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="space-y-1">
                    <div className="text-sm text-muted-foreground">
                      데이터 없음
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
