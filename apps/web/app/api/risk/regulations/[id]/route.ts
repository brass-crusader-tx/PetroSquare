import { NextResponse } from 'next/server';
import { riskService } from '../../../../../lib/risk/service';
import { createSuccessEnvelope, createErrorEnvelope } from '../../../../../lib/errors';

export const dynamic = 'force-dynamic';

const ORG_ID = 'org-demo';

export async function GET(request: Request, { params }: { params: { id: string } }) {
    const data = await riskService.getRegulation(ORG_ID, params.id);
    if (!data) return NextResponse.json(createErrorEnvelope(new Error('Not found')), { status: 404 });
    return NextResponse.json(createSuccessEnvelope(data));
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
    try {
        const body = await request.json();
        const data = await riskService.updateRegulation(ORG_ID, params.id, body);
        return NextResponse.json(createSuccessEnvelope(data));
    } catch (e) {
        return NextResponse.json(createErrorEnvelope(e), { status: 400 });
    }
}
