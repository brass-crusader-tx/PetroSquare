'use client';

import React, { useState } from 'react';
import { PortfolioScenarioInput, OptimizationConfig, OptimizationResult } from '@petrosquare/types';
import { ScenarioBuilder } from '../components/ScenarioBuilder';
import { EfficientFrontierChart } from '../components/EfficientFrontierChart';
import { CapitalAllocationPie } from '../components/CapitalAllocationPie';
import { AssetRankingTable } from '../components/AssetRankingTable';
import { ArrowLeft, Save, Play } from 'lucide-react';
import Link from 'next/link';

const DEFAULT_SCENARIO: PortfolioScenarioInput = {
    oil_price_adjustment: 0,
    gas_price_adjustment: 0,
    carbon_tax: 0,
    production_outage: 0,
    opex_inflation: 0,
    capex_inflation: 0,
    fiscal_regime_change: false
};

const DEFAULT_CONFIG: OptimizationConfig = {
    constraints: {
        max_capital_budget: 100000000,
        min_liquidity: 5000000,
        max_volatility: 0.25,
        max_carbon_intensity: 50,
        min_irr: 10,
        mandatory_asset_ids: []
    },
    objective: 'MAX_NPV',
    scenario: DEFAULT_SCENARIO,
    num_simulations: 500
};

export function StrategyBuilderClient({ initialData }: { initialData: any }) {
    const [config, setConfig] = useState<OptimizationConfig>(DEFAULT_CONFIG);
    const [result, setResult] = useState<OptimizationResult | null>(null);
    const [isOptimizing, setIsOptimizing] = useState(false);

    const handleScenarioChange = (scenario: PortfolioScenarioInput) => {
        setConfig(prev => ({ ...prev, scenario }));
    };

    const runOptimization = async () => {
        setIsOptimizing(true);
        try {
            const res = await fetch('/api/portfolio/optimize', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    config,
                    budget: config.constraints.max_capital_budget
                })
            });
            const data = await res.json();
            if (data.data) {
                setResult(data.data.result);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setIsOptimizing(false);
        }
    };

    return (
        <div className="p-8 space-y-8 min-h-screen bg-background text-foreground">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/modules/portfolio" className="p-2 hover:bg-surface-highlight rounded-full transition-colors">
                        <ArrowLeft size={20} className="text-muted" />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-white">New Strategy Simulation</h1>
                        <p className="text-muted text-sm">Define scenarios and optimization targets</p>
                    </div>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={runOptimization}
                        disabled={isOptimizing}
                        className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2 disabled:opacity-50"
                    >
                        {isOptimizing ? <span className="animate-spin">●</span> : <Play size={16} />}
                        <span>Run Optimization</span>
                    </button>
                    <button className="px-4 py-2 bg-surface border border-border rounded-lg hover:bg-surface-highlight transition-colors flex items-center gap-2 text-white">
                        <Save size={16} />
                        <span>Save Strategy</span>
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left: Controls */}
                <div className="space-y-6">
                    <ScenarioBuilder
                        initialScenario={config.scenario}
                        onApply={(s) => { handleScenarioChange(s); runOptimization(); }}
                        isSimulating={isOptimizing}
                    />

                    {/* Constraints Control (Simplified) */}
                    <div className="bg-surface rounded-lg p-6 border border-border">
                        <h3 className="text-sm font-bold text-white mb-4">Constraints</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="text-xs text-muted block mb-1">Max Volatility</label>
                                <input
                                    type="number"
                                    value={config.constraints.max_volatility}
                                    onChange={(e) => setConfig(prev => ({ ...prev, constraints: { ...prev.constraints, max_volatility: parseFloat(e.target.value) } }))}
                                    className="w-full bg-surface-highlight border border-border rounded px-3 py-2 text-sm text-white"
                                />
                            </div>
                            <div>
                                <label className="text-xs text-muted block mb-1">Objective</label>
                                <select
                                    value={config.objective}
                                    onChange={(e) => setConfig(prev => ({ ...prev, objective: e.target.value as any }))}
                                    className="w-full bg-surface-highlight border border-border rounded px-3 py-2 text-sm text-white"
                                >
                                    <option value="MAX_NPV">Maximize NPV</option>
                                    <option value="MIN_VOLATILITY">Minimize Risk</option>
                                    <option value="MAX_IRR">Maximize IRR</option>
                                    <option value="MIN_CARBON">Minimize Carbon</option>
                                    <option value="BALANCED">Balanced (Sharpe)</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right: Results */}
                <div className="lg:col-span-2 space-y-6">
                    {result ? (
                        <>
                             {/* Metrics Summary */}
                             <div className="grid grid-cols-4 gap-4">
                                <div className="bg-surface p-4 rounded-lg border border-border">
                                    <div className="text-xs text-muted">Optimized NPV</div>
                                    <div className="text-xl font-bold text-white">${(result.total_npv/1e6).toFixed(1)}M</div>
                                </div>
                                <div className="bg-surface p-4 rounded-lg border border-border">
                                    <div className="text-xs text-muted">Volatility</div>
                                    <div className="text-xl font-bold text-white">{(result.portfolio_volatility*100).toFixed(1)}%</div>
                                </div>
                                <div className="bg-surface p-4 rounded-lg border border-border">
                                    <div className="text-xs text-muted">IRR</div>
                                    <div className="text-xl font-bold text-white">{result.weighted_irr.toFixed(1)}%</div>
                                </div>
                                <div className="bg-surface p-4 rounded-lg border border-border">
                                    <div className="text-xs text-muted">Carbon</div>
                                    <div className="text-xl font-bold text-white">{result.portfolio_carbon_intensity.toFixed(1)}</div>
                                </div>
                             </div>

                             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <EfficientFrontierChart
                                    data={result.efficient_frontier}
                                    currentRisk={result.portfolio_volatility}
                                    currentReturn={result.total_npv}
                                />
                                <CapitalAllocationPie allocations={result.optimal_allocation} />
                             </div>
                        </>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed border-border rounded-xl">
                            <Play size={48} className="text-muted mb-4 opacity-50" />
                            <p className="text-muted">Configure scenario and run optimization to see results.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
