import { NextRequest, NextResponse } from 'next/server';
import { MarketDataService } from '../../../../../lib/markets/data';
import { ProvenanceRef } from '@petrosquare/types';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest, { params }: { params: { physicalPositionId: string } }) {
    const { physicalPositionId } = params;
    const hedges = await MarketDataService.getHedges(physicalPositionId);

    const provenance: ProvenanceRef = {
        sourceSystem: 'PetroSquareTRM',
        sourceType: 'INTERNAL',
        ingestedAt: new Date().toISOString(),
        asOf: new Date().toISOString(),
        notes: 'Hedge Links'
    };

    return NextResponse.json({
        data: hedges,
        status: 'ok',
        provenance: [provenance]
    });
}
