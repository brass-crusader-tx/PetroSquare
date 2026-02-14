import { NextResponse } from 'next/server';
import { riskService } from '../../../../lib/risk/service';
import { createSuccessEnvelope } from '../../../../lib/errors';

export const dynamic = 'force-dynamic';

export async function GET() {
    const data = await riskService.getJurisdictions();
    return NextResponse.json(createSuccessEnvelope(data));
}
