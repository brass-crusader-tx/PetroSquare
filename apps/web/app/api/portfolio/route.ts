import { NextResponse } from 'next/server';
import { PortfolioService } from '../../../lib/portfolio/service';
import { createSuccessEnvelope, createErrorEnvelope } from '../../../lib/errors';
import { createProvenance } from '../../../lib/data-fabric/registry';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const data = await PortfolioService.getDashboardData();
    const provenance = createProvenance('petrosquare-portfolio-engine', 'Aggregated portfolio dashboard data');
    return NextResponse.json(createSuccessEnvelope(data, provenance));
  } catch (error) {
    return NextResponse.json(createErrorEnvelope(error), { status: 500 });
  }
}
