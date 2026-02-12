import { NextResponse } from 'next/server';
import { getBasins } from '@/lib/gis/service';
import { DataEnvelope } from '@petrosquare/types';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const data = await getBasins();
    return NextResponse.json({
      status: 'ok',
      data,
      provenance: {
        source_name: 'PetroSquare GIS Service',
        source_url: '/api/gis/basins',
        retrieved_at: new Date().toISOString()
      }
    } as DataEnvelope<typeof data>);
  } catch (error) {
    return NextResponse.json({
      status: 'degraded',
      data: null,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Failed to fetch basins'
      }
    }, { status: 500 });
  }
}
