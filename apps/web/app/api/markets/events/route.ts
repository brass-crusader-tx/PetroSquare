import { NextRequest, NextResponse } from 'next/server';
import { MarketDataService } from '../../../../lib/markets/data';
import { SignalsEngine, MockNewsEventProvider } from '../../../../lib/markets/signals';
import { AnalyticsResultEnvelope, ProvenanceRef } from '@petrosquare/types';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
    try {
        const stored = await MarketDataService.getEvents();
        const news = await MockNewsEventProvider.fetchLatestEvents();

        const allEvents = [...stored, ...news];
        const enriched = allEvents.map(e => SignalsEngine.assessImpact(e));

        const provenance: ProvenanceRef = {
            sourceSystem: 'PetroSquareSignals',
            sourceType: 'INTERNAL',
            ingestedAt: new Date().toISOString(),
            asOf: new Date().toISOString(),
            notes: 'Market Events + Impact Analysis'
        };

        const result: AnalyticsResultEnvelope<typeof enriched> = {
            id: crypto.randomUUID(),
            kind: 'SIGNAL',
            asOf: new Date().toISOString(),
            value: enriched,
            status: 'OK',
            provenance: [provenance]
        };

        return NextResponse.json(result);
    } catch (e) {
        return NextResponse.json({ status: 'error', message: String(e) }, { status: 500 });
    }
}
