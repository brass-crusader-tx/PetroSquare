import { NextRequest, NextResponse } from 'next/server';
import { MarketDataService } from '../../../../../lib/markets/data';
import { ProvenanceRef, HedgeLink } from '@petrosquare/types';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const link = body as HedgeLink;
        const created = await MarketDataService.linkHedge(link);
        return NextResponse.json({
            data: created,
            status: 'ok',
            provenance: []
        });
    } catch (e) {
        return NextResponse.json({ status: 'error', message: String(e) }, { status: 500 });
    }
}
