import { NextRequest, NextResponse } from 'next/server';
import { getAISummary } from '@/lib/gis/service';
import { DataEnvelope } from '@petrosquare/types';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const context_id = request.nextUrl.searchParams.get('context_id');
  if (!context_id) {
      return NextResponse.json({
          status: 'error',
          error: {
              code: 'BAD_REQUEST',
              message: 'Missing context_id'
          }
      }, { status: 400 });
  }

  try {
    const data = await getAISummary(context_id);
    if (!data) {
        return NextResponse.json({
            status: 'error',
            error: {
                code: 'NOT_FOUND',
                message: 'No summary available for this context'
            }
        }, { status: 404 });
    }

    return NextResponse.json({
      status: 'ok',
      data,
      provenance: {
        source_name: 'PetroSquare AI Engine',
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
        message: 'Failed to generate summary'
      }
    }, { status: 500 });
  }
}
