import { NextResponse } from 'next/server';
import { riskService } from '../../../../lib/risk/service';
import { createSuccessEnvelope } from '../../../../lib/errors';

export const dynamic = 'force-dynamic';

const ORG_ID = 'org-demo';

export async function GET() {
    const data = await riskService.getObligations(ORG_ID);
    return NextResponse.json(createSuccessEnvelope(data));
}
