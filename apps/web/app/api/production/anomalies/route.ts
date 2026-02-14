import { NextRequest, NextResponse } from 'next/server';
import { db } from '../../../../lib/production/db';
import { createSuccessEnvelope, createErrorEnvelope } from '../../../../lib/errors';
import { AnomalyService } from '../../../../lib/production/analytics/anomalies';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const assetId = request.nextUrl.searchParams.get('asset_id');
    if (!assetId) {
        return NextResponse.json(createErrorEnvelope('Missing asset_id'), { status: 400 });
    }

    let anomalies = await db.getAnomalies(assetId);

    // If no anomalies, try to detect them on the fly (for demo purposes)
    if (anomalies.length === 0) {
        const series = await db.getSeries(assetId, 'OIL_RATE');
        const detected = AnomalyService.detect(series);
        for (const a of detected) {
            await db.createAnomaly(a);
        }
        anomalies = detected;
    }

    return NextResponse.json(createSuccessEnvelope(anomalies));
  } catch (error) {
    return NextResponse.json(createErrorEnvelope(error), { status: 500 });
  }
}
