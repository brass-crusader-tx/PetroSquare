import { NextResponse } from 'next/server';
import { IntelConnector } from '../../../../lib/data-fabric/connectors';
import { createSuccessEnvelope, createErrorEnvelope } from '../../../../lib/errors';
import { createProvenance } from '../../../../lib/data-fabric/registry';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const data = await IntelConnector.getDeals();
    const provenance = createProvenance('petrosquare-demo', 'Market Deals Intelligence');
    return NextResponse.json(createSuccessEnvelope(data, provenance));
  } catch (error) {
    return NextResponse.json(createErrorEnvelope(error), { status: 500 });
  }
}
