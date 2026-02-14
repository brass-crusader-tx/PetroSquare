import { NextRequest, NextResponse } from 'next/server';
import { MarketDataService } from '../../../../lib/markets/data';
import { ProvenanceRef } from '@petrosquare/types';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
    const query = request.nextUrl.searchParams.get('query') || undefined;
    const instruments = await MarketDataService.getInstruments(query);

    const provenance: ProvenanceRef = {
        sourceSystem: 'MockProvider',
        sourceType: 'INTERNAL',
        ingestedAt: new Date().toISOString(),
        asOf: new Date().toISOString(),
        notes: 'Simulated instrument list'
    };

    return NextResponse.json({
        data: instruments,
        status: 'ok',
        asOf: new Date().toISOString(),
        provenance: [provenance]
    });
}
