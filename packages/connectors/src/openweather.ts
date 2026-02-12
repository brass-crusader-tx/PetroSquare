import { z } from 'zod';
import type { WeatherSnapshotResponse, Provenance, ApiResponse } from '@petrosquare/types';

const WeatherResponseSchema = z.object({
  main: z.object({
    temp: z.number(),
  }),
  wind: z.object({
    speed: z.number(),
  }),
  weather: z.array(z.object({
    main: z.string(),
    description: z.string(),
  })),
  name: z.string().optional(),
});

const BASE_URL = 'https://api.openweathermap.org/data/2.5/weather';

interface WeatherConfig {
  lat: number;
  lon: number;
  apiKey: string;
}

export const fetchWeatherSnapshot = async (
  lat: number,
  lon: number,
  apiKey: string
): Promise<ApiResponse<WeatherSnapshotResponse>> => {
  if (!apiKey) {
    return {
      data: null,
      status: 'degraded',
      error: 'Missing OPENWEATHER_API_KEY',
      provenance: {
        source_name: 'OpenWeather',
        source_url: 'https://openweathermap.org/',
        retrieved_at: new Date().toISOString(),
        units: 'Metric',
        notes: 'Configuration error',
      },
    };
  }

  const url = `${BASE_URL}?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

  try {
    const res = await fetch(url, { next: { revalidate: 900 } } as RequestInit); // 15 mins
    if (!res.ok) {
      throw new Error(`OpenWeather API Error: ${res.status}`);
    }
    const raw = await res.json();
    const parsed = WeatherResponseSchema.safeParse(raw);

    if (!parsed.success) {
      console.error('Weather Parse Error:', parsed.error);
      throw new Error('Invalid OpenWeather response structure');
    }

    const { main, wind, weather, name } = parsed.data;

    return {
      data: {
        temperature: main.temp,
        wind_speed: wind.speed,
        conditions: weather[0]?.description || 'Unknown',
        location: name || `${lat}, ${lon}`,
        unit_system: 'metric',
      },
      status: 'ok',
      provenance: {
        source_name: 'OpenWeather',
        source_url: 'https://openweathermap.org/',
        retrieved_at: new Date().toISOString(),
        units: 'Metric (C, m/s)',
        notes: `Real-time weather for ${lat}, ${lon}`,
        cache_policy: 'revalidate: 900s',
      },
    };
  } catch (error) {
    return {
      data: null,
      status: 'degraded',
      error: error instanceof Error ? error.message : 'Unknown error',
      provenance: {
        source_name: 'OpenWeather',
        source_url: 'https://openweathermap.org/',
        retrieved_at: new Date().toISOString(),
        units: 'Metric',
        notes: 'Failed to fetch weather data',
      },
    };
  }
};
