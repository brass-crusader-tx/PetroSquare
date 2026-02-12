import { NextRequest, NextResponse } from 'next/server';
import { ProductionConnector } from '../../../../lib/data-fabric/connectors';
import { createSuccessEnvelope, createErrorEnvelope } from '../../../../lib/errors';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const country = request.nextUrl.searchParams.get('country') || 'US';
    if (country !== 'US' && country !== 'CA') {
      throw new Error("Invalid country. Must be 'US' or 'CA'.");
    }

    const data = await ProductionConnector.getRegions(country);
    // Provenance is already inside the response data from connector
    return NextResponse.json(createSuccessEnvelope(data));
  } catch (error) {
    return NextResponse.json(createErrorEnvelope(error), { status: 500 });
  }
}
