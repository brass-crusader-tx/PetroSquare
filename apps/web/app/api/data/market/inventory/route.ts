import { NextResponse } from 'next/server';
import { fetchCrudeInventories } from '@petrosquare/connectors';

export const revalidate = 3600; // 1 hour

export async function GET() {
  const apiKey = process.env.EIA_API_KEY || '';

  const timeoutPromise = new Promise((_, reject) =>
    setTimeout(() => reject(new Error('Upstream timeout')), 8000)
  );

  try {
    const response = await Promise.race([
      fetchCrudeInventories(apiKey),
      timeoutPromise
    ]) as Awaited<ReturnType<typeof fetchCrudeInventories>>;

    return NextResponse.json(response);
  } catch (error) {
    return NextResponse.json({
      data: null,
      status: 'degraded',
      error: error instanceof Error ? error.message : 'Unknown error',
      provenance: {
        source_name: 'EIA',
        source_url: 'https://www.eia.gov/',
        retrieved_at: new Date().toISOString(),
        units: 'Mbbl',
        notes: 'API Route Error',
      }
    });
  }
}
