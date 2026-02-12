import { NextResponse } from 'next/server';
import { listUsStates, listCaProvinces } from '@petrosquare/connectors';
import { DataEnvelope, RegionRef } from '@petrosquare/types';

export const revalidate = 604800; // 7 days

export async function GET() {
  const usStates = listUsStates().map(s => ({
    kind: 'US_STATE' as const,
    code: s.code,
    name: s.name
  }));

  const caProvinces = listCaProvinces().map(p => ({
    kind: 'CA_PROVINCE' as const,
    code: p.code,
    name: p.name
  }));

  const data: RegionRef[] = [...usStates, ...caProvinces];

  const envelope: DataEnvelope<RegionRef[]> = {
    status: 'ok',
    data,
    provenance: {
        source_name: 'EIA, CER',
        source_url: 'N/A',
        retrieved_at: new Date().toISOString(),
        cache_policy: '7 days',
        request_fingerprint: 'regions_list'
    }
  };

  return NextResponse.json(envelope);
}
