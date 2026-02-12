import { NextRequest, NextResponse } from 'next/server';
import { fetchUsStateProduction, fetchCaProvinceProduction, listUsStates, listCaProvinces } from '@petrosquare/connectors';
import { DataEnvelope, ProductionSeriesResponse, RegionKind } from '@petrosquare/types';

export const revalidate = 21600; // 6 hours

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

  try {
    let result: any; // Connector response type
    let name = code;

    if (kind === 'US_STATE') {
        const states = listUsStates();
        const state = states.find(s => s.code === code);
        if (state) name = state.name;
        result = await fetchUsStateProduction(code, { start, end });
    } else if (kind === 'CA_PROVINCE') {
        const provinces = listCaProvinces();
        const prov = provinces.find(p => p.code === code);
        if (prov) name = prov.name;
        result = await fetchCaProvinceProduction(code, { start, end });
    } else {
        return NextResponse.json({
            status: 'error',
            data: null,
            error: { code: 'BAD_REQUEST', message: 'Invalid region kind' }
        }, { status: 400 });
    }

    // Transform to canonical API response
    const apiResult: ProductionSeriesResponse = {
        region: { kind, code, name },
        commodity: 'CRUDE_OIL',
        series: result.series,
        units: result.units,
        frequency: result.frequency,
        provenance: {
            ...result.provenance,
            cache_policy: '6 hours',
            request_fingerprint: `production-${kind}-${code}-${start}-${end}`
        }
    };

    const envelope: DataEnvelope<ProductionSeriesResponse> = {
        status: 'ok',
        data: apiResult,
        provenance: apiResult.provenance
    };

    return NextResponse.json(envelope);

  } catch (error: any) {
      console.error('Production API Error:', error);
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
