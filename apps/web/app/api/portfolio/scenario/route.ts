import { NextRequest, NextResponse } from 'next/server';
import { PortfolioService } from '../../../../lib/portfolio/service';
import { calculateMetrics } from '../../../../lib/portfolio/engine';
import { createSuccessEnvelope, createErrorEnvelope } from '../../../../lib/errors';
import { createProvenance } from '../../../../lib/data-fabric/registry';
import { PortfolioScenarioInput, PortfolioAsset } from '@petrosquare/types';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const { scenario } = await req.json() as { scenario: PortfolioScenarioInput };

    const dashboard = await PortfolioService.getDashboardData();
    const assets = dashboard.assets;
    const strategy = dashboard.current_strategy;

    if (!strategy) {
         throw new Error("No base strategy found to apply scenario on.");
    }

    // Map strategy allocation to weights array aligned with assets
    const weights = assets.map(a => {
        const alloc = strategy.result.optimal_allocation.find(x => x.asset_id === a.id);
        return alloc ? alloc.allocation_percentage / 100 : 0;
    });

    // Calculate new portfolio metrics
    const metrics = calculateMetrics(weights, assets, scenario);

    // Calculate individual asset impacts
    const updatedAssets: PortfolioAsset[] = assets.map(asset => {
         const oilPriceFactor = 1 + (scenario.oil_price_adjustment || 0) / 100;
         const carbonTax = scenario.carbon_tax || 0;

         const newNpv = asset.base_npv * oilPriceFactor - (asset.base_carbon_intensity * carbonTax * 1000);
         const newIrr = asset.base_irr * oilPriceFactor;

         return {
             ...asset,
             scenario_npv: newNpv,
             scenario_irr: newIrr
         };
    });

    const result = {
        scenario,
        metrics: {
            total_npv: metrics.npv,
            weighted_irr: metrics.irr,
            portfolio_volatility: metrics.volatility,
            portfolio_carbon_intensity: metrics.carbonIntensity
        },
        assets: updatedAssets
    };

    const provenance = createProvenance('petrosquare-portfolio-engine', 'Scenario evaluation results');
    return NextResponse.json(createSuccessEnvelope(result, provenance));
  } catch (error) {
    return NextResponse.json(createErrorEnvelope(error), { status: 500 });
  }
}
