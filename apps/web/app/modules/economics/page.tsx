"use client";

import React, { useState } from 'react';
import { PageContainer, PageHeader, FilterBar, DataPanel, KpiCard, DataMeta, StatusPill, SkeletonTable, DetailDrawer } from '@petrosquare/ui';
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

    const [drawer, setDrawer] = useState<{ isOpen: boolean, data: any, type: string, title: string }>({
      isOpen: false, data: null, type: '', title: ''
    });

    const openDrawer = (title: string, type: string, data: any) => {
      setDrawer({ isOpen: true, title, type, data });
    };

    // Fetch scenarios and portfolio
    const { data: scenarios, loading: loadingScenarios } = useData<EconScenario[]>('/api/econ/scenarios');
    const { data: portfolio, loading: loadingPortfolio } = useData<PortfolioItem[]>('/api/econ/portfolio');

    // Handle Run
    const handleRun = async () => {
        setRunning(true);
        // In a real app, we would POST inputs. For this demo, we use a GET with scenarioId or simulate a run.
        const scenarioId = scenarios?.[0]?.id || 'sc-base';

        try {
            const res = await fetch(`/api/econ/run?scenarioId=${scenarioId}`);
            const json = await res.json();
            if (json.status === 'ok') {
                setResult(json.data);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setRunning(false);
        }
    };

    return (
      <PageContainer>
            <PageHeader
                title="Cost & Economic Modeling"
                description="Evaluate project profitability, cash flow scenarios, and portfolio performance."
            />

            <FilterBar lastUpdated="Live Model">
                 <button
                    className="px-4 py-1.5 bg-primary text-white text-sm font-medium rounded hover:bg-blue-600 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={handleRun}
                    disabled={running}
                 >
                    {running ? 'Running...' : 'Run Scenario ▶'}
                 </button>
                 <div className="h-8 w-px bg-border mx-2"></div>
                 <select className="bg-surface-inset border border-border rounded px-3 py-1.5 text-sm text-white focus:outline-none">
                    <option>Base Case (2024)</option>
                    <option>Stress Test ($40 Oil)</option>
                 </select>
            </FilterBar>

            {/* KPI Strip */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                 <KpiCard
                    title="NPV (10%)"
                    value={result ? `$${(result.npv / 1000000).toFixed(1)}M` : '—'}
                    unit="USD"
                    change={result && result.npv > 0 ? 12.5 : undefined} // Mock change for demo
                    changeLabel="vs Base"
                    status={result ? (result.npv > 0 ? 'success' : 'error') : 'neutral'}
                    loading={running}
                    onClick={() => result && openDrawer('NPV Analysis', 'Metric', { value: result.npv, unit: 'USD', description: 'Net Present Value at 10% discount rate.' })}
                 />
                 <KpiCard
                    title="IRR"
                    value={result ? `${result.irr.toFixed(1)}` : '—'}
                    unit="%"
                    status={result ? (result.irr > 15 ? 'success' : 'warning') : 'neutral'}
                    loading={running}
                    onClick={() => result && openDrawer('IRR Analysis', 'Metric', { value: result.irr, unit: '%', description: 'Internal Rate of Return.' })}
                 />
                 <KpiCard
                    title="Payback Period"
                    value={result ? `${result.payback_period}` : '—'}
                    unit="Years"
                    status="neutral"
                    loading={running}
                    onClick={() => result && openDrawer('Payback Period', 'Metric', { value: result.payback_period, unit: 'Years' })}
                 />
                 <KpiCard
                    title="Breakeven Price"
                    value={result ? `$${result.breakeven_oil_price}` : '—'}
                    unit="USD/bbl"
                    status="neutral"
                    loading={running}
                    onClick={() => result && openDrawer('Breakeven Analysis', 'Metric', { value: result.breakeven_oil_price, unit: 'USD/bbl' })}
                 />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Inputs Panel */}
                <DataPanel
                    title="Scenario Parameters"
                    subtitle="Adjust key assumptions"
                    className="lg:col-span-1 h-fit"
                    footer={<DataMeta source="User Input" lastUpdated="Local" />}
                >
                     <div className="space-y-6">
                        <div>
                            <div className="flex justify-between mb-2">
                                <label className="text-xs uppercase text-muted font-bold">Oil Price ($/bbl)</label>
                                <span className="text-primary font-mono font-bold">${inputs.oil_price}</span>
                            </div>
                            <input
                                type="range" min="40" max="120" step="1"
                                value={inputs.oil_price}
                                onChange={e => setInputs({...inputs, oil_price: Number(e.target.value)})}
                                className="w-full h-2 bg-surface-inset rounded-lg appearance-none cursor-pointer accent-primary"
                            />
                            <div className="flex justify-between text-[10px] text-muted mt-1 font-mono">
                                <span>$40</span>
                                <span>$120</span>
                            </div>
                        </div>

                         <div>
                            <div className="flex justify-between mb-2">
                                <label className="text-xs uppercase text-muted font-bold">OPEX ($/bbl)</label>
                                <span className="text-primary font-mono font-bold">${inputs.opex}</span>
                            </div>
                            <input
                                type="range" min="5" max="30" step="0.5"
                                value={inputs.opex}
                                onChange={e => setInputs({...inputs, opex: Number(e.target.value)})}
                                className="w-full h-2 bg-surface-inset rounded-lg appearance-none cursor-pointer accent-primary"
                            />
                        </div>

                        {/* Number inputs */}
                         <div className="space-y-4">
                            <div>
                                <label className="text-xs uppercase text-muted font-bold block mb-1">CAPEX ($)</label>
                                <input
                                    type="number"
                                    value={inputs.capex}
                                    onChange={e => setInputs({...inputs, capex: Number(e.target.value)})}
                                    className="w-full bg-surface-inset text-white p-2 rounded border border-border text-sm font-mono focus:border-primary focus:outline-none transition-colors"
                                />
                            </div>
                             <div className="grid grid-cols-2 gap-4">
                                 <div>
                                    <label className="text-xs uppercase text-muted font-bold block mb-1">Royalty %</label>
                                    <input
                                        type="number" value={inputs.royalty}
                                        onChange={e => setInputs({...inputs, royalty: Number(e.target.value)})}
                                        className="w-full bg-surface-inset text-white p-2 rounded border border-border text-sm font-mono focus:border-primary focus:outline-none transition-colors"
                                    />
                                 </div>
                                 <div>
                                    <label className="text-xs uppercase text-muted font-bold block mb-1">Discount %</label>
                                    <input
                                        type="number" value={inputs.discount}
                                        onChange={e => setInputs({...inputs, discount: Number(e.target.value)})}
                                        className="w-full bg-surface-inset text-white p-2 rounded border border-border text-sm font-mono focus:border-primary focus:outline-none transition-colors"
                                    />
                                 </div>
                            </div>
                        </div>
                    </div>
                </DataPanel>

                <div className="lg:col-span-2 space-y-6">
                    {/* Chart */}
                    <DataPanel
                        title="Cash Flow Forecast"
                        subtitle="Projected annual cash flows based on current scenario"
                        loading={running}
                        empty={!result}
                        emptyMessage="Run a scenario to view cash flow projections."
                        footer={<DataMeta source="PetroSquare Calc Engine" lastUpdated="Simulated" />}
                    >
                         <div className="h-64 flex items-end space-x-2 px-2 pt-8 pb-2">
                             {result?.cash_flow_series.map((cf, i) => {
                                 const height = Math.min(100, Math.max(5, (cf.value / 2000000) * 100)); // Normalize roughly
                                 const isNegative = cf.value < 0;
                                 return (
                                    <div
                                        key={i}
                                        className="flex-1 flex flex-col justify-end group relative h-full cursor-pointer hover:bg-surface-inset/5 rounded"
                                        onClick={() => openDrawer(`Cash Flow ${cf.period}`, 'Financial Period', cf)}
                                    >
                                        <div className="flex-1 flex flex-col justify-end">
                                             <div
                                                className={`w-full transition-all rounded-t ${isNegative ? 'bg-error/80' : 'bg-success/80'} hover:opacity-100 opacity-80`}
                                                style={{ height: `${Math.abs(height)}%` }}
                                            ></div>
                                        </div>
                                        <div className="text-[10px] text-muted mt-2 text-center border-t border-border pt-1 font-mono">{cf.period.split('-')[1]}</div>
                                         {/* Tooltip */}
                                        <div className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 bg-surface-inset text-white text-xs px-2 py-1 rounded border border-border opacity-0 group-hover:opacity-100 pointer-events-none z-10 whitespace-nowrap font-mono shadow-lg">
                                            ${(cf.value/1000).toFixed(0)}k
                                        </div>
                                    </div>
                                 )
                             })}
                         </div>
                    </DataPanel>

                    {/* Table */}
                    <DataPanel
                        title="Portfolio Analysis"
                        subtitle="Comparative asset performance"
                        loading={loadingPortfolio}
                        footer={<DataMeta source="Corporate Database" lastUpdated="Daily" />}
                        className="overflow-hidden"
                    >
                        <div className="overflow-x-auto">
                            {loadingPortfolio ? <SkeletonTable /> : (
                                <table className="w-full text-sm text-left border-collapse">
                                    <thead className="text-xs text-muted uppercase bg-surface-inset border-b border-border sticky top-0">
                                        <tr>
                                            <th className="px-6 py-3 font-semibold tracking-wider">Asset</th>
                                            <th className="px-6 py-3 text-right font-semibold tracking-wider">NPV</th>
                                            <th className="px-6 py-3 text-right font-semibold tracking-wider">ROI</th>
                                            <th className="px-6 py-3 text-center font-semibold tracking-wider">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-border/50">
                                        {portfolio?.map((item) => (
                                            <tr
                                                key={item.asset_id}
                                                className="hover:bg-surface-highlight/10 transition-colors group cursor-pointer"
                                                onClick={() => openDrawer(item.asset_name, 'Asset Economics', item)}
                                            >
                                                <td className="px-6 py-3 font-medium text-white font-mono text-xs">{item.asset_name}</td>
                                                <td className="px-6 py-3 text-right font-mono text-white group-hover:text-primary transition-colors">${(item.npv / 1000000).toFixed(1)}M</td>
                                                <td className="px-6 py-3 text-right font-mono text-white">{item.roi}%</td>
                                                <td className="px-6 py-3 text-center">
                                                    <StatusPill status={item.status === 'positive' ? 'success' : item.status === 'negative' ? 'error' : 'warning'}>
                                                        {item.status.toUpperCase()}
                                                    </StatusPill>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    </DataPanel>
                </div>
            </div>

            <DetailDrawer
                isOpen={drawer.isOpen}
                onClose={() => setDrawer({...drawer, isOpen: false})}
                title={drawer.title}
                type={drawer.type}
                data={drawer.data}
            />
      </PageContainer>
    );
}
