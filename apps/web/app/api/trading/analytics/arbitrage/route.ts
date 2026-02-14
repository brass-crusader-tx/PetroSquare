import { NextRequest, NextResponse } from 'next/server';
import { MarketDataService } from '../../../../../lib/markets/data';
import { SpreadsEngine } from '../../../../../lib/markets/analytics';
import { AnalyticsResultEnvelope, ProvenanceRef } from '@petrosquare/types';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
    try {
        const instrumentId = request.nextUrl.searchParams.get('instrumentId');
        const threshold = parseFloat(request.nextUrl.searchParams.get('threshold') || '2.0');
        const windowDays = parseInt(request.nextUrl.searchParams.get('window') || '30');

        if (!instrumentId) {
             return NextResponse.json({ status: 'error', message: 'Missing instrumentId' }, { status: 400 });
        }

        const series = await MarketDataService.getPriceSeries(instrumentId);
        if (series.length < windowDays) {
             return NextResponse.json({ status: 'error', message: 'Insufficient data' }, { status: 400 });
        }

        // Take last windowDays points
        const window = series.slice(-windowDays);
        const values = window.map(p => p.price);

        // Current point is the last one
        const current = values[values.length - 1];
        const history = values.slice(0, values.length - 1);

        // Compute mean and std of history
        const mean = history.reduce((a, b) => a + b, 0) / history.length;
        const variance = history.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / history.length;
        const std = Math.sqrt(variance);

        const isArb = SpreadsEngine.detectArbitrage(current, mean, std, threshold);

        const provenance: ProvenanceRef = {
            sourceSystem: 'PetroSquareAnalytics',
            sourceType: 'INTERNAL',
            ingestedAt: new Date().toISOString(),
            asOf: new Date().toISOString(),
            notes: `Arbitrage detection (z-score > ${threshold})`
        };

        const result: AnalyticsResultEnvelope<{ isArbitrage: boolean, zScore: number, current: number, mean: number }> = {
            id: crypto.randomUUID(),
            kind: 'ARBITRAGE',
            asOf: new Date().toISOString(),
            value: {
                isArbitrage: isArb,
                zScore: (current - mean) / std,
                current,
                mean
            },
            status: 'OK',
            provenance: [provenance]
        };

        return NextResponse.json(result);

    } catch (e) {
        return NextResponse.json({ status: 'error', message: String(e) }, { status: 500 });
    }
}
