import { z } from 'zod';
import type { WeatherContext, Provenance } from '@petrosquare/types';

// NOAA schemas
const PointsSchema = z.object({
  properties: z.object({
    forecast: z.string().url(),
  }),
});

const ForecastSchema = z.object({
  properties: z.object({
    periods: z.array(z.object({
      name: z.string(),
      startTime: z.string(),
      temperature: z.number(),
      temperatureUnit: z.string(),
      windSpeed: z.string().optional(),
      windDirection: z.string().optional(),
      shortForecast: z.string(),
    })).min(1),
  }),
});

export async function fetchNoaaWeather(lat: number, lon: number): Promise<WeatherContext> {
  const userAgent = 'PetroSquare/1.0 (internal-tool)';

  try {
    // 1. Get Grid Point
    const pointUrl = `https://api.weather.gov/points/${lat},${lon}`;
    const pointRes = await fetch(pointUrl, {
      headers: { 'User-Agent': userAgent }
    });

    if (!pointRes.ok) throw new Error(`NOAA Point API Error: ${pointRes.status}`);

    const pointJson = await pointRes.json();
    const pointData = PointsSchema.parse(pointJson);

    // 2. Get Forecast
    const forecastUrl = pointData.properties.forecast;
    const forecastRes = await fetch(forecastUrl, {
      headers: { 'User-Agent': userAgent }
    });

    if (!forecastRes.ok) throw new Error(`NOAA Forecast API Error: ${forecastRes.status}`);

    const forecastJson = await forecastRes.json();
    const forecastData = ForecastSchema.parse(forecastJson);

    const current = forecastData.properties.periods[0];

    const provenance: Provenance = {
      sourceName: 'National Weather Service (NOAA)',
      sourceUrl: forecastUrl,
      retrievedAt: new Date().toISOString(),
      license: 'Public Domain',
    };

    return {
      location: `${lat}, ${lon}`,
      temperature: current.temperature,
      unit: current.temperatureUnit as 'F' | 'C',
      condition: current.shortForecast,
      windSpeed: current.windSpeed ? parseFloat(current.windSpeed) : 0,
      windDirection: current.windDirection || 'N/A',
      provenance,
    };

  } catch (error) {
    console.error(`Failed to fetch NOAA weather for ${lat},${lon}:`, error);
    throw error;
  }
}
