import { NextResponse } from 'next/server';
import { fetchEiaSpotPrice } from '@petrosquare/connectors';
import type { MarketData } from '@petrosquare/types';

export const revalidate = 3600; // Cache for 1 hour

export async function GET() {
  const benchmarks: MarketData[] = [];
  const errors: string[] = [];

  // WTI Spot Price
  try {
    const wti = await fetchEiaSpotPrice('PET.RCLC1.D', 'WTI');
    benchmarks.push(wti);
  } catch (e) {
    console.error('Failed to fetch WTI:', e);
    errors.push(`WTI: ${(e as Error).message}`);
  }

  // Brent Spot Price
  try {
    const brent = await fetchEiaSpotPrice('PET.RBRTE.D', 'Brent');
    benchmarks.push(brent);
  } catch (e) {
    console.error('Failed to fetch Brent:', e);
    errors.push(`Brent: ${(e as Error).message}`);
  }

  return NextResponse.json({
    data: benchmarks,
    meta: {
      timestamp: new Date().toISOString(),
      source: 'EIA',
      count: benchmarks.length,
      errors: errors.length > 0 ? errors : undefined
    }
  });
}
