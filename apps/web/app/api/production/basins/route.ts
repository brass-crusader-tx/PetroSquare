import { NextResponse } from 'next/server';
import { ProductionConnector } from '../../../../lib/data-fabric/connectors';
import { createSuccessEnvelope, createErrorEnvelope } from '../../../../lib/errors';
import { createProvenance } from '../../../../lib/data-fabric/registry';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const data = await ProductionConnector.getBasins();
    const provenance = createProvenance('petrosquare-demo', 'Top producing basins summary');
    return NextResponse.json(createSuccessEnvelope(data, provenance));
  } catch (error) {
    return NextResponse.json(createErrorEnvelope(error), { status: 500 });
  }
}
