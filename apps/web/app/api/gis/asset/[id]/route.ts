import { NextRequest, NextResponse } from 'next/server';
import { getAssetById } from '../../../../../lib/gis/service';
import { DataEnvelope } from '@petrosquare/types';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const data = await getAssetById(params.id);
    if (!data) {
        return NextResponse.json({
            status: 'degraded',
            data: null,
            error: {
                code: 'NOT_FOUND',
                message: 'Asset not found'
            }
        }, { status: 404 });
    }

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
        message: 'Failed to fetch asset'
      }
    }, { status: 500 });
  }
}
