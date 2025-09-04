// Weather API utility functions

export interface WeatherData {
  main: {
    temp: number;
    feels_like: number;
    humidity: number;
    pressure: number;
    temp_max: number;
    temp_min: number;
  };
  weather: Array<{
    main: string;
    description: string;
    icon: string;
  }>;
  wind: {
    speed: number;
    deg: number;
  };
  name: string;
  sys: {
    country: string;
  };
  visibility?: number;
}

export interface ForecastData {
  list: Array<{
    dt: number;
    main: {
      temp: number;
      feels_like: number;
      humidity: number;
    };
    weather: Array<{
      main: string;
      description: string;
      icon: string;
    }>;
    wind: {
      speed: number;
    };
    dt_txt: string;
  }>;
  city: {
    name: string;
    country: string;
  };
}

import { weatherCache, getCacheKey } from './cache';

// API 엔드포인트 - 백엔드 프록시 사용
const API_BASE_URL = '/api/weather';

export async function getCurrentWeather(city: string): Promise<WeatherData> {
  const cacheKey = getCacheKey('current', city);
  
  // 캐시에서 데이터 확인
  const cachedData = weatherCache.get<WeatherData>(cacheKey);
  if (cachedData) {
    console.log('Using cached current weather data for', city);
    return cachedData;
  }

  const response = await fetch(
    `${API_BASE_URL}?city=${encodeURIComponent(city)}&type=current`
  );

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `Failed to fetch weather data: ${response.statusText}`);
  }

  const data = await response.json();
  
  // 캐시에 저장 (5분간 유효)
  weatherCache.set(cacheKey, data, 5 * 60 * 1000);
  
  return data;
}

export async function getWeatherForecast(city: string): Promise<ForecastData> {
  const cacheKey = getCacheKey('forecast', city);
  
  // 캐시에서 데이터 확인
  const cachedData = weatherCache.get<ForecastData>(cacheKey);
  if (cachedData) {
    console.log('Using cached forecast data for', city);
    return cachedData;
  }

  const response = await fetch(
    `${API_BASE_URL}?city=${encodeURIComponent(city)}&type=forecast`
  );

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `Failed to fetch forecast data: ${response.statusText}`);
  }

  const data = await response.json();
  
  // 캐시에 저장 (10분간 유효)
  weatherCache.set(cacheKey, data, 10 * 60 * 1000);
  
  return data;
}

export function getWeatherIconUrl(iconCode: string): string {
  return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
}

export function formatTemperature(temp: number, unit: 'celsius' | 'fahrenheit' = 'celsius'): string {
  if (unit === 'fahrenheit') {
    return `${Math.round((temp * 9/5) + 32)}°F`;
  }
  return `${Math.round(temp)}°C`;
}
