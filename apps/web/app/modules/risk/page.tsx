"use client";

import React, { useState } from 'react';
import { PageContainer, PageHeader, FilterBar, DataPanel, KpiCard, DataMeta, StatusPill, SkeletonCard, DetailDrawer } from '@petrosquare/ui';
import { useData } from '../../../lib/hooks';
import { RiskEvent, RiskAlert, MapOverlay } from '@petrosquare/types';

export default function RiskPage() {
  const { data: events, loading: loadingEvents } = useData<RiskEvent[]>('/api/risk/events');
  const { data: alerts, loading: loadingAlerts } = useData<RiskAlert[]>('/api/risk/alerts');
  const { data: overlays, loading: loadingOverlays } = useData<MapOverlay[]>('/api/risk/overlays');

  const [drawer, setDrawer] = useState<{ isOpen: boolean, data: any, type: string, title: string }>({
      isOpen: false, data: null, type: '', title: ''
  });

  const openDrawer = (title: string, type: string, data: any) => {
      setDrawer({ isOpen: true, title, type, data });
  };

  const criticalEvents = events?.filter(e => e.severity === 'CRITICAL').length || 0;
  const activeAlerts = alerts?.length || 0;

  return (
      <PageContainer>
        <PageHeader
            title="Risk & Regulatory"
            description="Monitor geopolitical events, regulatory changes, and operational alerts."
        />

        <FilterBar lastUpdated="Live Feed">
             <select className="bg-surface-inset border border-border rounded px-3 py-1.5 text-sm text-white focus:outline-none">
                <option>All Regions</option>
                <option>Middle East</option>
                <option>North America</option>
             </select>
             <div className="h-8 w-px bg-border mx-2"></div>
             <div className="flex items-center space-x-2 text-sm text-muted">
                 <input type="checkbox" id="critical-only" className="rounded bg-surface-inset border-border text-primary focus:ring-0" />
                 <label htmlFor="critical-only">Critical Only</label>
             </div>
        </FilterBar>

        {/* KPI Strip */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
             <KpiCard
                title="Critical Events"
                value={criticalEvents}
                unit="Last 24h"
                status={criticalEvents > 0 ? 'error' : 'success'}
                loading={loadingEvents}
                onClick={() => openDrawer('Critical Events', 'Risk Stats', { critical: criticalEvents, total: events?.length })}
             />
             <KpiCard
                title="Active Alerts"
                value={activeAlerts}
                unit="Operational"
                status={activeAlerts > 0 ? 'warning' : 'success'}
                loading={loadingAlerts}
                onClick={() => openDrawer('Active Alerts', 'Risk Stats', { active: activeAlerts, total: alerts?.length })}
             />
             <KpiCard
                title="Geopolitics Score"
                value="High"
                unit="Global Risk"
                status="error"
                onClick={() => openDrawer('Geopolitics Score', 'Risk Metric', { score: 'High', trend: 'Worsening', region: 'Global' })}
             />
             <KpiCard
                title="Regulatory Compliance"
                value="98.5%"
                unit="On Track"
                status="success"
                onClick={() => openDrawer('Regulatory Compliance', 'Compliance Metric', { percentage: 98.5, status: 'Compliant' })}
             />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            {/* Left Column: Alerts & Overlays */}
            <div className="space-y-6">
                 <DataPanel
                    title="Operational Alerts"
                    subtitle="Real-time asset notifications"
                    loading={loadingAlerts}
                    footer={<DataMeta source="SCADA / IoT" lastUpdated="Real-time" />}
                >
                    <div className="space-y-4">
                        {loadingAlerts ? <SkeletonCard /> : alerts?.map(alert => (
                            <div
                                key={alert.id}
                                className="bg-surface-inset/30 p-4 rounded border-l-4 border-l-error border border-border/50 hover:bg-surface-inset/50 transition-colors cursor-pointer"
                                onClick={() => openDrawer(`Alert: ${alert.type}`, 'Operational Alert', alert)}
                            >
                                <div className="flex justify-between items-start mb-2">
                                    <span className="text-xs font-bold uppercase text-error tracking-wider">{alert.type}</span>
                                    <span className="text-xs text-muted font-mono">{new Date(alert.timestamp).toLocaleDateString()}</span>
                                </div>
                                <p className="text-sm font-medium text-white mb-2">
                                    {alert.message}
                                </p>
                                <div className="flex space-x-2">
                                    {alert.asset_ids.map(id => (
                                        <StatusPill key={id} status="neutral">{id}</StatusPill>
                                    ))}
                                </div>
                            </div>
                        ))}
                        {alerts?.length === 0 && <div className="text-center text-muted text-sm py-8">No active alerts.</div>}
                    </div>
                </DataPanel>

                <DataPanel
                    title="Risk Overlays"
                    subtitle="GIS layers integration status"
                    loading={loadingOverlays}
                    footer={<DataMeta source="GIS Module" />}
                >
                    <div className="space-y-2">
                        {overlays?.map(overlay => (
                            <div
                                key={overlay.id}
                                className="flex items-center justify-between p-3 bg-surface-inset/20 rounded border border-border cursor-pointer hover:bg-surface-inset/40 transition-colors"
                                onClick={() => openDrawer(overlay.name, 'Map Overlay', overlay)}
                            >
                                <div className="flex items-center space-x-3">
                                    <div className={`w-3 h-3 rounded-full ${overlay.visible ? 'bg-primary' : 'bg-muted'}`}></div>
                                    <span className="text-sm font-medium text-white">{overlay.name}</span>
                                </div>
                                <span className="text-xs text-muted font-mono">{overlay.type}</span>
                            </div>
                        ))}
                    </div>
                </DataPanel>
            </div>

            {/* Right Column: Regulatory Feed */}
            <div className="space-y-6">
                <DataPanel
                    title="Regulatory & Geopolitical Feed"
                    subtitle="Global news and legislative updates"
                    loading={loadingEvents}
                    footer={<DataMeta source="Reuters / Bloomberg" lastUpdated="10m ago" />}
                    className="h-full"
                >
                    <div className="space-y-6">
                        {loadingEvents ? [...Array(3)].map((_, i) => <SkeletonCard key={i} />) : events?.map(event => (
                            <div
                                key={event.id}
                                className="border-b border-border pb-4 last:border-0 last:pb-0 group cursor-pointer hover:bg-surface-highlight/5 -mx-2 px-2 rounded transition-colors"
                                onClick={() => openDrawer(event.title, 'Geopolitical Event', event)}
                            >
                                <div className="flex justify-between items-start mb-2">
                                    <StatusPill status={event.severity === 'HIGH' || event.severity === 'CRITICAL' ? 'error' : 'success'}>
                                        {event.severity}
                                    </StatusPill>
                                    <span className="text-xs text-muted font-mono">{event.date}</span>
                                </div>
                                <h4 className="text-base font-bold text-white mb-1 group-hover:text-primary transition-colors">{event.title}</h4>
                                <div className="text-xs text-primary mb-2 uppercase tracking-wide opacity-80">{event.source}</div>
                                <p className="text-sm text-muted leading-relaxed">
                                    {event.description}
                                </p>
                                <div className="mt-3 flex space-x-2">
                                    {event.affected_regions.map(r => (
                                        <span key={r} className="text-[10px] px-2 py-0.5 bg-surface-highlight rounded text-muted font-mono uppercase">
                                            {r}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </DataPanel>
            </div>
        </div>

        <DetailDrawer
            isOpen={drawer.isOpen}
            onClose={() => setDrawer({...drawer, isOpen: false})}
            title={drawer.title}
            type={drawer.type}
            data={drawer.data}
        />
      </PageContainer>
  );
}
