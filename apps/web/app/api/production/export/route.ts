import { NextRequest, NextResponse } from 'next/server';
import { db } from '../../../../lib/production/db';
import { createSuccessEnvelope, createErrorEnvelope } from '../../../../lib/errors';
import { Provenance } from '@petrosquare/types';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const assetId = request.nextUrl.searchParams.get('asset_id');
    const type = request.nextUrl.searchParams.get('type');

    if (!assetId || !type) {
      throw new Error("Missing asset_id or type");
    }

    const headers = new Headers();
    let data: any;
    let filename = `${assetId}-${type}.json`;

    if (type === 'history') {
        // Export CSV
        const oil = await db.getSeries(assetId, 'OIL_RATE');
        const gas = await db.getSeries(assetId, 'GAS_RATE');
        const water = await db.getSeries(assetId, 'WATER_RATE');

        // Merge by timestamp
        const map = new Map<string, any>();
        [...oil, ...gas, ...water].forEach(p => {
            if (!map.has(p.timestamp)) map.set(p.timestamp, { date: p.timestamp });
            const record = map.get(p.timestamp);
            if (p.measurement === 'OIL_RATE') record.oil = p.value;
            if (p.measurement === 'GAS_RATE') record.gas = p.value;
            if (p.measurement === 'WATER_RATE') record.water = p.value;
        });

        const rows = Array.from(map.values()).sort((a, b) => a.date.localeCompare(b.date));
        const csv = [
            'Date,Oil (bbl/d),Gas (mcf/d),Water (bbl/d)',
            ...rows.map(r => `${r.date},${r.oil || ''},${r.gas || ''},${r.water || ''}`)
        ].join('\n');

        headers.set('Content-Type', 'text/csv');
        headers.set('Content-Disposition', `attachment; filename="${assetId}-history.csv"`);
        return new NextResponse(csv, { headers });
    }

    if (type === 'reserves') {
        // Mock Reserves Report
        data = {
            asset_id: assetId,
            report_date: new Date().toISOString(),
            standard: 'PRMS',
            reserves: {
                p1: { oil: 1200000, gas: 5000000 },
                p2: { oil: 2500000, gas: 8000000 },
                p3: { oil: 4000000, gas: 12000000 }
            },
            provenance: {
                source: 'Production DB',
                generated_by: 'PetroSquare Reserves Engine'
            }
        };
    }

    if (type === 'forecast') {
        const scenarios = await db.getScenarios(assetId);
        const models = await db.getDcaModels(assetId);
        data = {
            asset_id: assetId,
            generated_at: new Date().toISOString(),
            base_model: models[0],
            scenarios: scenarios
        };
    }

    if (!data) throw new Error("Invalid export type");

    headers.set('Content-Type', 'application/json');
    headers.set('Content-Disposition', `attachment; filename="${filename}"`);
    return new NextResponse(JSON.stringify(data, null, 2), { headers });

  } catch (error) {
    return NextResponse.json(createErrorEnvelope(error), { status: 500 });
  }
}
