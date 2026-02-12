import { NextResponse } from 'next/server';
import { fetchBenchmarkPrices } from '@petrosquare/connectors';

export const revalidate = 300; // 5 minutes cache for the API route itself

export async function GET() {
  const apiKey = process.env.EIA_API_KEY || '';

  // Timeout wrapper
  const timeoutPromise = new Promise((_, reject) =>
    setTimeout(() => reject(new Error('Upstream timeout')), 8000)
  );

  try {
    const response = await Promise.race([
      fetchBenchmarkPrices(apiKey),
      timeoutPromise
    ]) as Awaited<ReturnType<typeof fetchBenchmarkPrices>>;

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
        units: 'USD/bbl',
        notes: 'API Route Error',
      }
    });
  }
}
