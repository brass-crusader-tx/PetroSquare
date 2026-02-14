import { NextRequest, NextResponse } from 'next/server';
import { db } from '../../../../lib/production/db';
import { ExponentialDca, HyperbolicDca } from '../../../../lib/production/analytics/dca';
import { createSuccessEnvelope, createErrorEnvelope } from '../../../../lib/errors';
import { Provenance, TimeSeriesPoint } from '@petrosquare/types';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const assetId = request.nextUrl.searchParams.get('asset_id');
    if (!assetId) {
      throw new Error("Missing asset_id parameter");
    }

    const models = await db.getDcaModels(assetId);

    // If no model exists, fit one on the fly (for demo)
    if (models.length === 0) {
        const series = await db.getSeries(assetId, 'OIL_RATE');
        if (series.length > 2) {
            const fit = new ExponentialDca().fit(series.map(s => ({
                period: s.timestamp.slice(0, 7),
                value: s.value
            })));
            fit.asset_id = assetId;
            await db.saveDcaModel(fit);
            models.push(fit);
        }
    }

    return NextResponse.json(createSuccessEnvelope(models));
  } catch (error) {
    return NextResponse.json(createErrorEnvelope(error), { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { asset_id, type, horizon_months } = body;

    if (!asset_id) throw new Error("Missing asset_id");

    const series = await db.getSeries(asset_id, 'OIL_RATE'); // default oil
    if (series.length < 2) throw new Error("Insufficient data for DCA fit");

    // Convert to TimeSeriesPoint
    const points: TimeSeriesPoint[] = series.map(s => ({
        period: s.timestamp.slice(0, 7), // YYYY-MM
        value: s.value
    }));

    let model;
    let strategy;
    if (type === 'HYPERBOLIC') {
        strategy = new HyperbolicDca();
    } else {
        strategy = new ExponentialDca();
    }

    model = strategy.fit(points);
    model.asset_id = asset_id;

    await db.saveDcaModel(model);

    const forecast = strategy.forecast(model, new Date(), horizon_months || 24);

    return NextResponse.json(createSuccessEnvelope({
        model,
        forecast
    }));
  } catch (error) {
      return NextResponse.json(createErrorEnvelope(error), { status: 500 });
  }
}
