import React from 'react';
import { DataPanel } from '@petrosquare/ui';
import { useData } from '../../lib/hooks';
import { AnalyticsResultEnvelope } from '@petrosquare/types';
import { ProvenanceList } from './ProvenanceList';
import { ConfidenceBadge } from './ConfidenceBadge';

export function RiskDashboard() {
    // Mock fetch VaR
    // const { data: varEnv } = useData<AnalyticsResultEnvelope<number>>('/api/trading/risk/var');

    // Hardcoded mock for UI shell
    const varValue = 1250000;
    const stressPnL = -450000;

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <DataPanel title="Value at Risk (95% Daily)">
                    <div className="flex flex-col items-center justify-center py-6">
                        <div className="text-4xl font-mono text-white mb-2">
                            ${(varValue / 1000000).toFixed(2)}M
                        </div>
                        <ConfidenceBadge confidence={0.95} />
                        <div className="mt-4 text-xs text-slate-400 text-center">
                            Parametric Method (Delta-Normal)
                        </div>
                    </div>
                </DataPanel>

                <DataPanel title="Stress Test (Scenario A)">
                    <div className="flex flex-col items-center justify-center py-6">
                        <div className="text-4xl font-mono text-rose-400 mb-2">
                            -${(Math.abs(stressPnL) / 1000).toFixed(0)}k
                        </div>
                        <div className="text-xs text-rose-300 bg-rose-900/30 px-2 py-1 rounded">
                            Price Shock -10%
                        </div>
                    </div>
                </DataPanel>

                <DataPanel title="Position Limits">
                    <div className="space-y-3">
                        <div>
                            <div className="flex justify-between text-xs text-slate-300 mb-1">
                                <span>Crude Book</span>
                                <span>85%</span>
                            </div>
                            <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
                                <div className="h-full bg-amber-500 w-[85%]"></div>
                            </div>
                        </div>
                        <div>
                            <div className="flex justify-between text-xs text-slate-300 mb-1">
                                <span>Gas Book</span>
                                <span>42%</span>
                            </div>
                            <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
                                <div className="h-full bg-emerald-500 w-[42%]"></div>
                            </div>
                        </div>
                    </div>
                </DataPanel>
            </div>

            <DataPanel title="Active Risk Factors">
                <table className="w-full text-sm text-left text-slate-400">
                    <thead className="text-xs uppercase bg-slate-800/50 text-slate-500">
                        <tr>
                            <th className="px-4 py-2">Factor</th>
                            <th className="px-4 py-2">Exposure</th>
                            <th className="px-4 py-2">Contribution to VaR</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr className="border-b border-slate-700">
                            <td className="px-4 py-3 text-white">WTI Spot Price</td>
                            <td className="px-4 py-3">$14.2M Long</td>
                            <td className="px-4 py-3">65%</td>
                        </tr>
                        <tr className="border-b border-slate-700">
                            <td className="px-4 py-3 text-white">Henry Hub Basis</td>
                            <td className="px-4 py-3">$2.1M Short</td>
                            <td className="px-4 py-3">12%</td>
                        </tr>
                    </tbody>
                </table>
            </DataPanel>
        </div>
    );
}
