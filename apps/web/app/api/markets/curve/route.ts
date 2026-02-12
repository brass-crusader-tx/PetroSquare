import { NextRequest, NextResponse } from 'next/server';
import { MarketsConnector } from '../../../../lib/data-fabric/connectors';
import { createSuccessEnvelope, createErrorEnvelope } from '../../../../lib/errors';
import { createProvenance } from '../../../../lib/data-fabric/registry';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const symbol = request.nextUrl.searchParams.get('symbol') || 'CL=F';
    const data = await MarketsConnector.getFuturesCurve(symbol);
    const provenance = createProvenance('petrosquare-demo', `Futures curve for ${symbol}`);
    return NextResponse.json(createSuccessEnvelope(data, provenance));
  } catch (error) {
    return NextResponse.json(createErrorEnvelope(error), { status: 500 });
  }
}
