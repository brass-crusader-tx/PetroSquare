import { NextRequest, NextResponse } from 'next/server';
import { db } from '../../../../lib/production/db';
import { ScenarioService } from '../../../../lib/production/analytics/scenarios';
import { createSuccessEnvelope, createErrorEnvelope } from '../../../../lib/errors';
import { Provenance } from '@petrosquare/types';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const assetId = request.nextUrl.searchParams.get('asset_id');
    if (!assetId) {
      throw new Error("Missing asset_id parameter");
    }

    const scenarios = await db.getScenarios(assetId);

    // Also fetch base scenario which is usually auto-generated or marked
    // Here we just return what's in DB.

    return NextResponse.json(createSuccessEnvelope(scenarios));
  } catch (error) {
    return NextResponse.json(createErrorEnvelope(error), { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { asset_id, name, base_id } = body;

    if (!asset_id || !name) {
        throw new Error("Missing required fields: asset_id, name");
    }

    const scenario = await ScenarioService.create(asset_id, name, base_id);

    return NextResponse.json(createSuccessEnvelope(scenario));
  } catch (error) {
      return NextResponse.json(createErrorEnvelope(error), { status: 500 });
  }
}
