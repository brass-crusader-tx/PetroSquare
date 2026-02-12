"use client";

import React, { useState, useEffect } from 'react';
import { PageContainer, SectionHeader, DataPanel, InlineMetricBlock, Button } from '@petrosquare/ui';
import { useData } from '../../../lib/hooks';
import { EconScenario, EconResult, PortfolioItem } from '@petrosquare/types';

export default function EconomicsPage() {
  // State for Scenario Inputs
  const [inputs, setInputs] = useState({
    oil_price: 75,
    opex: 12,
    capex: 5000000,
    royalty: 12.5,
    discount: 10
  });

  const [result, setResult] = useState<EconResult | null>(null);
  const [running, setRunning] = useState(false);

  // Fetch scenarios and portfolio
  const { data: scenarios, loading: loadingScenarios } = useData<EconScenario[]>('/api/econ/scenarios');
  const { data: portfolio, loading: loadingPortfolio } = useData<PortfolioItem[]>('/api/econ/portfolio');

  // Handle Run
  const handleRun = async () => {
    setRunning(true);
    // In a real app, we would POST inputs. For this demo, we use a GET with scenarioId or simulate a run.
    // We'll use the 'sc-base' scenario for demo purposes or mock the result locally if needed,
    // but the instruction says "api/econ/run?scenarioId=".
    // We'll pick the first scenario ID available or a default.
    const scenarioId = scenarios?.[0]?.id || 'sc-base';

    try {
        const res = await fetch(`/api/econ/run?scenarioId=${scenarioId}`);
        const json = await res.json();
        if (json.status === 'ok') {
            // Adjust result based on local inputs (client-side simulation for responsiveness)
            // Ideally backend does this, but for MVP we might want to show responsiveness to slider changes.
            // However, sticking to the "Data integration flows" rule, we should rely on API.
            // Since the API is mocked to return deterministic data based on ID, we can't easily override with params without POST.
            // For this MVP, we will display the API result.
            setResult(json.data);
        }
    } catch (e) {
        console.error(e);
    } finally {
        setRunning(false);
    }
  };

  return (
    <main className="min-h-screen bg-background text-text">
      <PageContainer>
        <SectionHeader
            title="Cost & Economic Modeling"
            description="Evaluate project profitability, cash flow scenarios, and portfolio performance."
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">

            {/* Left: Inputs */}
            <div className="lg:col-span-1 space-y-6">
                <DataPanel title="Scenario Parameters">
                    <div className="space-y-4">
                        <div>
                            <label className="text-xs uppercase text-muted font-bold block mb-1">Oil Price Base Case ($/bbl)</label>
                            <input
                                type="range" min="40" max="120" step="1"
                                value={inputs.oil_price}
                                onChange={e => setInputs({...inputs, oil_price: Number(e.target.value)})}
                                className="w-full h-2 bg-surface-highlight rounded-lg appearance-none cursor-pointer"
                            />
                            <div className="flex justify-between text-xs mt-1">
                                <span className="text-muted">$40</span>
                                <span className="text-primary font-mono text-lg">${inputs.oil_price}</span>
                                <span className="text-muted">$120</span>
                            </div>
                        </div>

                        <div>
                            <label className="text-xs uppercase text-muted font-bold block mb-1">OPEX ($/bbl)</label>
                            <input
                                type="range" min="5" max="30" step="0.5"
                                value={inputs.opex}
                                onChange={e => setInputs({...inputs, opex: Number(e.target.value)})}
                                className="w-full h-2 bg-surface-highlight rounded-lg appearance-none cursor-pointer"
                            />
                            <div className="text-right text-primary font-mono text-lg">${inputs.opex}</div>
                        </div>

                        <div>
                            <label className="text-xs uppercase text-muted font-bold block mb-1">CAPEX ($)</label>
                            <input
                                type="number"
                                value={inputs.capex}
                                onChange={e => setInputs({...inputs, capex: Number(e.target.value)})}
                                className="w-full bg-surface-highlight text-white p-2 rounded border border-border text-sm font-mono"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                             <div>
                                <label className="text-xs uppercase text-muted font-bold block mb-1">Royalty %</label>
                                <input
                                    type="number" value={inputs.royalty}
                                    onChange={e => setInputs({...inputs, royalty: Number(e.target.value)})}
                                    className="w-full bg-surface-highlight text-white p-2 rounded border border-border text-sm font-mono"
                                />
                             </div>
                             <div>
                                <label className="text-xs uppercase text-muted font-bold block mb-1">Discount %</label>
                                <input
                                    type="number" value={inputs.discount}
                                    onChange={e => setInputs({...inputs, discount: Number(e.target.value)})}
                                    className="w-full bg-surface-highlight text-white p-2 rounded border border-border text-sm font-mono"
                                />
                             </div>
                        </div>

                        <div className="pt-4">
                            <Button variant="primary" className="w-full" onClick={handleRun} disabled={running}>
                                {running ? 'Running Model...' : 'Run Scenario'}
                            </Button>
                        </div>
                    </div>
                </DataPanel>

                <DataPanel title="Saved Scenarios" loading={loadingScenarios}>
                    <div className="space-y-2">
                        {scenarios?.map(s => (
                            <div key={s.id} className="p-2 hover:bg-surface-highlight cursor-pointer rounded border border-transparent hover:border-border text-sm flex justify-between">
                                <span className="text-white">{s.name}</span>
                                <span className="text-muted text-xs">{new Date(s.created_at).toLocaleDateString()}</span>
                            </div>
                        ))}
                    </div>
                </DataPanel>
            </div>

            {/* Middle: Results */}
            <div className="lg:col-span-2 space-y-6">

                {/* KPIs */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                     <InlineMetricBlock
                        label="NPV (10%)"
                        value={result ? `$${(result.npv / 1000000).toFixed(1)}M` : '-'}
                        trend={result && result.npv > 0 ? 'positive' : 'negative'}
                     />
                     <InlineMetricBlock
                        label="IRR"
                        value={result ? `${result.irr.toFixed(1)}%` : '-'}
                        trend={result && result.irr > 15 ? 'positive' : 'negative'}
                     />
                     <InlineMetricBlock
                        label="Payback"
                        value={result ? `${result.payback_period} yrs` : '-'}
                        trend="neutral"
                     />
                     <InlineMetricBlock
                        label="Breakeven"
                        value={result ? `$${result.breakeven_oil_price}` : '-'}
                        trend="neutral"
                     />
                </div>

                {/* Cash Flow Chart Placeholder */}
                <DataPanel title="Cash Flow Forecast" loading={running}>
                    <div className="h-64 flex items-end justify-between space-x-1 p-4 bg-surface-highlight/5 rounded border border-border">
                        {result ? result.cash_flow_series.map((cf, i) => (
                            <div key={i} className="flex-1 flex flex-col justify-end group relative">
                                <div
                                    className="w-full bg-emerald-500/80 hover:bg-emerald-400 transition-all rounded-t"
                                    style={{ height: `${(cf.value / 200000) * 100}%` }}
                                ></div>
                                <div className="text-[10px] text-muted mt-1 text-center truncate">{cf.period.split('-')[1]}</div>
                                {/* Tooltip */}
                                <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-surface text-white text-xs p-1 rounded border border-border opacity-0 group-hover:opacity-100 pointer-events-none z-10">
                                    ${(cf.value/1000).toFixed(0)}k
                                </div>
                            </div>
                        )) : (
                            <div className="w-full h-full flex items-center justify-center text-muted text-sm">Run a scenario to view cash flows</div>
                        )}
                    </div>
                </DataPanel>

                {/* Portfolio Table */}
                <DataPanel title="Portfolio Analysis" loading={loadingPortfolio}>
                     <table className="w-full text-sm text-left">
                        <thead className="text-xs text-muted uppercase bg-surface-highlight/10 border-b border-border">
                            <tr>
                                <th className="px-4 py-3">Asset</th>
                                <th className="px-4 py-3 text-right">NPV</th>
                                <th className="px-4 py-3 text-right">ROI</th>
                                <th className="px-4 py-3 text-center">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {portfolio?.map((item) => (
                                <tr key={item.asset_id} className="border-b border-border hover:bg-surface-highlight/5">
                                    <td className="px-4 py-3 font-medium text-white">{item.asset_name}</td>
                                    <td className="px-4 py-3 text-right font-mono text-white">${(item.npv / 1000000).toFixed(1)}M</td>
                                    <td className="px-4 py-3 text-right font-mono text-white">{item.roi}%</td>
                                    <td className="px-4 py-3 text-center">
                                        <span className={`inline-block w-2 h-2 rounded-full ${item.status === 'positive' ? 'bg-data-positive' : item.status === 'negative' ? 'bg-data-critical' : 'bg-data-warning'}`}></span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </DataPanel>

            </div>
        </div>
      </PageContainer>
    </main>
  );
}
