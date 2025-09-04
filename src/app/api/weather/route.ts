import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = 'https://api.openweathermap.org/data/2.5';
const API_KEY = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY || '275b859ff12e4764680e08eada7abeba';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const city = searchParams.get('city');
    const type = searchParams.get('type') || 'current'; // 'current' or 'forecast'

    if (!city) {
      return NextResponse.json(
        { error: 'City parameter is required' },
        { status: 400 }
      );
    }

    if (!API_KEY) {
      return NextResponse.json(
        { error: 'API key is not configured' },
        { status: 500 }
      );
    }

    const endpoint = type === 'forecast' ? 'forecast' : 'weather';
    const url = `${API_BASE_URL}/${endpoint}?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric&lang=kr`;

    const response = await fetch(url);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return NextResponse.json(
        { 
          error: 'Failed to fetch weather data',
          details: errorData.message || response.statusText 
        },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);

  } catch (error) {
    console.error('Weather API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}


