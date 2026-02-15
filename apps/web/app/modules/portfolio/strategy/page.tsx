import React from 'react';
import { StrategyBuilderClient } from './StrategyBuilderClient';
import { PortfolioService } from '../../../../lib/portfolio/service';

export const dynamic = 'force-dynamic';

export default async function StrategyPage() {
    const data = await PortfolioService.getDashboardData();

    return <StrategyBuilderClient initialData={data} />;
}
