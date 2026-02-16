import { NextRequest, NextResponse } from 'next/server';
import { PortfolioService } from '../../../../lib/portfolio/service';
import { generateInsight } from '../../../../lib/ai';
import { createSuccessEnvelope, createErrorEnvelope } from '../../../../lib/errors';
import { createProvenance } from '../../../../lib/data-fabric/registry';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const { query } = await req.json() as { query: string };

    // Gather Context
    const dashboard = await PortfolioService.getDashboardData();
    const assets = dashboard.assets;
    const strategy = dashboard.current_strategy;

    const context = `
    Current Portfolio Strategy: ${strategy?.name} (Status: ${strategy?.status})
    Total NPV: $${(strategy?.result.total_npv / 1e6).toFixed(1)}M
    Weighted IRR: ${strategy?.result.weighted_irr.toFixed(1)}%
    Volatility: ${(strategy?.result.portfolio_volatility * 100).toFixed(1)}%

    Top Assets by Allocation:
    ${strategy?.result.optimal_allocation.slice(0, 5).map(a =>
        `- ${assets.find(x => x.id === a.asset_id)?.name}: ${a.allocation_percentage.toFixed(1)}% ($${(a.allocation_amount/1e6).toFixed(1)}M)`
    ).join('\n')}

    Asset Details (Sample):
    ${assets.slice(0, 5).map(a =>
        `- ${a.name}: NPV $${(a.base_npv/1e6).toFixed(1)}M, IRR ${a.base_irr.toFixed(1)}%, Vol ${a.base_volatility.toFixed(2)}, Carbon ${a.base_carbon_intensity}`
    ).join('\n')}
    `;

    const answer = await generateInsight(query, context);

    const provenance = createProvenance('petrosquare-ai-assistant', 'Strategic portfolio insight');
    return NextResponse.json(createSuccessEnvelope({ answer }, provenance));
  } catch (error) {
    return NextResponse.json(createErrorEnvelope(error), { status: 500 });
  }
}
