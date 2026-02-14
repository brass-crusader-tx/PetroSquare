import { NextRequest, NextResponse } from 'next/server';
import { db } from '../../../../../lib/production/db';
import { createSuccessEnvelope, createErrorEnvelope } from '../../../../../lib/errors';
import { Provenance } from '@petrosquare/types';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const assetId = params.id;
    // Mock asset details (since we focus on production here)
    // In real app, fetch from Asset Service
    const asset = {
        id: assetId,
        name: `Well ${assetId.split('-')[1] || assetId}`,
        type: 'WELL',
        status: 'ACTIVE',
        basin: 'Permian',
        operator: 'Pioneer'
    };

    // Fetch production series
    const oil = await db.getSeries(assetId, 'OIL_RATE');
    const gas = await db.getSeries(assetId, 'GAS_RATE');
    const water = await db.getSeries(assetId, 'WATER_RATE');

    const provenance: Provenance = {
        source_name: 'Production DB',
        source_url: `/api/production/assets/${assetId}`,
        retrieved_at: new Date().toISOString(),
        notes: 'Aggregated from internal historian'
    };

    return NextResponse.json(createSuccessEnvelope({
        asset,
        production: {
            oil,
            gas,
            water
        }
    }, provenance));
  } catch (error) {
    return NextResponse.json(createErrorEnvelope(error), { status: 500 });
  }
}
