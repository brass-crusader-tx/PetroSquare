import { NextRequest, NextResponse } from 'next/server';
import { EsgEngine } from '../../../../lib/markets/analytics';
import { AnalyticsResultEnvelope, ProvenanceRef } from '@petrosquare/types';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { positions } = body;

        if (!Array.isArray(positions)) {
             return NextResponse.json({ status: 'error', message: 'positions must be array' }, { status: 400 });
        }

        // Mock lookup of factors (in real app, query DB based on position attrs)
        const crudeFactor = { factor: 20, unit: 'kgCO2e/bbl' } as any;

        let totalEmissions = 0;

        for (const pos of positions) {
             // Simply apply factor
             totalEmissions += EsgEngine.estimateEmissions(pos, crudeFactor);
        }

        const provenance: ProvenanceRef = {
            sourceSystem: 'PetroSquareESG',
            sourceType: 'INTERNAL',
            ingestedAt: new Date().toISOString(),
            asOf: new Date().toISOString(),
            notes: 'ESG Estimation'
        };

        const envelope: AnalyticsResultEnvelope<number> = {
            id: crypto.randomUUID(),
            kind: 'ESG',
            asOf: new Date().toISOString(),
            value: totalEmissions,
            status: 'OK',
            provenance: [provenance]
        };

        return NextResponse.json(envelope);

    } catch (e) {
        return NextResponse.json({ status: 'error', message: String(e) }, { status: 500 });
    }
}
