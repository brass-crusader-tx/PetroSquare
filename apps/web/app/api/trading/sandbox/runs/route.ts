import { NextRequest, NextResponse } from 'next/server';
import { MarketDataService } from '../../../../../lib/markets/data';
import { ScenarioRun, ProvenanceRef } from '@petrosquare/types';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        const run: ScenarioRun = {
            id: crypto.randomUUID(),
            userId: 'user-1', // Mock user
            createdAt: new Date().toISOString(),
            mode: 'SANDBOX',
            inputs: body,
            inputsHash: 'hash-' + Date.now(),
            status: 'QUEUED'
        };

        const created = await MarketDataService.createScenarioRun(run);

        return NextResponse.json({
            data: created,
            status: 'ok',
            provenance: []
        });

    } catch (e) {
        return NextResponse.json({ status: 'error', message: String(e) }, { status: 500 });
    }
}

export async function GET(request: NextRequest) {
    const runs = await MarketDataService.listScenarioRuns();
    return NextResponse.json({
        data: runs,
        status: 'ok',
        provenance: []
    });
}
