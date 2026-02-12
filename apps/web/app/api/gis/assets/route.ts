import { NextRequest, NextResponse } from 'next/server';
import { getAssets } from '@/lib/gis/service';
import { DataEnvelope } from '@petrosquare/types';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const basin_id = searchParams.get('basin_id') || undefined;
  const operator_id = searchParams.get('operator_id') || undefined;
  const type = searchParams.get('type') || undefined;

  try {
    const data = await getAssets({ basin_id, operator_id, type });
    return NextResponse.json({
      status: 'ok',
      data,
      provenance: {
        source_name: 'PetroSquare GIS Service',
        source_url: request.nextUrl.toString(),
        retrieved_at: new Date().toISOString()
      }
    } as DataEnvelope<typeof data>);
  } catch (error) {
    return NextResponse.json({
      status: 'degraded',
      data: null,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Failed to fetch assets'
      }
    }, { status: 500 });
  }
}
