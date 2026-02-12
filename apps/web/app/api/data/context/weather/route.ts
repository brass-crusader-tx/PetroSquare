import { NextResponse } from 'next/server';
import { fetchNoaaWeather } from '@petrosquare/connectors';

export const revalidate = 1800; // Cache for 30 minutes

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  // Default to Cushing, OK if not provided
  const lat = parseFloat(searchParams.get('lat') || '35.9606');
  const lon = parseFloat(searchParams.get('lon') || '-96.7713');

  try {
    const weather = await fetchNoaaWeather(lat, lon);

    return NextResponse.json({
      data: weather,
      meta: {
        timestamp: new Date().toISOString(),
        location: `${lat}, ${lon}`
      }
    });
  } catch (error) {
     return NextResponse.json({
       error: 'Failed to fetch weather data',
       details: (error as Error).message
     }, { status: 500 });
  }
}
