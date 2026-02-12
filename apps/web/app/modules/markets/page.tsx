"use client";

import React from 'react';
import { PageContainer, SectionHeader, DataPanel, InlineMetricBlock, Badge } from '@petrosquare/ui';
import { useData } from '../../../lib/hooks';
import { MarketBenchmark, FuturesCurve, CrackSpread, MarketSummary } from '@petrosquare/types';
import { useDensity } from '../../../context/DensityContext';

function BenchmarkCard({ benchmark }: { benchmark: MarketBenchmark }) {
  const isUp = benchmark.change >= 0;
  return (
    <div className="bg-surface-highlight/20 p-4 rounded border border-border flex justify-between items-center">
      <div>
        <div className="text-xs text-muted font-mono">{benchmark.symbol}</div>
        <div className="text-sm font-bold text-white">{benchmark.name}</div>
      </div>
      <div className="text-right">
        <div className="text-lg font-mono text-white">
          {benchmark.price.toFixed(2)} <span className="text-xs text-muted">{benchmark.unit}</span>
        </div>
        <div className={`text-xs font-mono ${isUp ? 'text-data-positive' : 'text-data-critical'}`}>
          {isUp ? '▲' : '▼'} {Math.abs(benchmark.change).toFixed(2)} ({benchmark.change_percent.toFixed(2)}%)
        </div>
      </div>
    </div>
  );
}

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
  const { density } = useDensity();
  const { data: summary, loading: loadingSummary } = useData<MarketSummary>('/api/markets/summary');
  const { data: curve, loading: loadingCurve } = useData<FuturesCurve>('/api/markets/curve?symbol=CL=F');
  const { data: spreads, loading: loadingSpreads } = useData<CrackSpread[]>('/api/markets/spreads');

  const padding = density === 'compact' ? 'p-4' : 'p-6';

  return (
    <main className="min-h-screen bg-background text-text">
      <PageContainer>
        <SectionHeader
            title="Markets & Trading Analytics"
            description="Global crude and product benchmarks, futures curves, and arbitrage spreads."
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
            {/* Left Column: Benchmarks */}
            <div className="lg:col-span-1 space-y-6">
                <DataPanel title="Key Benchmarks" className={padding} loading={loadingSummary}>
                    <div className="space-y-4">
                        {summary?.benchmarks.map(b => (
                            <BenchmarkCard key={b.symbol} benchmark={b} />
                        ))}
                    </div>
                </DataPanel>

                <DataPanel title="Market Pulse" className={padding} loading={loadingSummary}>
                     <div className="prose prose-invert prose-sm">
                         <p className="text-muted text-sm leading-relaxed">
                             {summary?.pulse_summary}
                         </p>
                     </div>
                </DataPanel>
            </div>

            {/* Middle Column: Futures Curve */}
            <div className="lg:col-span-2 space-y-6">
                <DataPanel title="Futures Curve (WTI)" className={padding} loading={loadingCurve}>
                    <div className="h-64 w-full bg-surface-highlight/10 rounded flex items-center justify-center p-4">
                        {curve && (
                            <div className="w-full h-full">
                                <SimpleLineChart
                                    data={curve.points.map(p => ({ x: p.month, y: p.price }))}
                                    width={600}
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

                <DataPanel title="Crack Spreads" className={padding} loading={loadingSpreads}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {spreads?.map(spread => (
                            <div key={spread.name} className="bg-surface-highlight/20 p-4 rounded border border-border">
                                <div className="flex justify-between items-start mb-2">
                                    <h4 className="text-sm font-bold text-white">{spread.name}</h4>
                                    <Badge status={spread.trend === 'up' ? 'live' : 'declared'}>{spread.trend.toUpperCase()}</Badge>
                                </div>
                                <div className="text-2xl font-mono text-white">
                                    ${spread.value.toFixed(2)} <span className="text-xs text-muted">{spread.unit}</span>
                                </div>
                                <div className="mt-2 text-xs text-muted">
                                    Components: {spread.components.join(' / ')}
                                </div>
                            </div>
                        ))}
                    </div>
                </DataPanel>
            </div>
        </div>
      </PageContainer>
    </main>
  );
}
