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

// 지수 백오프를 사용한 재시도 함수
async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  baseDelay: number = 1000
): Promise<T> {
  let lastError: Error;
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;
      
      if (attempt === maxRetries) {
        throw lastError;
      }
      
      // 지수 백오프: 1초, 2초, 4초, 8초...
      const delay = baseDelay * Math.pow(2, attempt);
      console.log(`API 호출 실패, ${delay}ms 후 재시도... (${attempt + 1}/${maxRetries})`);
      
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  throw lastError!;
}

export async function getCurrentWeather(city: string, useCache: boolean = true): Promise<WeatherData> {
  const cacheKey = getCacheKey('current', city);
  
  // 캐시에서 데이터 확인 (캐시 사용이 활성화된 경우에만)
  if (useCache) {
    const cachedData = weatherCache.get<WeatherData>(cacheKey);
    if (cachedData) {
      console.log('Using cached current weather data for', city);
      return cachedData;
    }
  }

  return retryWithBackoff(async () => {
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
  });
}

export async function getWeatherForecast(city: string, useCache: boolean = true): Promise<ForecastData> {
  const cacheKey = getCacheKey('forecast', city);
  
  // 캐시에서 데이터 확인 (캐시 사용이 활성화된 경우에만)
  if (useCache) {
    const cachedData = weatherCache.get<ForecastData>(cacheKey);
    if (cachedData) {
      console.log('Using cached forecast data for', city);
      return cachedData;
    }
  }

  return retryWithBackoff(async () => {
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
  });
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
