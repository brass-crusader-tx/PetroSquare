import { NextRequest, NextResponse } from 'next/server';
import { EconomicsConnector } from '../../../../lib/data-fabric/connectors';
import { createSuccessEnvelope, createErrorEnvelope } from '../../../../lib/errors';
import { createProvenance } from '../../../../lib/data-fabric/registry';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const scenarioId = request.nextUrl.searchParams.get('scenarioId');
    if (!scenarioId) {
      throw new Error('scenarioId parameter is required');
    }
    const data = await EconomicsConnector.runScenario(scenarioId);
    const provenance = createProvenance('petrosquare-demo', `Economics run for scenario ${scenarioId}`);
    return NextResponse.json(createSuccessEnvelope(data, provenance));
  } catch (error) {
    return NextResponse.json(createErrorEnvelope(error), { status: 500 });
  }
}
