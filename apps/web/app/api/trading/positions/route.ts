import { NextRequest, NextResponse } from 'next/server';
import { MarketDataService } from '../../../../lib/markets/data';
import { ProvenanceRef, Position } from '@petrosquare/types';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
    // In real app filter by book/strategy
    const positions = await MarketDataService.getPositions();

    const provenance: ProvenanceRef = {
        sourceSystem: 'PetroSquareTRM',
        sourceType: 'INTERNAL',
        ingestedAt: new Date().toISOString(),
        asOf: new Date().toISOString(),
        notes: 'Position Snapshot'
    };

    return NextResponse.json({
        data: positions,
        status: 'ok',
        provenance: [provenance]
    });
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const position = body as Position;
        const created = await MarketDataService.createPosition(position);
        return NextResponse.json({
            data: created,
            status: 'ok',
            provenance: []
        });
    } catch (e) {
        return NextResponse.json({ status: 'error', message: String(e) }, { status: 500 });
    }
}
