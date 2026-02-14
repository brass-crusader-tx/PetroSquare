import { NextResponse } from 'next/server';
import { riskService } from '../../../../lib/risk/service';
import { createSuccessEnvelope, createErrorEnvelope } from '../../../../lib/errors';

export const dynamic = 'force-dynamic';

const ORG_ID = 'org-demo'; // MVP: Hardcoded org isolation for now

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const assetId = searchParams.get('asset_id') || undefined;
    const data = await riskService.getAssessments(ORG_ID, assetId);
    return NextResponse.json(createSuccessEnvelope(data));
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const data = await riskService.createAssessment(ORG_ID, body);
        return NextResponse.json(createSuccessEnvelope(data));
    } catch (e) {
        return NextResponse.json(createErrorEnvelope(e), { status: 400 });
    }
}
