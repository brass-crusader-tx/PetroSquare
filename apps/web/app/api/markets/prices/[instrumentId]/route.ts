import { NextRequest, NextResponse } from 'next/server';
import { MarketDataService } from '../../../../../lib/markets/data';
import { ProvenanceRef } from '@petrosquare/types';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest, { params }: { params: { instrumentId: string } }) {
    const { instrumentId } = params;
    const start = request.nextUrl.searchParams.get('start');
    const end = request.nextUrl.searchParams.get('end');
    const granularity = request.nextUrl.searchParams.get('granularity') as any;

    const prices = await MarketDataService.getPriceSeries(instrumentId);

    const provenance: ProvenanceRef = {
        sourceSystem: 'MockProvider',
        sourceType: 'INTERNAL',
        ingestedAt: new Date().toISOString(),
        asOf: new Date().toISOString(),
        notes: 'Simulated price series'
    };

    return NextResponse.json({
        data: {
            instrumentId,
            granularity: granularity || '1D',
            points: prices
        },
        status: 'ok',
        asOf: new Date().toISOString(),
        provenance: [provenance]
    });
}
