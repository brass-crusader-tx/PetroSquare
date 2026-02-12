import { NextRequest, NextResponse } from 'next/server';
import { fetchUsStateReserves, listUsStates } from '@petrosquare/connectors';
import { DataEnvelope, ReservesSeriesResponse, RegionKind } from '@petrosquare/types';

export const revalidate = 604800; // 7 days

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const kind = searchParams.get('kind') as RegionKind;
  const code = searchParams.get('code');
  const start = searchParams.get('start') || undefined;
  const end = searchParams.get('end') || undefined;

  if (!kind || !code) {
    return NextResponse.json({
        status: 'error',
        data: null,
        error: { code: 'BAD_REQUEST', message: 'Missing kind or code' }
    }, { status: 400 });
  }

  if (kind === 'CA_PROVINCE') {
    return NextResponse.json({
        status: 'degraded',
        data: null,
        error: {
            code: 'NOT_AVAILABLE',
            message: 'Provincial proved reserves feed not available via stable public API yet.'
        },
        provenance: {
            source_name: 'CER',
            source_url: 'N/A',
            retrieved_at: new Date().toISOString()
        }
    } as DataEnvelope<null>, { status: 200 });
  }

  try {
    const usState = listUsStates().find(s => s.code === code);
    const name = usState ? usState.name : code;

    const result = await fetchUsStateReserves(code, { start, end });

    // Transform to canonical API response
    const apiResult: ReservesSeriesResponse = {
        region: { kind, code, name },
        commodity: 'CRUDE_OIL',
        series: result.series,
        units: result.units,
        frequency: result.frequency,
        provenance: {
            ...result.provenance,
            cache_policy: '7 days',
            request_fingerprint: `reserves-${kind}-${code}-${start}-${end}`
        }
    };

    const envelope: DataEnvelope<ReservesSeriesResponse> = {
        status: 'ok',
        data: apiResult,
        provenance: apiResult.provenance
    };

    return NextResponse.json(envelope);

  } catch (error: any) {
      console.error('Reserves API Error:', error);
      const envelope: DataEnvelope<null> = {
          status: 'degraded',
          data: null,
          error: {
              code: 'UPSTREAM_ERROR',
              message: error.message || 'Upstream service unavailable'
          },
          provenance: {
              source_name: kind === 'US_STATE' ? 'EIA' : 'CER',
              source_url: 'N/A',
              retrieved_at: new Date().toISOString()
          }
      };
      return NextResponse.json(envelope, { status: 200 });
  }
}
