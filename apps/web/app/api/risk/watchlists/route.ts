import { NextResponse } from 'next/server';
import { riskService } from '../../../../lib/risk/service';
import { createSuccessEnvelope, createErrorEnvelope } from '../../../../lib/errors';

export const dynamic = 'force-dynamic';

const ORG_ID = 'org-demo';

export async function GET() {
    const data = await riskService.getWatchlists(ORG_ID);
    return NextResponse.json(createSuccessEnvelope(data));
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const data = await riskService.createWatchlist(ORG_ID, body);
        return NextResponse.json(createSuccessEnvelope(data));
    } catch (e) {
        return NextResponse.json(createErrorEnvelope(e), { status: 400 });
    }
}
