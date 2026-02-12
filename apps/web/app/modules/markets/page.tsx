"use client";

import React from 'react';
import { PageContainer, PageHeader, FilterBar, DataPanel, KpiCard, DataMeta } from '@petrosquare/ui';
import { useData } from '../../../lib/hooks';
import { FuturesCurve, CrackSpread, MarketSummary } from '@petrosquare/types';

function SimpleLineChart({ data, width = 300, height = 150 }: { data: { x: string, y: number }[], width?: number, height?: number }) {
  if (!data || data.length === 0) return null;

  const maxY = Math.max(...data.map(d => d.y));
  const minY = Math.min(...data.map(d => d.y));
  const rangeY = maxY - minY || 1;

  const points = data.map((d, i) => {
    const x = (i / (data.length - 1)) * width;
    const y = height - ((d.y - minY) / rangeY) * height;
    return `${x},${y}`;
  }).join(' ');

  return (
    <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`} className="overflow-visible">
      <polyline
        fill="none"
        stroke="#10B981"
        strokeWidth="2"
        points={points}
      />
      {data.map((d, i) => {
         const x = (i / (data.length - 1)) * width;
         const y = height - ((d.y - minY) / rangeY) * height;
         return (
             <circle key={i} cx={x} cy={y} r="3" fill="#1E293B" stroke="#10B981" />
         );
      })}
    </svg>
  );
}

export default function MarketsPage() {
  const { data: summary, loading: loadingSummary, error: errorSummary } = useData<MarketSummary>('/api/markets/summary');
  const { data: curve, loading: loadingCurve, error: errorCurve } = useData<FuturesCurve>('/api/markets/curve?symbol=CL=F');
  const { data: spreads, loading: loadingSpreads, error: errorSpreads } = useData<CrackSpread[]>('/api/markets/spreads');

  return (
    <PageContainer>
        <PageHeader
            title="Markets & Trading Analytics"
            description="Global crude and product benchmarks, futures curves, and arbitrage spreads."
        />

        <FilterBar lastUpdated={new Date().toLocaleTimeString()}>
            {/* Stub filters */}
            <select className="bg-surface-inset border border-border rounded px-3 py-1 text-sm text-white focus:outline-none">
                <option>Global Benchmarks</option>
                <option>Regional Spot</option>
            </select>
            <select className="bg-surface-inset border border-border rounded px-3 py-1 text-sm text-white focus:outline-none">
                <option>Last 24 Hours</option>
                <option>Last 7 Days</option>
            </select>
        </FilterBar>

        {/* KPI Strip */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {loadingSummary && [...Array(4)].map((_, i) => <KpiCard key={i} title="Loading..." value="" loading />)}
            {summary?.benchmarks.map(b => (
                <KpiCard
                    key={b.symbol}
                    title={b.name}
                    value={b.price.toFixed(2)}
                    unit={b.unit}
                    change={b.change_percent}
                    changeLabel="24h"
                    status="neutral"
                />
            ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Futures Curve */}
            <DataPanel
                title="Futures Curve (WTI)"
                subtitle="Forward pricing curve for West Texas Intermediate"
                loading={loadingCurve}
                error={errorCurve ? "Failed to load futures data" : undefined}
                footer={<DataMeta source="CME Group" lastUpdated="Live" unit="USD/bbl" />}
                className="lg:col-span-2"
            >
                 <div className="h-64 w-full bg-surface-inset/10 rounded flex items-center justify-center p-4">
                    {curve && (
                        <div className="w-full h-full">
                            <SimpleLineChart
                                data={curve.points.map(p => ({ x: p.month, y: p.price }))}
                                width={800}
                                height={200}
                            />
                            <div className="flex justify-between mt-2 text-xs text-muted font-mono">
                                {curve.points.filter((_, i) => i % 3 === 0).map(p => (
                                    <span key={p.month}>{p.month}</span>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </DataPanel>

            {/* Market Pulse */}
             <DataPanel
                title="Market Pulse"
                subtitle="AI-generated market commentary"
                loading={loadingSummary}
                error={errorSummary ? "Failed to load pulse" : undefined}
                footer={<DataMeta source="PetroSquare AI" lastUpdated="Just now" />}
            >
                <div className="prose prose-invert prose-sm">
                    <p className="text-muted text-sm leading-relaxed">
                        {summary?.pulse_summary || "No commentary available."}
                    </p>
                </div>
            </DataPanel>

            {/* Crack Spreads */}
            <DataPanel
                title="Crack Spreads"
                subtitle="Refining margin indicators"
                loading={loadingSpreads}
                error={errorSpreads ? "Failed to load spreads" : undefined}
                footer={<DataMeta source="Platts" lastUpdated="15m delay" unit="USD/bbl" />}
            >
                <div className="space-y-4">
                    {spreads?.map(spread => (
                        <div key={spread.name} className="flex justify-between items-center border-b border-border/50 pb-2 last:border-0">
                            <div>
                                <div className="text-sm font-bold text-white">{spread.name}</div>
                                <div className="text-xs text-muted">Components: {spread.components.join(' / ')}</div>
                            </div>
                            <div className="text-right">
                                <div className="text-lg font-mono text-white">${spread.value.toFixed(2)}</div>
                                <div className={`text-xs font-mono ${spread.trend === 'up' ? 'text-success' : 'text-warning'}`}>
                                    {spread.trend.toUpperCase()}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </DataPanel>
        </div>
    </PageContainer>
  );
}
