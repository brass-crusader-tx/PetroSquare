import { NextResponse } from 'next/server';
import { fetchWeatherSnapshot } from '@petrosquare/connectors';

export const revalidate = 900; // 15 min

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  // Default to Houston, TX (Energy Capital)
  const lat = parseFloat(searchParams.get('lat') || '29.7604');
  const lon = parseFloat(searchParams.get('lon') || '-95.3698');

  const apiKey = process.env.OPENWEATHER_API_KEY || '';

  const timeoutPromise = new Promise((_, reject) =>
    setTimeout(() => reject(new Error('Upstream timeout')), 8000)
  );

  try {
    const response = await Promise.race([
      fetchWeatherSnapshot(lat, lon, apiKey),
      timeoutPromise
    ]) as Awaited<ReturnType<typeof fetchWeatherSnapshot>>;

    return NextResponse.json(response);
  } catch (error) {
    return NextResponse.json({
      data: null,
      status: 'degraded',
      error: error instanceof Error ? error.message : 'Unknown error',
      provenance: {
        source_name: 'OpenWeather',
        source_url: 'https://openweathermap.org/',
        retrieved_at: new Date().toISOString(),
        units: 'Metric',
        notes: 'API Route Error',
      }
    });
  }
}
