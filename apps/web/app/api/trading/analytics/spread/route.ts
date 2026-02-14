import { NextRequest, NextResponse } from 'next/server';
import { MarketDataService } from '../../../../../lib/markets/data';
import { SpreadsEngine } from '../../../../../lib/markets/analytics';
import { AnalyticsResultEnvelope, ProvenanceRef } from '@petrosquare/types';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { instrumentA, instrumentB, multiplierA = 1, multiplierB = 1 } = body;

        if (!instrumentA || !instrumentB) {
            return NextResponse.json({ status: 'error', message: 'Missing instrument IDs' }, { status: 400 });
        }

        const seriesA = await MarketDataService.getPriceSeries(instrumentA);
        const seriesB = await MarketDataService.getPriceSeries(instrumentB);

        if (!seriesA.length || !seriesB.length) {
            return NextResponse.json({ status: 'error', message: 'Missing price data for instruments' }, { status: 404 });
        }

        const spread = SpreadsEngine.computeSpread(seriesA, seriesB, multiplierA, multiplierB);

        const provenance: ProvenanceRef = {
            sourceSystem: 'PetroSquareAnalytics',
            sourceType: 'INTERNAL',
            ingestedAt: new Date().toISOString(),
            asOf: new Date().toISOString(),
            notes: `Computed spread ${instrumentA} * ${multiplierA} - ${instrumentB} * ${multiplierB}`
        };

        const result: AnalyticsResultEnvelope<typeof spread> = {
            id: crypto.randomUUID(),
            kind: 'SPREAD',
            asOf: new Date().toISOString(),
            value: spread,
            status: 'OK',
            provenance: [provenance]
        };

        return NextResponse.json(result);
    } catch (e) {
        return NextResponse.json({ status: 'error', message: String(e) }, { status: 500 });
    }
}
