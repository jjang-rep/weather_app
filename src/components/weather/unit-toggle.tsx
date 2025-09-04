'use client';

import { Button } from '@/components/ui/button';
import { useWeather } from '@/contexts/weather-context';

export function UnitToggle() {
  const { unit, toggleUnit } = useWeather();

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={toggleUnit}
      className="h-9 px-3"
    >
      <span className="text-sm font-medium">
        {unit === 'celsius' ? '°C' : '°F'}
      </span>
    </Button>
  );
}

