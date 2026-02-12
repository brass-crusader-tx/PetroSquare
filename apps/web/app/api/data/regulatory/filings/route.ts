import { NextResponse } from 'next/server';
import { fetchRecentFilings } from '@petrosquare/connectors';

export const revalidate = 600; // 10 min

// Major Oil Companies CIKs
const DEFAULT_CIKS = [
  '0000034088', // Exxon (XOM)
  '0000093410', // Chevron (CVX)
  '0001306965', // Shell (SHEL)
  '0000313807', // BP
  '0001506307', // Kinder Morgan (KMI)
];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const limit = parseInt(searchParams.get('limit') || '10', 10);

  // Allow overriding CIKs? Maybe via `tickers` param in future.
  // For now, use default CIKs.

  const timeoutPromise = new Promise((_, reject) =>
    setTimeout(() => reject(new Error('Upstream timeout')), 8000)
  );

  try {
    const response = await Promise.race([
      fetchRecentFilings(DEFAULT_CIKS, limit),
      timeoutPromise
    ]) as Awaited<ReturnType<typeof fetchRecentFilings>>;

    return NextResponse.json(response);
  } catch (error) {
    return NextResponse.json({
      data: { filings: [] },
      status: 'degraded',
      error: error instanceof Error ? error.message : 'Unknown error',
      provenance: {
        source_name: 'SEC EDGAR',
        source_url: 'https://www.sec.gov/',
        retrieved_at: new Date().toISOString(),
        units: 'Filings',
        notes: 'API Route Error',
      }
    });
  }
}
