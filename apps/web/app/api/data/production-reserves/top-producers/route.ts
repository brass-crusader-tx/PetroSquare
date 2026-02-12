import { NextRequest, NextResponse } from 'next/server';
import {
    listUsStates,
    listCaProvinces,
    fetchUsStateProductionLatest,
    fetchCaProvinceProductionLatest
} from '@petrosquare/connectors';
import { DataEnvelope, TopProducersResponse, RegionKind, TopProducerRow } from '@petrosquare/types';

export const revalidate = 43200; // 12 hours

async function fetchWithConcurrency<T, R>(
    items: T[],
    fn: (item: T) => Promise<R>,
    concurrency: number
): Promise<R[]> {
    const results: R[] = [];
    const queue = [...items];

    async function worker() {
        while (queue.length > 0) {
            const item = queue.shift();
            if (item) {
                try {
                    const res = await fn(item);
                    results.push(res);
                } catch (e) {
                    console.error('Worker error', e);
                }
            }
        }
    }

    const workers = Array(concurrency).fill(null).map(() => worker());
    await Promise.all(workers);
    return results;
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const kind = searchParams.get('kind') as RegionKind;
  const limit = parseInt(searchParams.get('limit') || '10', 10);

  if (!kind) {
    return NextResponse.json({
        status: 'error',
        data: null,
        error: { code: 'BAD_REQUEST', message: 'Missing kind' }
    }, { status: 400 });
  }

  try {
      let rows: TopProducerRow[] = [];

      // Default provenance info
      const provInfo = {
          source_name: kind === 'US_STATE' ? 'EIA' : 'CER',
          source_url: 'N/A',
          retrieved_at: new Date().toISOString()
      };

      if (kind === 'US_STATE') {
          const states = listUsStates();
          // Concurrency limited fetch
          const results = await fetchWithConcurrency(states, async (state) => {
              const data = await fetchUsStateProductionLatest(state.code);
              if (!data) return null;
              return {
                  region: { kind: 'US_STATE' as const, code: state.code, name: state.name },
                  latest_period: data.period,
                  latest_value: data.value,
                  units: data.units
              };
          }, 5);

          rows = results.filter(r => r !== null) as TopProducerRow[];
      } else if (kind === 'CA_PROVINCE') {
          const provinces = listCaProvinces();
           const results = await fetchWithConcurrency(provinces, async (prov) => {
              const data = await fetchCaProvinceProductionLatest(prov.code);
              if (!data) return null;
              return {
                  region: { kind: 'CA_PROVINCE' as const, code: prov.code, name: prov.name },
                  latest_period: data.period,
                  latest_value: data.value,
                  units: data.units
              };
          }, 5);
          rows = results.filter(r => r !== null) as TopProducerRow[];
      }

      if (rows.length === 0) {
          throw new Error("No data returned from upstream");
      }

      // Determine "latest_period" using heuristics (latest with > 20% coverage)
      const uniquePeriods = Array.from(new Set(rows.map(r => r.latest_period))).sort().reverse();
      let selectedPeriod = uniquePeriods[0];

      for (const p of uniquePeriods) {
          const count = rows.filter(r => r.latest_period === p).length;
          const total = rows.length;
          if (count > total * 0.2) { // 20% threshold
              selectedPeriod = p;
              break;
          }
      }

      // Filter rows to selected period
      const filteredRows = rows.filter(r => r.latest_period === selectedPeriod);
      filteredRows.sort((a, b) => b.latest_value - a.latest_value);

      // Assign rank
      filteredRows.forEach((r, i) => r.rank = i + 1);

      const topN = filteredRows.slice(0, limit);

      const response: TopProducersResponse = {
          kind,
          commodity: 'CRUDE_OIL',
          latest_period: selectedPeriod,
          units: topN[0]?.units || 'MBBL/d',
          rows: topN,
          provenance: {
              ...provInfo,
              notes: `Ranking based on production in ${selectedPeriod}.`
          }
      };

      return NextResponse.json({
          status: 'ok',
          data: response,
          provenance: response.provenance
      } as DataEnvelope<TopProducersResponse>);

  } catch (error: any) {
      console.error('Top Producers API Error:', error);
      // Return degraded
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
