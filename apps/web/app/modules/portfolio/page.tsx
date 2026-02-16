import React from 'react';
import { PortfolioService } from '../../../lib/portfolio/service';
import { EfficientFrontierChart } from './components/EfficientFrontierChart';
import { CapitalAllocationPie } from './components/CapitalAllocationPie';
import { AssetRankingTable } from './components/AssetRankingTable';
import { StrategicAssistant } from './components/StrategicAssistant';
import { ArrowUpRight, TrendingUp, AlertTriangle, Leaf, DollarSign } from 'lucide-react';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function PortfolioDashboard() {
  const data = await PortfolioService.getDashboardData();
  const strategy = data.current_strategy;
  const result = strategy?.result;

  return (
    <div className="p-8 space-y-8 bg-background min-h-screen text-foreground">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Portfolio Strategy</h1>
          <p className="text-muted mt-2">Capital Allocation & Optimization Engine</p>
        </div>
        <div className="flex gap-4">
          <div className="px-4 py-2 bg-surface border border-border rounded-lg text-sm">
             <span className="text-muted block text-xs uppercase tracking-wider">Strategy Version</span>
             <span className="font-mono text-white font-bold">{strategy?.name || 'Draft'}</span>
          </div>
          <Link href="/modules/portfolio/strategy" className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2">
            <TrendingUp size={16} />
            <span>New Strategy</span>
          </Link>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <KpiCard
          title="Portfolio NPV"
          value={`$${(result?.total_npv / 1e6).toFixed(1)}M`}
          change="+2.4%"
          icon={<DollarSign className="text-emerald-400" />}
        />
        <KpiCard
          title="Weighted IRR"
          value={`${result?.weighted_irr.toFixed(1)}%`}
          change="-0.5%"
          icon={<ArrowUpRight className="text-blue-400" />}
        />
        <KpiCard
          title="Volatility (Risk)"
          value={`${(result?.portfolio_volatility * 100).toFixed(1)}%`}
          change="Target < 25%"
          icon={<AlertTriangle className="text-yellow-400" />}
        />
        <KpiCard
          title="Carbon Intensity"
          value={`${result?.portfolio_carbon_intensity.toFixed(1)} kg/boe`}
          change="-12% YoY"
          icon={<Leaf className="text-green-400" />}
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Visuals */}
        <div className="lg:col-span-2 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <EfficientFrontierChart
                data={result?.efficient_frontier || []}
                currentRisk={result?.portfolio_volatility}
                currentReturn={result?.total_npv}
            />
            <CapitalAllocationPie allocations={result?.optimal_allocation || []} />
          </div>

          <div>
            <div className="flex justify-between items-center mb-4">
               <h3 className="text-lg font-bold text-white">Asset Ranking & Allocation</h3>
               <button className="text-xs text-primary hover:underline">Export CSV</button>
            </div>
            <AssetRankingTable assets={data.assets} />
          </div>
        </div>

        {/* Right Column: Assistant & Insights */}
        <div className="space-y-8">
            <StrategicAssistant />

            {/* Quick Insights Mock */}
            <div className="bg-surface rounded-xl p-6 border border-border">
                <h3 className="text-sm font-bold text-white mb-4">Strategic Alerts</h3>
                <div className="space-y-4">
                    <div className="flex gap-3 items-start">
                        <div className="w-2 h-2 rounded-full bg-red-500 mt-1.5 shrink-0" />
                        <div>
                            <p className="text-sm text-gray-200">Permian Basin exposure exceeds risk limits under "Low Oil Price" scenario.</p>
                            <span className="text-xs text-muted">2 hours ago</span>
                        </div>
                    </div>
                    <div className="flex gap-3 items-start">
                         <div className="w-2 h-2 rounded-full bg-yellow-500 mt-1.5 shrink-0" />
                        <div>
                            <p className="text-sm text-gray-200">Carbon tax hike simulation suggests divesting Asset-12 by Q4.</p>
                            <span className="text-xs text-muted">5 hours ago</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}

function KpiCard({ title, value, change, icon }: { title: string, value: string, change: string, icon: React.ReactNode }) {
    return (
        <div className="bg-surface p-6 rounded-xl border border-border shadow-sm">
            <div className="flex justify-between items-start mb-2">
                <span className="text-sm font-medium text-muted">{title}</span>
                {icon}
            </div>
            <div className="text-2xl font-bold text-white tracking-tight">{value}</div>
            <div className="text-xs text-muted mt-1">{change}</div>
        </div>
    );
}
