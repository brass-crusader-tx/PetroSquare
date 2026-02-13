"use client";

import React, { useState, useEffect } from 'react';
import { PageContainer, SectionHeader, DataPanel, InlineMetricBlock, Button, InsightCard } from '@petrosquare/ui';
import { useData } from '../../../lib/hooks';
import { EconScenario, EconResult, PortfolioItem } from '@petrosquare/types';
import {
  ComposedChart,
  Line,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Bar
} from 'recharts';

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
  const [insight, setInsight] = useState<string | null>(null);
  const [loadingInsight, setLoadingInsight] = useState(false);

  // Fetch scenarios and portfolio
  const { data: scenarios, loading: loadingScenarios } = useData<EconScenario[]>('/api/econ/scenarios');
  const { data: portfolio, loading: loadingPortfolio } = useData<PortfolioItem[]>('/api/econ/portfolio');

  // Handle Run
  const handleRun = async () => {
    setRunning(true);
    setInsight(null);

    const scenarioId = scenarios?.[0]?.id || 'sc-base';

    try {
        const res = await fetch(`/api/econ/run?scenarioId=${scenarioId}`);
        const json = await res.json();
        if (json.status === 'ok') {
            const newResult = json.data;
            // Simulate adjusting result based on inputs for responsiveness
            // This is just a visual trick for the demo since API is mocked
            const adjustedResult = { ...newResult };
            const factor = inputs.oil_price / 75; // Base case assumed 75
            adjustedResult.npv = newResult.npv * factor;
            adjustedResult.irr = newResult.irr * factor;
            adjustedResult.cash_flow_series = newResult.cash_flow_series.map((cf: any) => ({
                ...cf,
                value: cf.value * factor
            }));

            setResult(adjustedResult);
            fetchInsight(inputs, adjustedResult);
        }
    } catch (e) {
        console.error(e);
    } finally {
        setRunning(false);
    }
  };

  // Auto-run on mount
  useEffect(() => {
      handleRun();
  }, []);

  const fetchInsight = async (scenario: any, result: any) => {
    setLoadingInsight(true);
    try {
        const prompt = `Act as a senior petroleum economist. Analyze the following scenario results:
        Inputs:
        - Oil Price: $${scenario.oil_price}/bbl
        - OPEX: $${scenario.opex}/bbl
        - CAPEX: $${scenario.capex.toLocaleString()}

        Results:
        - NPV (10%): $${(result.npv / 1e6).toFixed(1)}M
        - IRR: ${result.irr.toFixed(1)}%
        - Breakeven: $${result.breakeven_oil_price}/bbl

        Provide a concise executive summary (max 3 sentences) on project viability and key sensitivity risks.`;

        const res = await fetch('/api/ai/insight', {
            method: 'POST',
            body: JSON.stringify({ prompt })
        });
        const json = await res.json();
        if (json.text) setInsight(json.text);
    } catch (e) {
        console.error("AI Insight Failed", e);
    } finally {
        setLoadingInsight(false);
    }
  }

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

                {/* AI Insight */}
                <InsightCard insight={insight} loading={loadingInsight} className="mb-6" />

                {/* Cash Flow Chart */}
                <DataPanel title="Cash Flow Forecast" loading={running} className="min-h-[300px]">
                    {result ? (
                         <div className="h-64 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <ComposedChart data={result.cash_flow_series.map((cf, i) => ({
                                    period: cf.period,
                                    netCashFlow: cf.value,
                                    revenue: cf.value * 1.5, // Mock revenue for demo (simulated)
                                    opex: cf.value * 0.3 // Mock OPEX
                                }))}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                                    <XAxis dataKey="period" stroke="#94A3B8" tick={{fontSize: 10}} />
                                    <YAxis stroke="#94A3B8" tick={{fontSize: 10}} tickFormatter={(val) => `$${val/1000}k`} />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#1E293B', borderColor: '#334155', color: '#fff' }}
                                        itemStyle={{ color: '#fff' }}
                                        formatter={(val: any) => [`$${Number(val).toLocaleString()}`, '']}
                                    />
                                    <Legend />
                                    <Area type="monotone" dataKey="revenue" fill="#3B82F6" stroke="#3B82F6" fillOpacity={0.1} name="Revenue" />
                                    <Bar dataKey="netCashFlow" barSize={20} fill="#10B981" name="Net Cash Flow" />
                                    <Line type="monotone" dataKey="opex" stroke="#EF4444" strokeWidth={2} dot={false} name="OPEX" />
                                </ComposedChart>
                            </ResponsiveContainer>
                         </div>
                    ) : (
                         <div className="h-64 flex items-center justify-center text-muted text-sm">
                             Run a scenario to view cash flow projection.
                         </div>
                    )}
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
