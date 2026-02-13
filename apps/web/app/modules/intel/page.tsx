"use client";

import React from 'react';
import { PageContainer, SectionHeader, DataPanel, InlineMetricBlock, Badge } from '@petrosquare/ui';
import { useData } from '../../../lib/hooks';
import { IntelDeal, IntelInfrastructure, IntelRigCount } from '@petrosquare/types';

export default function IntelPage() {
  const { data: deals, loading: loadingDeals } = useData<IntelDeal[]>('/api/intel/deals');
  const { data: infra, loading: loadingInfra } = useData<IntelInfrastructure[]>('/api/intel/infrastructure');
  const { data: rigs, loading: loadingRigs } = useData<IntelRigCount[]>('/api/intel/rigs');

  return (
    <main className="min-h-screen bg-background text-text">
      <PageContainer>
        <SectionHeader
            title="Market Intelligence"
            description="Track M&A activity, infrastructure status, and drilling rig counts."
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">

            {/* Left Column: M&A */}
            <div className="lg:col-span-1 space-y-6">
                <DataPanel title="M&A Watchlist" loading={loadingDeals}>
                    <div className="space-y-4">
                        {deals?.map(deal => (
                            <div key={deal.id} className="bg-surface-highlight/10 p-4 rounded border border-border">
                                <div className="flex justify-between items-start mb-2">
                                    <Badge status="live">{deal.asset_type}</Badge>
                                    <span className="text-xs text-muted font-mono">{deal.date}</span>
                                </div>
                                <div className="text-sm font-bold text-white mb-1">
                                    {deal.buyer} acquires {deal.seller}
                                </div>
                                <div className="text-lg font-mono text-data-positive mb-2">
                                    ${(deal.value_usd_m / 1000).toFixed(1)}B
                                </div>
                                <p className="text-xs text-muted leading-relaxed">
                                    {deal.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </DataPanel>

                <DataPanel title="Rig Count Overview" loading={loadingRigs}>
                     <div className="grid grid-cols-2 gap-4">
                        {rigs?.map(r => (
                             <div key={r.region} className="bg-surface-highlight/10 p-3 rounded border border-border flex justify-between items-center">
                                 <div>
                                     <div className="text-xs text-muted uppercase">{r.region}</div>
                                     <div className="text-xl font-mono text-white font-bold">{r.count}</div>
                                 </div>
                                 <div className={`text-xs font-mono ${r.change_weekly >= 0 ? 'text-data-positive' : 'text-data-critical'}`}>
                                     {r.change_weekly > 0 ? '+' : ''}{r.change_weekly}
                                 </div>
                             </div>
                        ))}
                     </div>
                </DataPanel>
            </div>

            {/* Right Column: Infrastructure */}
            <div className="lg:col-span-1 space-y-6">
                <DataPanel title="Infrastructure Status" loading={loadingInfra}>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="text-xs text-muted uppercase bg-surface-highlight/10 border-b border-border">
                                <tr>
                                    <th className="px-4 py-3">Facility</th>
                                    <th className="px-4 py-3">Type</th>
                                    <th className="px-4 py-3 text-right">Capacity</th>
                                    <th className="px-4 py-3 text-center">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {infra?.map((item) => (
                                    <tr key={item.id} className="border-b border-border hover:bg-surface-highlight/5">
                                        <td className="px-4 py-3">
                                            <div className="font-medium text-white">{item.name}</div>
                                            <div className="text-xs text-muted">{item.location}</div>
                                        </td>
                                        <td className="px-4 py-3 text-xs font-mono text-muted">{item.type}</td>
                                        <td className="px-4 py-3 text-right font-mono text-white">
                                            {item.capacity.toLocaleString()} <span className="text-xs text-muted">{item.unit}</span>
                                        </td>
                                        <td className="px-4 py-3 text-center">
                                            <Badge status={item.status === 'OPERATIONAL' ? 'live' : item.status === 'MAINTENANCE' ? 'declared' : 'beta'}>
                                                {item.status}
                                            </Badge>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </DataPanel>
            </div>
        </div>
      </PageContainer>
    </main>
  );
}
