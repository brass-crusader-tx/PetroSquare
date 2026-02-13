"use client";

import React, { useState, useEffect } from 'react';
import { PageContainer, SectionHeader, DataPanel, Badge, DetailDrawer, getStandardTabs, InsightCard } from '@petrosquare/ui';
import { useData } from '../../../lib/hooks';
import { RiskEvent, RiskAlert, MapOverlay } from '@petrosquare/types';

export default function RiskPage() {
  const { data: events, loading: loadingEvents } = useData<RiskEvent[]>('/api/risk/events');
  const { data: alerts, loading: loadingAlerts } = useData<RiskAlert[]>('/api/risk/alerts');
  const { data: overlays, loading: loadingOverlays } = useData<MapOverlay[]>('/api/risk/overlays');

  const [insight, setInsight] = useState<string | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<RiskEvent | null>(null);

  useEffect(() => {
      if (events && !insight) {
          fetchInsight(events);
      }
  }, [events]);

  const fetchInsight = async (data: RiskEvent[]) => {
      try {
          const highRisk = data.filter(e => e.severity === 'CRITICAL' || e.severity === 'HIGH');
          const prompt = `Analyze these risk events:
          ${highRisk.map(e => `${e.title} (${e.severity}): ${e.description}`).join('\n')}
          Provide a concise risk assessment and recommended watch items.`;

          const res = await fetch('/api/ai/insight', { method: 'POST', body: JSON.stringify({ prompt }) });
          const json = await res.json();
          if (json.text) setInsight(json.text);
      } catch(e) { console.error(e); }
  }

  return (
    <PageContainer>
        <SectionHeader
            title="Risk & Regulatory"
            description="Monitor geopolitical events, regulatory changes, and operational alerts."
        />

        {/* AI Insight */}
        <InsightCard insight={insight} loading={!insight && !events} className="mb-6" />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">

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
                            <div key={alert.id} className="bg-surface-inset/30 p-4 rounded border-l-4 border-l-error border border-border/50 hover:bg-surface-inset/50 transition-colors">
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
                            <div key={overlay.id} className="flex items-center justify-between p-3 bg-surface-inset/20 rounded border border-border">
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
                        {events?.map(event => (
                            <div
                                key={event.id}
                                className="border-b border-border pb-4 last:border-0 last:pb-0 cursor-pointer hover:bg-surface-highlight/5 p-2 rounded transition-colors"
                                onClick={() => setSelectedEvent(event)}
                            >
                                <div className="flex justify-between items-start mb-2">
                                    <StatusPill status={event.severity === 'HIGH' || event.severity === 'CRITICAL' ? 'error' : 'success'}>
                                        {event.severity}
                                    </StatusPill>
                                    <span className="text-xs text-muted font-mono">{event.date}</span>
                                </div>
                                <h4 className="text-base font-bold text-white mb-1">{event.title}</h4>
                                <div className="text-xs text-primary mb-2 uppercase tracking-wide">{event.source}</div>
                                <p className="text-sm text-muted leading-relaxed line-clamp-2">
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
            isOpen={!!selectedEvent}
            onClose={() => setSelectedEvent(null)}
            title={selectedEvent?.title || 'Event Details'}
            subtitle={selectedEvent?.source || 'Source Unknown'}
            source="Global Risk Intelligence"
            timestamp={selectedEvent?.date}
            tabs={getStandardTabs(selectedEvent, null, 'Risk Event')}
        />
    </PageContainer>
  );
}
