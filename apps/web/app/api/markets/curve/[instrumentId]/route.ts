import { NextRequest, NextResponse } from 'next/server';
import { MarketDataService } from '../../../../../lib/markets/data';
import { ProvenanceRef } from '@petrosquare/types';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest, { params }: { params: { instrumentId: string } }) {
    const { instrumentId } = params;

    try {
        const curve = await MarketDataService.getForwardCurve(instrumentId);

        if (!curve) {
             return NextResponse.json({
                status: 'error',
                message: 'Instrument not found or no curve data',
            }, { status: 404 });
        }

        const provenance: ProvenanceRef = {
            sourceSystem: 'MockProvider',
            sourceType: 'INTERNAL',
            ingestedAt: new Date().toISOString(),
            asOf: curve.asOf,
            notes: 'Forward curve snapshot'
        };

        return NextResponse.json({
            data: curve,
            status: 'ok',
            asOf: new Date().toISOString(),
            provenance: [provenance]
        });
    } catch (e) {
        return NextResponse.json({ status: 'error', message: String(e) }, { status: 500 });
    }
}
