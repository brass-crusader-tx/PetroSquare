import { NextResponse } from 'next/server';
import { IntelConnector } from '../../../../lib/data-fabric/connectors';
import { createSuccessEnvelope, createErrorEnvelope } from '../../../../lib/errors';
import { createProvenance } from '../../../../lib/data-fabric/registry';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const data = await IntelConnector.getInfrastructure();
    const provenance = createProvenance('petrosquare-demo', 'Infrastructure Status Feed');
    return NextResponse.json(createSuccessEnvelope(data, provenance));
  } catch (error) {
    return NextResponse.json(createErrorEnvelope(error), { status: 500 });
  }
}
