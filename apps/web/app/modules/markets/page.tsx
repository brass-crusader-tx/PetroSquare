"use client";

import React, { useState, useEffect } from 'react';
import { PageContainer, SectionHeader, DataPanel, InlineMetricBlock, Badge, DetailDrawer, getStandardTabs, InsightCard } from '@petrosquare/ui';
import { useData } from '../../../lib/hooks';
import { MarketBenchmark, FuturesCurve, CrackSpread, MarketSummary } from '@petrosquare/types';
import { useDensity } from '../../../context/DensityContext';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer
} from 'recharts';

function BenchmarkCard({ benchmark, onClick }: { benchmark: MarketBenchmark, onClick: () => void }) {
  const isUp = benchmark.change >= 0;
  return (
    <div
        className="bg-surface-highlight/20 p-4 rounded border border-border flex justify-between items-center cursor-pointer hover:border-primary/50 transition-colors"
        onClick={onClick}
    >
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

export default function MarketsPage() {
  const { density } = useDensity();
  const { data: summary, loading: loadingSummary } = useData<MarketSummary>('/api/markets/summary');
  const { data: curve, loading: loadingCurve } = useData<FuturesCurve>('/api/markets/curve?symbol=CL=F');
  const { data: spreads, loading: loadingSpreads } = useData<CrackSpread[]>('/api/markets/spreads');

  const [insight, setInsight] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<any | null>(null);

  useEffect(() => {
      if (summary && !insight) {
          fetchInsight(summary);
      }
  }, [summary]);

  const fetchInsight = async (data: MarketSummary) => {
      try {
          const prompt = `Generate a market pulse update based on:
          Top movers: ${data.top_movers.map(m => `${m.name} ${m.change_percent}%`).join(', ')}.
          Benchmarks: ${data.benchmarks.map(b => `${b.name} $${b.price}`).join(', ')}.
          Keep it brief and actionable.`;

          const res = await fetch('/api/ai/insight', { method: 'POST', body: JSON.stringify({ prompt }) });
          const json = await res.json();
          if (json.text) setInsight(json.text);
      } catch(e) { console.error(e); }
  }

  const padding = density === 'compact' ? 'p-4' : 'p-6';

  return (
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
                            <BenchmarkCard key={b.symbol} benchmark={b} onClick={() => setSelectedItem(b)} />
                        ))}
                    </div>
                </DataPanel>

                <InsightCard insight={insight || summary?.pulse_summary || null} loading={!insight && !summary} />
            </div>

            {/* Middle Column: Futures Curve */}
            <div className="lg:col-span-2 space-y-6">
                <DataPanel title="Futures Curve (WTI)" className={padding} loading={loadingCurve}>
                    <div className="h-64 w-full">
                        {curve && (
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={curve.points.map(p => ({ month: p.month, price: p.price }))}>
                                    <XAxis dataKey="month" stroke="#94A3B8" tick={{fontSize: 10}} />
                                    <YAxis domain={['auto', 'auto']} stroke="#94A3B8" tick={{fontSize: 10}} />
                                    <Tooltip contentStyle={{ backgroundColor: '#1E293B', borderColor: '#334155', color: '#fff' }} />
                                    <Line type="monotone" dataKey="price" stroke="#10B981" strokeWidth={2} dot={{fill: '#1E293B', stroke: '#10B981'}} />
                                </LineChart>
                            </ResponsiveContainer>
                        )}
                    </div>
                </DataPanel>

                <DataPanel title="Crack Spreads" className={padding} loading={loadingSpreads}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {spreads?.map(spread => (
                            <div
                                key={spread.name}
                                className="bg-surface-highlight/20 p-4 rounded border border-border cursor-pointer hover:border-primary/50 transition-colors"
                                onClick={() => setSelectedItem(spread)}
                            >
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

        <DetailDrawer
            isOpen={!!selectedItem}
            onClose={() => setSelectedItem(null)}
            title={selectedItem?.name || 'Details'}
            subtitle={selectedItem?.symbol || 'Market Instrument'}
            source="Market Data Feed"
            timestamp={new Date().toLocaleTimeString()}
            tabs={getStandardTabs(selectedItem, null, 'Market')}
        />
    </PageContainer>
  );
}
