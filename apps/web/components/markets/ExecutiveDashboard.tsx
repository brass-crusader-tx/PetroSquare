import React from 'react';
import { DataPanel } from '@petrosquare/ui';
import { ConfidenceBadge } from './ConfidenceBadge';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export function ExecutiveDashboard() {
    // Mock PnL data
    const pnlData = Array.from({ length: 30 }).map((_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - (29 - i));
        return {
            date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            pnl: 1000000 + Math.random() * 500000 + (i * 100000) // Upward trend
        };
    });

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Top KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-slate-800 p-4 rounded border border-slate-700">
                    <div className="text-xs text-slate-400 uppercase">Net Portfolio Value</div>
                    <div className="text-2xl font-mono text-white mt-1">$42.8M</div>
                    <div className="text-xs text-emerald-400 mt-1">▲ 2.4% vs prev day</div>
                </div>
                <div className="bg-slate-800 p-4 rounded border border-slate-700">
                    <div className="text-xs text-slate-400 uppercase">Daily PnL</div>
                    <div className="text-2xl font-mono text-emerald-400 mt-1">+$1.2M</div>
                </div>
                <div className="bg-slate-800 p-4 rounded border border-slate-700">
                    <div className="text-xs text-slate-400 uppercase">VaR Utilization</div>
                    <div className="text-2xl font-mono text-amber-400 mt-1">68%</div>
                </div>
                <div className="bg-slate-800 p-4 rounded border border-slate-700">
                    <div className="text-xs text-slate-400 uppercase">ESG Carbon Cost</div>
                    <div className="text-2xl font-mono text-slate-300 mt-1">$145k</div>
                    <ConfidenceBadge confidence={0.85} />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <DataPanel title="Portfolio Performance (30 Days)">
                    <div className="h-64 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={pnlData}>
                                <defs>
                                    <linearGradient id="colorPnL" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                                        <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                                <XAxis
                                    dataKey="date"
                                    stroke="#94A3B8"
                                    tick={{fontSize: 10}}
                                    tickLine={false}
                                    interval={6}
                                />
                                <YAxis
                                    stroke="#94A3B8"
                                    tick={{fontSize: 10}}
                                    tickLine={false}
                                    tickFormatter={(val) => `$${(val/1000000).toFixed(1)}M`}
                                />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#1E293B', borderColor: '#334155', color: '#fff' }}
                                    formatter={(val: any) => [`$${(Number(val)/1000000).toFixed(2)}M`, 'Cumulative PnL']}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="pnl"
                                    stroke="#10B981"
                                    strokeWidth={2}
                                    fillOpacity={1}
                                    fill="url(#colorPnL)"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </DataPanel>

                <DataPanel title="Strategic Signals">
                     <div className="space-y-4">
                        <div className="p-3 bg-slate-800/50 rounded border-l-2 border-amber-500">
                            <h4 className="font-bold text-white text-sm">Geopolitical Risk Elevated</h4>
                            <p className="text-xs text-slate-400 mt-1">Middle East tensions increasing volatility in crude futures curve.</p>
                        </div>
                        <div className="p-3 bg-slate-800/50 rounded border-l-2 border-emerald-500">
                            <h4 className="font-bold text-white text-sm">Renewable Credit Opportunity</h4>
                            <p className="text-xs text-slate-400 mt-1">Regulatory change in EU favors current biofuel position.</p>
                        </div>
                     </div>
                </DataPanel>
            </div>
        </div>
    );
}
