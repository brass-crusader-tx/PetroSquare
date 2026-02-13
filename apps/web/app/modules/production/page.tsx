"use client";

import React, { useState, useEffect } from 'react';
import { PageContainer, SectionHeader, DataPanel, InlineMetricBlock, Badge, IconButton, DetailDrawer, getStandardTabs, InsightCard } from '@petrosquare/ui';
import { useData } from '../../../lib/hooks';
import { TopProducersResponse } from '@petrosquare/types';
import Link from 'next/link';

export default function ProductionPage() {
  const [country, setCountry] = useState<'US' | 'CA'>('US');
  const { data: regions, loading: loadingRegions } = useData<TopProducersResponse>(`/api/production/regions?country=${country}`);
  // In a real app, type would be specific, but using any[] as per original file
  const { data: basins, loading: loadingBasins } = useData<any[]>('/api/production/basins');

  // Calculate total production for KPI
  const totalProduction = regions?.rows.reduce((acc, row) => acc + row.latest_value, 0) || 0;
  const topRegion = regions?.rows[0];

  const [insight, setInsight] = useState<string | null>(null);
  const [loadingInsight, setLoadingInsight] = useState(false);
  const [selectedBasin, setSelectedBasin] = useState<string | null>(null);

  useEffect(() => {
      if (regions && !insight && !loadingInsight) {
          fetchInsight(regions);
      }
  }, [regions]);

  const fetchInsight = async (data: TopProducersResponse) => {
      setLoadingInsight(true);
      try {
          const prompt = `Analyze the production data for ${data.kind}.
          Top region: ${data.rows[0]?.region.name} with ${data.rows[0]?.latest_value} ${data.units}.
          Provide a brief executive summary on production trends.`;

          const res = await fetch('/api/ai/insight', { method: 'POST', body: JSON.stringify({ prompt }) });
          const json = await res.json();
          if (json.text) setInsight(json.text);
      } catch(e) { console.error(e); } finally { setLoadingInsight(false); }
  }

  return (
    <PageContainer>
        <SectionHeader
          title="Production & Reserves"
          description="Basin-level aggregates, decline curve analysis, and reserves reporting."
        />

        <FilterBar lastUpdated="Daily">
            <div className="flex bg-surface-inset rounded p-1 border border-border">
                <button
                    onClick={() => setCountry('US')}
                    className={`px-3 py-1 text-xs font-mono rounded transition-colors ${country === 'US' ? 'bg-primary text-white shadow-sm' : 'text-muted hover:text-white'}`}
                >
                    US (States)
                </button>
                <button
                    onClick={() => setCountry('CA')}
                    className={`px-3 py-1 text-xs font-mono rounded transition-colors ${country === 'CA' ? 'bg-primary text-white shadow-sm' : 'text-muted hover:text-white'}`}
                >
                    CA (Provinces)
                </button>
            </div>
             <div className="h-8 w-px bg-border mx-2"></div>
             <select className="bg-surface-inset border border-border rounded px-3 py-1.5 text-sm text-white focus:outline-none">
                <option>Crude Oil</option>
                <option>Natural Gas</option>
             </select>
        </FilterBar>

        {/* KPI Strip */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
             <KpiCard
                title={`Total ${country} Production`}
                value={totalProduction.toLocaleString()}
                unit={regions?.units || 'bbl/d'}
                change={2.4} // Mock
                changeLabel="vs Prev"
                status="success"
                loading={loadingRegions}
             />
             <KpiCard
                title="Top Region"
                value={topRegion?.region.name || '—'}
                unit={topRegion ? `#${topRegion.rank}` : undefined}
                status="neutral"
                loading={loadingRegions}
             />
             <KpiCard
                title="Active Rigs"
                value={basins?.reduce((acc: number, b: any) => acc + b.rigs, 0) || '—'}
                unit="Count"
                change={-1}
                status="warning"
                loading={loadingBasins}
             />
             <KpiCard
                title="Reporting Status"
                value="98%"
                unit="Complete"
                status="success"
             />
        </div>

        {/* AI Insight */}
        <InsightCard insight={insight} loading={loadingInsight} className="mb-6" />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          {/* Left Column: Regional Production */}
          <DataPanel
            title={`Top Producing Regions (${country})`}
            subtitle="Ranked by volume"
            loading={loadingRegions}
            footer={<DataMeta source="EIA / CER" lastUpdated="Monthly Report" />}
            className="h-full"
          >
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-muted uppercase bg-surface-highlight/10 border-b border-border">
                  <tr>
                    <th className="px-4 py-3">Rank</th>
                    <th className="px-4 py-3">Region</th>
                    <th className="px-4 py-3 text-right">Production ({regions?.units})</th>
                  </tr>
                </thead>
                <tbody>
                  {regions?.rows.map((row) => (
                    <tr key={row.region.code} className="border-b border-border hover:bg-surface-highlight/5 cursor-pointer" onClick={() => setSelectedBasin(row.region.name)}>
                      <td className="px-4 py-3 font-mono text-muted">#{row.rank}</td>
                      <td className="px-4 py-3 font-medium text-white">{row.region.name}</td>
                      <td className="px-4 py-3 text-right font-mono text-data-positive">
                        {row.latest_value.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </DataPanel>

            {/* Right Column: Basins & Wells */}
            <div className="space-y-6">
                <DataPanel
                    title="Major Basins Overview"
                    subtitle="Activity and output by geological basin"
                    loading={loadingBasins}
                    footer={<DataMeta source="DrillingInfo" lastUpdated="Weekly" />}
                >
                    <div className="space-y-4">
                        {basins?.map((basin: any) => (
                            <div key={basin.name} className="flex items-center justify-between p-3 bg-surface-highlight/10 rounded border border-border cursor-pointer hover:border-primary/50 transition-colors" onClick={() => setSelectedBasin(basin.name)}>
                                <div>
                                    <h4 className="font-bold text-white text-sm">{basin.name}</h4>
                                    <div className="text-xs text-muted mt-1 flex items-center">
                                        <span className="w-2 h-2 rounded-full bg-warning mr-2"></span>
                                        {basin.rigs} Active Rigs
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-lg font-mono text-white group-hover:text-primary transition-colors">{basin.production.toLocaleString()}</div>
                                    <div className="text-xs text-muted">bbl/d</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </DataPanel>

                <DataPanel
                    title="Well Drilldown"
                    subtitle="Access granular well data"
                    loading={false}
                    footer={<DataMeta source="Internal DB" />}
                >
                    <div className="p-8 border-2 border-dashed border-border rounded flex flex-col items-center justify-center text-center bg-surface-inset/10">
                        <div className="text-4xl mb-4 opacity-20">🕳️</div>
                        <p className="text-sm text-muted mb-6 max-w-xs">Select a well from the map or enter an API number to view decline curves and production history.</p>
                        <Link
                            href="/api/production/well/12345"
                            target="_blank"
                            className="inline-flex items-center px-4 py-2 bg-primary text-white rounded text-sm font-medium hover:bg-blue-600 transition-colors shadow-lg shadow-primary/20"
                        >
                            View Sample Well JSON →
                        </Link>
                    </div>
                </DataPanel>
            </div>
        </div>

        <DetailDrawer
            isOpen={!!selectedBasin}
            onClose={() => setSelectedBasin(null)}
            title={`${selectedBasin} Details`}
            subtitle="Basin Analysis"
            source="Production DB"
            timestamp={new Date().toLocaleTimeString()}
            tabs={getStandardTabs({ name: selectedBasin, value: '5.8M', units: 'bbl/d' })}
        />
    </PageContainer>
  );
}
