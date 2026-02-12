"use client";

import React, { useState } from 'react';
import { PageContainer, SectionHeader, DataPanel, InlineMetricBlock, Badge, IconButton } from '@petrosquare/ui';
import { useData } from '../../../lib/hooks';
import { TopProducersResponse } from '@petrosquare/types';
import Link from 'next/link';

export default function ProductionPage() {
  const [country, setCountry] = useState<'US' | 'CA'>('US');
  const { data: regions, loading: loadingRegions } = useData<TopProducersResponse>(`/api/production/regions?country=${country}`);
  const { data: basins, loading: loadingBasins } = useData<any[]>('/api/production/basins'); // Type is any[] for now due to connector mock

  return (
    <main className="min-h-screen bg-background text-text">
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
                    <tr key={row.region.code} className="border-b border-border hover:bg-surface-highlight/5">
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
                            <div key={basin.name} className="flex items-center justify-between p-3 bg-surface-highlight/10 rounded border border-border">
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

                <DataPanel title="Well Drilldown (Sample)" loading={false}>
                    <div className="p-4 bg-surface-highlight/5 rounded border border-dashed border-border text-center">
                        <p className="text-sm text-muted mb-4">Select a well to view decline curves and production history.</p>
                        <Link
                            href="/api/production/well/12345"
                            target="_blank"
                            className="inline-flex items-center px-4 py-2 bg-primary/20 text-primary rounded text-sm hover:bg-primary/30 transition-colors"
                        >
                            View Sample Well API JSON
                        </Link>
                    </div>
                </DataPanel>
            </div>
        </div>
      </PageContainer>
    </main>
  );
}
