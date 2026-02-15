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
                        <div className="mt-4 text-xs text-muted text-center font-mono">
                            Parametric Method (Delta-Normal)
                        </div>
                    </div>
                </DataPanel>

                <DataPanel title="Stress Test (Scenario A)">
                    <div className="flex flex-col items-center justify-center py-6">
                        <div className="text-4xl font-mono text-data-critical mb-2">
                            -${(Math.abs(stressPnL) / 1000).toFixed(0)}k
                        </div>
                        <div className="text-[10px] uppercase tracking-wider font-bold text-data-critical bg-data-critical/20 px-2 py-1 rounded">
                            Price Shock -10%
                        </div>
                    </div>
                </DataPanel>

                <DataPanel title="Position Limits">
                    <div className="space-y-4 pt-2">
                        <div>
                            <div className="flex justify-between text-xs text-muted font-mono mb-1 uppercase tracking-wider">
                                <span>Crude Book</span>
                                <span className="text-white">85%</span>
                            </div>
                            <div className="h-1.5 bg-surface-highlight rounded-full overflow-hidden">
                                <div className="h-full bg-data-warning w-[85%] shadow-[0_0_10px_rgba(245,158,11,0.5)]"></div>
                            </div>
                        </div>
                        <div>
                            <div className="flex justify-between text-xs text-muted font-mono mb-1 uppercase tracking-wider">
                                <span>Gas Book</span>
                                <span className="text-white">42%</span>
                            </div>
                            <div className="h-1.5 bg-surface-highlight rounded-full overflow-hidden">
                                <div className="h-full bg-data-positive w-[42%] shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
                            </div>
                        </div>
                    </div>
                </DataPanel>
            </div>

            <DataPanel title="Active Risk Factors">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-muted">
                        <thead className="text-[10px] uppercase tracking-wider bg-surface-highlight/30 text-muted font-mono">
                            <tr>
                                <th className="px-4 py-3 font-medium">Factor</th>
                                <th className="px-4 py-3 font-medium">Exposure</th>
                                <th className="px-4 py-3 font-medium">Contribution to VaR</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border/50">
                            <tr className="hover:bg-surface-highlight/5 transition-colors">
                                <td className="px-4 py-3 text-white font-medium">WTI Spot Price</td>
                                <td className="px-4 py-3 font-mono text-xs">$14.2M Long</td>
                                <td className="px-4 py-3 font-mono text-xs text-white">65%</td>
                            </tr>
                            <tr className="hover:bg-surface-highlight/5 transition-colors">
                                <td className="px-4 py-3 text-white font-medium">Henry Hub Basis</td>
                                <td className="px-4 py-3 font-mono text-xs">$2.1M Short</td>
                                <td className="px-4 py-3 font-mono text-xs text-white">12%</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </DataPanel>
        </div>
    );
}
