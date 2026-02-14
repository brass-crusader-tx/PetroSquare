import React from 'react';
import { DataPanel } from '@petrosquare/ui';
import { useData } from '../../lib/hooks';
import { Instrument } from '@petrosquare/types';
import { ProvenanceList } from './ProvenanceList';
import { StalenessPill } from './StalenessPill';

export function TraderDashboard() {
    // useData unwraps the envelope, so T is Instrument[]
    const { data: instruments, loading, provenance } = useData<Instrument[]>('/api/markets/instruments');

    // Provide a default empty array if data is null
    const list = instruments || [];

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <DataPanel title="Live Market Watchlist" loading={loading}>
                    <div className="space-y-2">
                        {list.map(inst => (
                            <div key={inst.id} className="flex justify-between items-center p-3 bg-slate-800/50 rounded border border-slate-700 hover:border-slate-500 transition-colors cursor-pointer">
                                <div>
                                    <div className="font-bold text-white flex items-center gap-2">
                                        {inst.symbol}
                                        <span className="text-[10px] bg-slate-700 px-1 rounded text-slate-300">{inst.type}</span>
                                    </div>
                                    <div className="text-xs text-slate-400">{inst.name}</div>
                                </div>
                                <div className="text-right">
                                    <div className="font-mono text-emerald-400 text-lg">
                                        {inst.symbol.includes('CL') ? '75.42' : inst.symbol.includes('NG') ? '2.84' : '80.12'}
                                        <span className="text-xs text-slate-500 ml-1">{inst.currency}</span>
                                    </div>
                                    <StalenessPill asOf={new Date().toISOString()} />
                                </div>
                            </div>
                        ))}
                    </div>
                    {/* provenance from useData hook might be singular or array depending on backend?
                        Backend returns array. Types says singular?
                        packages/types: provenance?: Provenance;
                        But I updated index.ts to have ProvenanceRef[] in AnalyticsResultEnvelope.
                        DataEnvelope has Provenance (singular).

                        My API routes return `provenance: [ProvenanceRef]`.
                        useData sets `provenance` state to `json.provenance`.
                        So it will be an array.
                        ProvenanceList expects `items?: ProvenanceRef[]`.
                        So it should match.
                     */}
                    <ProvenanceList items={provenance as any} />
                </DataPanel>

                <div className="space-y-6">
                    <DataPanel title="Arbitrage Monitor">
                        <div className="p-4 bg-slate-800/30 rounded border border-slate-700 flex flex-col gap-3">
                            <div className="flex justify-between items-center">
                                <span className="text-sm font-bold text-slate-300">WTI vs Brent Spread</span>
                                <span className="text-xs bg-emerald-900 text-emerald-200 px-2 py-1 rounded">Open Arb</span>
                            </div>
                            <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                                <div className="h-full bg-emerald-500 w-[75%]"></div>
                            </div>
                            <div className="flex justify-between text-xs text-slate-400">
                                <span>Z-Score: 2.4</span>
                                <span>Profit Pot: $12k</span>
                            </div>
                        </div>
                    </DataPanel>

                    <DataPanel title="Market Events (Signals)">
                        <div className="text-sm text-slate-400 p-2">
                            <div className="flex gap-2 items-start mb-3 pb-3 border-b border-slate-700">
                                <div className="w-1.5 h-1.5 mt-1.5 rounded-full bg-amber-500 shrink-0"></div>
                                <div>
                                    <div className="font-bold text-white">OPEC+ Meeting Minutes</div>
                                    <div className="text-xs mt-1">Impact detected on <span className="text-amber-400">CL-FUT</span></div>
                                </div>
                            </div>
                        </div>
                    </DataPanel>
                </div>
            </div>
        </div>
    );
}
