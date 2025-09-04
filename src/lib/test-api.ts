// API 테스트 유틸리티 함수

import { getCurrentWeather, getWeatherForecast, getWeatherIconUrl, formatTemperature } from './weather-api';

export async function testWeatherAPI() {
  console.log('=== Weather API 테스트 시작 ===');
  
  // 환경 변수 확인
  const apiKey = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY;
  const baseUrl = process.env.NEXT_PUBLIC_OPENWEATHER_BASE_URL;
  
  console.log('API Key 설정 상태:', apiKey ? '✅ 설정됨' : '❌ 설정되지 않음');
  console.log('Base URL:', baseUrl);
  
  if (!apiKey) {
    console.error('❌ API 키가 설정되지 않았습니다. .env.local 파일을 확인하세요.');
    return false;
  }
  
  try {
    // 서울 날씨 테스트
    console.log('서울 날씨 데이터 요청 중...');
    const weatherData = await getCurrentWeather('Seoul');
    console.log('✅ 현재 날씨 데이터:', {
      도시: weatherData.name,
      온도: formatTemperature(weatherData.main.temp),
      날씨: weatherData.weather[0].description,
      습도: `${weatherData.main.humidity}%`,
      풍속: `${weatherData.wind.speed}m/s`
    });
    
    // 예보 데이터 테스트
    console.log('서울 예보 데이터 요청 중...');
    const forecastData = await getWeatherForecast('Seoul');
    console.log('✅ 예보 데이터:', {
      도시: forecastData.city.name,
      예보_개수: forecastData.list.length,
      첫번째_예보: forecastData.list[0].dt_txt
    });
    
    // 아이콘 URL 테스트
    const iconUrl = getWeatherIconUrl(weatherData.weather[0].icon);
    console.log('✅ 날씨 아이콘 URL:', iconUrl);
    
    console.log('=== Weather API 테스트 완료 ===');
    return true;
    
  } catch (error) {
    console.error('❌ API 테스트 실패:', error);
    return false;
  }
}

export function testUtilityFunctions() {
  console.log('=== 유틸리티 함수 테스트 ===');
  
  // 온도 포맷팅 테스트
  const tempC = 25.5;
  const tempF = formatTemperature(tempC, 'fahrenheit');
  const tempCFormatted = formatTemperature(tempC, 'celsius');
  
  console.log('온도 포맷팅 테스트:');
  console.log(`섭씨: ${tempC}°C → ${tempCFormatted}`);
  console.log(`화씨: ${tempC}°C → ${tempF}`);
  
  // 아이콘 URL 테스트
  const iconUrl = getWeatherIconUrl('01d');
  console.log('아이콘 URL 테스트:', iconUrl);
  
  console.log('=== 유틸리티 함수 테스트 완료 ===');
}

