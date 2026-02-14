import { NextRequest, NextResponse } from 'next/server';
import { RiskEngine } from '../../../../../lib/markets/analytics';
import { MarketDataService } from '../../../../../lib/markets/data';
import { AnalyticsResultEnvelope, ProvenanceRef } from '@petrosquare/types';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { positions, shocks } = body;

        if (!Array.isArray(positions) || !shocks) {
             return NextResponse.json({ status: 'error', message: 'Invalid inputs' }, { status: 400 });
        }

        let totalValueBefore = 0;
        let totalValueAfter = 0;

        for (const pos of positions) {
             const { instrumentId, qty } = pos;
             const latest = await MarketDataService.getLatestPrice(instrumentId);
             if (!latest) continue;

             const price = latest.price;
             const value = qty * price;
             totalValueBefore += value;

             const shock = shocks[instrumentId] || 0;
             const valueAfter = RiskEngine.runStressTest(value, shock);
             totalValueAfter += valueAfter;
        }

        const pnl = totalValueAfter - totalValueBefore;

        const provenance: ProvenanceRef = {
            sourceSystem: 'PetroSquareRisk',
            sourceType: 'INTERNAL',
            ingestedAt: new Date().toISOString(),
            asOf: new Date().toISOString(),
            notes: 'Stress Test Scenarios'
        };

        const envelope: AnalyticsResultEnvelope<{ pnl: number, valueBefore: number, valueAfter: number }> = {
            id: crypto.randomUUID(),
            kind: 'STRESS',
            asOf: new Date().toISOString(),
            value: { pnl, valueBefore: totalValueBefore, valueAfter: totalValueAfter },
            status: 'OK',
            provenance: [provenance]
        };

        return NextResponse.json(envelope);

    } catch (e) {
        return NextResponse.json({ status: 'error', message: String(e) }, { status: 500 });
    }
}
