import { NextRequest, NextResponse } from 'next/server';
import { db } from '../../../../../lib/production/db';
import { AnomalyService } from '../../../../../lib/production/analytics/anomalies';
import { generateInsight, isAIEnabled } from '../../../../../lib/ai';
import { createSuccessEnvelope, createErrorEnvelope } from '../../../../../lib/errors';
import { Provenance } from '@petrosquare/types';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { asset_id, prompt } = body;

    if (!asset_id || !prompt) {
      throw new Error("Missing asset_id or prompt");
    }

    // 1. Fetch Context Data
    const series = await db.getSeries(asset_id, 'OIL_RATE');
    const anomalies = await db.getAnomalies(asset_id);
    const models = await db.getDcaModels(asset_id);
    const scenarios = await db.getScenarios(asset_id);

    // 2. Summarize Data for LLM
    const lastPoint = series[series.length - 1];
    const avg30 = series.slice(-30).reduce((a, b) => a + b.value, 0) / Math.min(30, series.length);

    // Recent anomalies
    const recentAnomalies = anomalies.filter(a =>
        new Date(a.timestamp) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    ).map(a => `- ${a.timestamp}: ${a.type} (${a.severity}) - ${a.explanation}`).join('\n');

    // Forecast summary
    const activeModel = models.find(m => m.type === 'EXPONENTIAL' || m.type === 'HYPERBOLIC');
    const forecastSummary = activeModel ?
        `DCA Model (${activeModel.type}): Qi=${activeModel.params.qi.toFixed(0)}, Di=${(activeModel.params.di * 365).toFixed(1)}%/yr` :
        "No DCA model fit.";

    const context = `
    Asset ID: ${asset_id}
    Current Production (Oil): ${lastPoint ? lastPoint.value.toFixed(0) : 'N/A'} bbl/d
    30-Day Avg: ${avg30.toFixed(0)} bbl/d

    Recent Anomalies (last 30 days):
    ${recentAnomalies || "None"}

    Forecast:
    ${forecastSummary}

    Scenarios:
    ${scenarios.map(s => `- ${s.name}: ${JSON.stringify(s.modifications)}`).join('\n') || "None"}
    `;

    // 3. Generate Insight
    let answer = "";
    if (isAIEnabled) {
        answer = await generateInsight(prompt, context);
    } else {
        answer = "AI Insights are disabled (API Key missing). However, based on the data: Production is " + (lastPoint?.value < avg30 ? "declining" : "stable") + ".";
    }

    // 4. Return
    return NextResponse.json(createSuccessEnvelope({
        text: answer,
        context_used: {
            stats: { current: lastPoint?.value, avg30 },
            anomalies_count: recentAnomalies.length,
            forecast_model: activeModel?.type
        }
    }));

  } catch (error) {
    return NextResponse.json(createErrorEnvelope(error), { status: 500 });
  }
}
