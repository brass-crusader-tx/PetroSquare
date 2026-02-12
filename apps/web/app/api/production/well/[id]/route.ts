import { NextRequest, NextResponse } from 'next/server';
import { ProductionConnector } from '../../../../../lib/data-fabric/connectors';
import { createSuccessEnvelope, createErrorEnvelope } from '../../../../../lib/errors';
import { createProvenance } from '../../../../../lib/data-fabric/registry';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const data = await ProductionConnector.getWell(params.id);
    const provenance = createProvenance('petrosquare-demo', `Well ${params.id} master data`);
    return NextResponse.json(createSuccessEnvelope(data, provenance));
  } catch (error) {
    return NextResponse.json(createErrorEnvelope(error), { status: 500 });
  }
}
