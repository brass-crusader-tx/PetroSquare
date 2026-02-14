import { NextResponse } from 'next/server';
import { riskService } from '../../../../../../lib/risk/service';
import { createSuccessEnvelope } from '../../../../../../lib/errors';

export const dynamic = 'force-dynamic';

const ORG_ID = 'org-demo';

export async function GET(request: Request, { params }: { params: { id: string } }) {
    const data = await riskService.getRegulationVersions(ORG_ID, params.id);
    return NextResponse.json(createSuccessEnvelope(data));
}
