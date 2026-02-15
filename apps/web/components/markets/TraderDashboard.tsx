import React from 'react';
import { DataPanel } from '@petrosquare/ui';
import { useData } from '../../lib/hooks';
import { Instrument } from '@petrosquare/types';
import { ProvenanceList } from './ProvenanceList';
import { StalenessPill } from './StalenessPill';

export function TraderDashboard() {
    const { data: instruments, loading, provenance } = useData<Instrument[]>('/api/markets/instruments');
    const list = instruments || [];

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <DataPanel title="Live Market Watchlist" loading={loading}>
                    <div className="space-y-3">
                        {list.map(inst => (
                            <div key={inst.id} className="flex justify-between items-center p-4 bg-surface-highlight/10 rounded-xl border border-white/5 hover:border-white/10 hover:bg-surface-highlight/20 transition-all cursor-pointer group">
                                <div>
                                    <div className="font-bold text-white flex items-center gap-2">
                                        {inst.symbol}
                                        <span className="text-[10px] bg-white/5 px-1.5 py-0.5 rounded text-muted font-mono uppercase tracking-wider">{inst.type}</span>
                                    </div>
                                    <div className="text-xs text-muted group-hover:text-white transition-colors">{inst.name}</div>
                                </div>
                                <div className="text-right">
                                    <div className="font-mono text-data-positive text-lg font-medium tracking-tight">
                                        {inst.symbol.includes('CL') ? '75.42' : inst.symbol.includes('NG') ? '2.84' : '80.12'}
                                        <span className="text-xs text-muted ml-1 font-sans">{inst.currency}</span>
                                    </div>
                                    <StalenessPill asOf={new Date().toISOString()} />
                                </div>
                            </div>
                        ))}
                    </div>
                    <ProvenanceList items={provenance as any} />
                </DataPanel>

                <div className="space-y-6">
                    <DataPanel title="Arbitrage Monitor">
                        <div className="p-5 bg-surface-highlight/10 rounded-xl border border-white/5 flex flex-col gap-4">
                            <div className="flex justify-between items-center">
                                <span className="text-sm font-bold text-white">WTI vs Brent Spread</span>
                                <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-1 rounded-md uppercase font-bold tracking-wide">Open Arb</span>
                            </div>
                            <div className="h-2.5 bg-surface-highlight/30 rounded-full overflow-hidden">
                                <div className="h-full bg-emerald-500 w-[75%] shadow-[0_0_10px_rgba(16,185,129,0.3)]"></div>
                            </div>
                            <div className="flex justify-between text-xs text-muted font-mono">
                                <span>Z-Score: 2.4</span>
                                <span className="text-white">Profit Pot: $12k</span>
                            </div>
                        </div>
                    </DataPanel>

                    <DataPanel title="Market Events (Signals)">
                        <div className="text-sm text-muted p-2">
                            <div className="flex gap-3 items-start mb-3 pb-3 border-b border-white/5">
                                <div className="w-2 h-2 mt-1.5 rounded-full bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.4)] shrink-0"></div>
                                <div>
                                    <div className="font-bold text-white">OPEC+ Meeting Minutes</div>
                                    <div className="text-xs mt-1 leading-relaxed">Impact detected on <span className="text-amber-400 font-medium">CL-FUT</span> with high volatility expected.</div>
                                </div>
                            </div>
                        </div>
                    </DataPanel>
                </div>
            </div>
        </div>
    );
}
