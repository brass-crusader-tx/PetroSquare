'use client';

import React, { useState } from 'react';
import { PortfolioScenarioInput } from '@petrosquare/types';
import { Sliders, RefreshCw, AlertTriangle } from 'lucide-react';

interface ScenarioBuilderProps {
    initialScenario: PortfolioScenarioInput;
    onApply: (scenario: PortfolioScenarioInput) => void;
    isSimulating: boolean;
}

export function ScenarioBuilder({ initialScenario, onApply, isSimulating }: ScenarioBuilderProps) {
    const [scenario, setScenario] = useState<PortfolioScenarioInput>(initialScenario);

    const handleChange = (field: keyof PortfolioScenarioInput, value: number | boolean) => {
        setScenario(prev => ({ ...prev, [field]: value }));
    };

    return (
        <div className="bg-surface rounded-lg p-6 border border-border shadow-lg">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                    <Sliders size={20} className="text-primary" />
                    <h3 className="text-lg font-bold text-white">Strategic Scenario Builder</h3>
                </div>
                <button
                    onClick={() => onApply(scenario)}
                    disabled={isSimulating}
                    className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50"
                >
                    {isSimulating ? <RefreshCw className="animate-spin" size={16} /> : <RefreshCw size={16} />}
                    Run Simulation
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Market Shocks */}
                <div className="space-y-4">
                    <h4 className="text-sm font-medium text-muted uppercase tracking-wider">Market Conditions</h4>

                    <div>
                        <label className="block text-sm text-white mb-1">Oil Price Shock (%)</label>
                        <input
                            type="range"
                            min="-50"
                            max="50"
                            step="5"
                            value={scenario.oil_price_adjustment}
                            onChange={(e) => handleChange('oil_price_adjustment', parseInt(e.target.value))}
                            className="w-full accent-primary"
                        />
                        <div className="flex justify-between text-xs text-muted mt-1">
                            <span>-50%</span>
                            <span className="text-primary font-bold">{scenario.oil_price_adjustment > 0 ? '+' : ''}{scenario.oil_price_adjustment}%</span>
                            <span>+50%</span>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm text-white mb-1">Carbon Tax ($/tonne)</label>
                        <input
                            type="number"
                            min="0"
                            max="200"
                            step="10"
                            value={scenario.carbon_tax}
                            onChange={(e) => handleChange('carbon_tax', parseInt(e.target.value))}
                            className="w-full bg-surface-highlight border border-border rounded px-3 py-2 text-white focus:outline-none focus:border-primary"
                        />
                    </div>
                </div>

                {/* Operational Risks */}
                <div className="space-y-4">
                    <h4 className="text-sm font-medium text-muted uppercase tracking-wider">Operational Risks</h4>

                    <div>
                        <label className="block text-sm text-white mb-1">Production Outage (%)</label>
                        <input
                            type="range"
                            min="0"
                            max="30"
                            step="1"
                            value={scenario.production_outage}
                            onChange={(e) => handleChange('production_outage', parseInt(e.target.value))}
                            className="w-full accent-red-500"
                        />
                        <div className="flex justify-between text-xs text-muted mt-1">
                            <span>0%</span>
                            <span className="text-red-400 font-bold">{scenario.production_outage}%</span>
                            <span>30%</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 mt-4">
                        <input
                            type="checkbox"
                            checked={scenario.fiscal_regime_change}
                            onChange={(e) => handleChange('fiscal_regime_change', e.target.checked)}
                            className="w-4 h-4 rounded border-border bg-surface-highlight text-primary focus:ring-primary"
                        />
                        <span className="text-sm text-white">Simulate Fiscal Regime Change</span>
                    </div>

                    {scenario.fiscal_regime_change && (
                        <div className="p-3 bg-yellow-900/20 border border-yellow-700/50 rounded flex items-start gap-2 text-xs text-yellow-200">
                            <AlertTriangle size={14} className="shrink-0 mt-0.5" />
                            <span>This will increase royalties and tax burden across all assets based on jurisdiction.</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
