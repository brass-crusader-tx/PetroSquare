import { NextRequest, NextResponse } from 'next/server';
import { PortfolioService } from '../../../../lib/portfolio/service';
import { createSuccessEnvelope, createErrorEnvelope } from '../../../../lib/errors';
import { createProvenance } from '../../../../lib/data-fabric/registry';
import { OptimizationConfig, PortfolioStrategy } from '@petrosquare/types';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const { config, budget, userId } = await req.json() as { config: OptimizationConfig, budget: number, userId: string };

    // Fetch assets first
    const dashboard = await PortfolioService.getDashboardData();
    const assets = dashboard.assets;

    // Run Optimization
    const result = await PortfolioService.runOptimization(config, budget || 100000000);

    // Construct new Strategy
    const newStrategy: PortfolioStrategy = {
      id: result.strategy_id,
      name: `Optimized Strategy ${new Date().toLocaleTimeString()}`,
      version: 1,
      author_id: userId || 'system',
      created_at: new Date().toISOString(),
      status: 'STAGED',
      result: result
    };

    // Save Strategy (mock)
    await PortfolioService.saveStrategy(newStrategy);

    const provenance = createProvenance('petrosquare-portfolio-engine', 'Optimized portfolio strategy');
    return NextResponse.json(createSuccessEnvelope(newStrategy, provenance));
  } catch (error) {
    return NextResponse.json(createErrorEnvelope(error), { status: 500 });
  }
}
