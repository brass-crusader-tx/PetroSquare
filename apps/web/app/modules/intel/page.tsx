"use client";

import React from 'react';
import { PageContainer, PageHeader, FilterBar, DataPanel, KpiCard, DataMeta, StatusPill, SkeletonTable, SkeletonCard } from '@petrosquare/ui';
import { useData } from '../../../lib/hooks';
import { IntelDeal, IntelInfrastructure, IntelRigCount } from '@petrosquare/types';

export default function IntelPage() {
  const { data: deals, loading: loadingDeals } = useData<IntelDeal[]>('/api/intel/deals');
  const { data: infra, loading: loadingInfra } = useData<IntelInfrastructure[]>('/api/intel/infrastructure');
  const { data: rigs, loading: loadingRigs } = useData<IntelRigCount[]>('/api/intel/rigs');

  const totalDealValue = deals?.reduce((acc, d) => acc + d.value_usd_m, 0) || 0;
  const activeRigs = rigs?.reduce((acc, r) => acc + r.count, 0) || 0;

  return (
      <PageContainer>
        <PageHeader
            title="Market Intelligence"
            description="Track M&A activity, infrastructure status, and drilling rig counts."
        />

        <FilterBar lastUpdated="Weekly Report">
             <select className="bg-surface-inset border border-border rounded px-3 py-1.5 text-sm text-white focus:outline-none">
                <option>Global</option>
                <option>North America</option>
             </select>
        </FilterBar>

        {/* KPI Strip */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
             <KpiCard
                title="Total M&A Value"
                value={`$${(totalDealValue / 1000).toFixed(1)}B`}
                unit="YTD"
                change={15.2}
                status="success"
                loading={loadingDeals}
             />
             <KpiCard
                title="Active Rig Count"
                value={activeRigs}
                unit="Units"
                change={-5}
                status="warning"
                loading={loadingRigs}
             />
             <KpiCard
                title="Infra Uptime"
                value="99.2%"
                unit="Global"
                status="success"
             />
              <KpiCard
                title="Project Starts"
                value="12"
                unit="Q3 2024"
                status="neutral"
             />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            {/* Left Column: M&A */}
            <div className="space-y-6">
                <DataPanel
                    title="M&A Watchlist"
                    subtitle="Recent transactions and rumors"
                    loading={loadingDeals}
                    footer={<DataMeta source="Financial Filings" />}
                >
                    <div className="space-y-4">
                        {loadingDeals ? <SkeletonCard /> : deals?.map(deal => (
                            <div key={deal.id} className="bg-surface-inset/20 p-4 rounded border border-border hover:bg-surface-inset/40 transition-colors group">
                                <div className="flex justify-between items-start mb-2">
                                    <StatusPill status="info">{deal.asset_type}</StatusPill>
                                    <span className="text-xs text-muted font-mono">{deal.date}</span>
                                </div>
                                <div className="text-sm font-bold text-white mb-1 group-hover:text-primary transition-colors">
                                    {deal.buyer} <span className="text-muted font-normal">acquires</span> {deal.seller}
                                </div>
                                <div className="text-lg font-mono text-success mb-2">
                                    ${(deal.value_usd_m / 1000).toFixed(1)}B
                                </div>
                                <p className="text-xs text-muted leading-relaxed">
                                    {deal.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </DataPanel>

                <DataPanel
                    title="Rig Count Overview"
                    subtitle="Weekly drilling activity by region"
                    loading={loadingRigs}
                    footer={<DataMeta source="Baker Hughes" lastUpdated="Friday" />}
                >
                     <div className="grid grid-cols-2 gap-4">
                        {loadingRigs ? [...Array(4)].map((_, i) => <div key={i} className="h-16 bg-surface-highlight rounded animate-pulse"></div>) : rigs?.map(r => (
                             <div key={r.region} className="bg-surface-inset/20 p-3 rounded border border-border flex justify-between items-center">
                                 <div>
                                     <div className="text-xs text-muted uppercase font-bold tracking-wider">{r.region}</div>
                                     <div className="text-xl font-mono text-white font-bold">{r.count}</div>
                                 </div>
                                 <div className={`text-xs font-mono px-2 py-1 rounded ${r.change_weekly >= 0 ? 'bg-success/10 text-success' : 'bg-error/10 text-error'}`}>
                                     {r.change_weekly > 0 ? '+' : ''}{r.change_weekly}
                                 </div>
                             </div>
                        ))}
                     </div>
                </DataPanel>
            </div>

            {/* Right Column: Infrastructure */}
            <div className="space-y-6">
                <DataPanel
                    title="Infrastructure Status"
                    subtitle="Key midstream and downstream facilities"
                    loading={loadingInfra}
                    footer={<DataMeta source="Midstream Reports" />}
                    className="h-full"
                >
                    <div className="overflow-x-auto">
                        {loadingInfra ? <SkeletonTable /> : (
                            <table className="w-full text-sm text-left border-collapse">
                                <thead className="text-xs text-muted uppercase bg-surface-inset border-b border-border sticky top-0">
                                    <tr>
                                        <th className="px-6 py-3 font-semibold tracking-wider">Facility</th>
                                        <th className="px-6 py-3 font-semibold tracking-wider">Type</th>
                                        <th className="px-6 py-3 text-right font-semibold tracking-wider">Capacity</th>
                                        <th className="px-6 py-3 text-center font-semibold tracking-wider">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border/50">
                                    {infra?.map((item) => (
                                        <tr key={item.id} className="hover:bg-surface-highlight/10 transition-colors">
                                            <td className="px-6 py-3">
                                                <div className="font-medium text-white">{item.name}</div>
                                                <div className="text-xs text-muted">{item.location}</div>
                                            </td>
                                            <td className="px-6 py-3 text-xs font-mono text-muted uppercase">{item.type}</td>
                                            <td className="px-6 py-3 text-right font-mono text-white">
                                                {item.capacity.toLocaleString()} <span className="text-xs text-muted">{item.unit}</span>
                                            </td>
                                            <td className="px-6 py-3 text-center">
                                                <StatusPill status={item.status === 'OPERATIONAL' ? 'success' : item.status === 'MAINTENANCE' ? 'warning' : 'info'}>
                                                    {item.status}
                                                </StatusPill>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </DataPanel>
            </div>
        </div>
      </PageContainer>
  );
}
