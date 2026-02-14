import { NextRequest, NextResponse } from 'next/server';
import { getTelemetry } from '@/lib/control-center/data';

export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const window = request.nextUrl.searchParams.get('window') as '1h' | '24h' | '7d' || '1h';
  const data = await getTelemetry(params.id, window);

  return NextResponse.json({
    assetId: params.id,
    window,
    series: data,
    provenance: {
      source: 'SCADA_HISTORIAN_STUB',
      retrievedAt: new Date().toISOString(),
      unit: data[0]?.unit || 'unknown'
    }
  });
}
