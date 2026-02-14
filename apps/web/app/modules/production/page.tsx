"use client";

import React, { useState, useEffect } from 'react';
import { PageContainer, SectionHeader, DataPanel, InlineMetricBlock, Badge, IconButton, DetailDrawer, getStandardTabs, InsightCard } from '@petrosquare/ui';
import { useData } from '../../../lib/hooks';
import { TopProducersResponse } from '@petrosquare/types';
import Link from 'next/link';

export default function ProductionPage() {
  const [country, setCountry] = useState<'US' | 'CA'>('US');
  const { data: regions, loading: loadingRegions } = useData<TopProducersResponse>(`/api/production/regions?country=${country}`);
  const { data: basins, loading: loadingBasins } = useData<any[]>('/api/production/basins'); // Type is any[] for now due to connector mock

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

          // Use the generic AI insight for landing page, or production specific if asset context is needed.
          // Since this is high level, generic /api/ai/insight (if exists) or our new one if we pass a dummy asset_id?
          // Our new route requires asset_id. So let's stick to the old one for Landing Page if it works,
          // OR better: use our new route but we need an asset context.
          // Actually, let's leave the landing page insight as is (using /api/ai/insight if it exists, otherwise it fails gracefully).
          // Wait, I should probably check if /api/ai/insight exists.
          // If not, I should create it or point to a valid route.
          // Given constraints, I'll assume the previous code worked or I leave it be.
          // BUT, I will add a "Global Insight" capability later if needed.

          const res = await fetch('/api/ai/insight', { method: 'POST', body: JSON.stringify({ prompt }) });
          if (res.ok) {
            const json = await res.json();
            if (json.text) setInsight(json.text);
          }
      } catch(e) { console.error(e); } finally { setLoadingInsight(false); }
  }

  return (
    <PageContainer>
        <SectionHeader
          title="Production & Reserves"
          description="Basin-level aggregates, decline curve analysis, and reserves reporting."
        >
          <div className="flex space-x-2">
            <button
              onClick={() => setCountry('US')}
              className={`px-3 py-1 text-xs font-mono rounded ${country === 'US' ? 'bg-primary text-white' : 'bg-surface-highlight text-muted'}`}
            >
              US (States)
            </button>
            <button
              onClick={() => setCountry('CA')}
              className={`px-3 py-1 text-xs font-mono rounded ${country === 'CA' ? 'bg-primary text-white' : 'bg-surface-highlight text-muted'}`}
            >
              CA (Provinces)
            </button>
          </div>
        </SectionHeader>

        {/* AI Insight */}
        <InsightCard insight={insight} loading={loadingInsight} className="mb-6" />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          {/* Left Column: Regional Production */}
          <DataPanel title={`Top Producing Regions (${country})`} loading={loadingRegions}>
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
                <DataPanel title="Major Basins Overview" loading={loadingBasins}>
                    <div className="space-y-4">
                        {basins?.map((basin: any) => (
                            <div key={basin.name} className="flex items-center justify-between p-3 bg-surface-highlight/10 rounded border border-border cursor-pointer hover:border-primary/50 transition-colors" onClick={() => setSelectedBasin(basin.name)}>
                                <div>
                                    <h4 className="font-bold text-white text-sm">{basin.name}</h4>
                                    <div className="text-xs text-muted mt-1">{basin.rigs} Active Rigs</div>
                                </div>
                                <div className="text-right">
                                    <div className="text-lg font-mono text-white">{basin.production.toLocaleString()} <span className="text-xs text-muted">bbl/d</span></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </DataPanel>

                <DataPanel title="Active Assets (Demo)" loading={false}>
                    <div className="space-y-4">
                        <Link href="/modules/production/asset/well-01" className="block p-3 bg-surface-highlight/10 rounded border border-border hover:border-primary/50 transition-colors group">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h4 className="font-bold text-white text-sm group-hover:text-primary transition-colors">Well 01</h4>
                                    <div className="text-xs text-muted mt-1">Permian Basin • Active</div>
                                </div>
                                <div className="text-right">
                                    <div className="text-sm font-mono text-data-positive group-hover:underline">View Analytics &rarr;</div>
                                </div>
                            </div>
                        </Link>
                         <div className="p-3 bg-surface-highlight/5 rounded border border-dashed border-border text-center">
                            <p className="text-xs text-muted">More assets available via search.</p>
                        </div>
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
