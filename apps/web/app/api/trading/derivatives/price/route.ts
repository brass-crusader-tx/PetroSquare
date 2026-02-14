import { NextRequest, NextResponse } from 'next/server';
import { DerivativesEngine, OptionParams } from '../../../../../lib/markets/analytics';
import { AnalyticsResultEnvelope, ProvenanceRef } from '@petrosquare/types';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { S, K, T, r, sigma, type, q } = body as OptionParams;

        if (S === undefined || K === undefined || T === undefined || r === undefined || sigma === undefined || !type) {
            return NextResponse.json({ status: 'error', message: 'Missing parameters' }, { status: 400 });
        }

        const result = DerivativesEngine.priceOption({ S, K, T, r, sigma, type, q });

        const provenance: ProvenanceRef = {
            sourceSystem: 'PetroSquareAnalytics',
            sourceType: 'INTERNAL',
            ingestedAt: new Date().toISOString(),
            asOf: new Date().toISOString(),
            notes: 'Black-Scholes Pricing'
        };

        const envelope: AnalyticsResultEnvelope<typeof result> = {
            id: crypto.randomUUID(),
            kind: 'PRICING',
            asOf: new Date().toISOString(),
            value: result,
            status: 'OK',
            provenance: [provenance]
        };

        return NextResponse.json(envelope);
    } catch (e) {
        return NextResponse.json({ status: 'error', message: String(e) }, { status: 500 });
    }
}
