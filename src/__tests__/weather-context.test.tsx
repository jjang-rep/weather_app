import { render, screen, act } from '@testing-library/react';
import { WeatherProvider, useWeather } from '@/contexts/weather-context';

// Test component to access context
const TestComponent = () => {
  const { unit, toggleUnit, isAutoRefreshEnabled, toggleAutoRefresh } = useWeather();
  
  return (
    <div>
      <div data-testid="unit">{unit}</div>
      <div data-testid="auto-refresh">{isAutoRefreshEnabled.toString()}</div>
      <button onClick={toggleUnit}>Toggle Unit</button>
      <button onClick={toggleAutoRefresh}>Toggle Auto Refresh</button>
    </div>
  );
};

describe('WeatherContext', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should provide default values', () => {
    render(
      <WeatherProvider>
        <TestComponent />
      </WeatherProvider>
    );

    expect(screen.getByTestId('unit')).toHaveTextContent('celsius');
    expect(screen.getByTestId('auto-refresh')).toHaveTextContent('true');
  });

  it('should toggle unit between celsius and fahrenheit', () => {
    render(
      <WeatherProvider>
        <TestComponent />
      </WeatherProvider>
    );

    const toggleButton = screen.getByText('Toggle Unit');
    
    act(() => {
      toggleButton.click();
    });

    expect(screen.getByTestId('unit')).toHaveTextContent('fahrenheit');
    expect(localStorage.getItem('weather-unit')).toBe('fahrenheit');
  });

  it('should toggle auto refresh setting', () => {
    render(
      <WeatherProvider>
        <TestComponent />
      </WeatherProvider>
    );

    const toggleButton = screen.getByText('Toggle Auto Refresh');
    
    act(() => {
      toggleButton.click();
    });

    expect(screen.getByTestId('auto-refresh')).toHaveTextContent('false');
    expect(localStorage.getItem('weather-auto-refresh')).toBe('false');
  });

  it('should load saved settings from localStorage', () => {
    localStorage.setItem('weather-unit', 'fahrenheit');
    localStorage.setItem('weather-auto-refresh', 'false');

    render(
      <WeatherProvider>
        <TestComponent />
      </WeatherProvider>
    );

    expect(screen.getByTestId('unit')).toHaveTextContent('fahrenheit');
    expect(screen.getByTestId('auto-refresh')).toHaveTextContent('false');
  });
});
