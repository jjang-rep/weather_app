import { getCurrentWeather, getWeatherForecast, formatTemperature } from '@/lib/weather-api';

// Mock fetch
global.fetch = jest.fn();

describe('Weather API', () => {
  beforeEach(() => {
    (fetch as jest.Mock).mockClear();
  });

  describe('getCurrentWeather', () => {
    it('should fetch current weather data successfully', async () => {
      const mockWeatherData = {
        main: { temp: 20, feels_like: 22, humidity: 60, pressure: 1013 },
        weather: [{ main: 'Clear', description: 'clear sky', icon: '01d' }],
        wind: { speed: 3.5, deg: 180 },
        name: 'Seoul',
        sys: { country: 'KR' }
      };

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockWeatherData,
      });

      const result = await getCurrentWeather('Seoul');

      expect(fetch).toHaveBeenCalledWith('/api/weather?city=Seoul&type=current');
      expect(result).toEqual(mockWeatherData);
    });

    it('should retry on failure with exponential backoff', async () => {
      (fetch as jest.Mock)
        .mockRejectedValueOnce(new Error('Network error'))
        .mockRejectedValueOnce(new Error('Network error'))
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ main: { temp: 20 } }),
        });

      const result = await getCurrentWeather('Seoul', false);

      expect(fetch).toHaveBeenCalledTimes(3);
      expect(result).toBeDefined();
    });
  });

  describe('getWeatherForecast', () => {
    it('should fetch forecast data successfully', async () => {
      const mockForecastData = {
        list: [
          {
            dt: 1640995200,
            main: { temp: 20, feels_like: 22, humidity: 60 },
            weather: [{ main: 'Clear', description: 'clear sky', icon: '01d' }],
            wind: { speed: 3.5 },
            dt_txt: '2022-01-01 12:00:00'
          }
        ],
        city: { name: 'Seoul', country: 'KR' }
      };

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockForecastData,
      });

      const result = await getWeatherForecast('Seoul');

      expect(fetch).toHaveBeenCalledWith('/api/weather?city=Seoul&type=forecast');
      expect(result).toEqual(mockForecastData);
    });
  });

  describe('formatTemperature', () => {
    it('should format temperature in Celsius', () => {
      expect(formatTemperature(20)).toBe('20°C');
    });

    it('should format temperature in Fahrenheit', () => {
      expect(formatTemperature(20, 'fahrenheit')).toBe('68°F');
    });
  });
});
