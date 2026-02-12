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
            <div className="lg:col-span-1 space-y-6">
                 <DataPanel title="Operational Alerts" loading={loadingAlerts}>
                    <div className="space-y-4">
                        {alerts?.map(alert => (
                            <div key={alert.id} className="bg-surface-highlight/10 p-4 rounded border border-l-4 border-l-data-critical border-border">
                                <div className="flex justify-between items-start mb-2">
                                    <span className="text-xs font-bold uppercase text-data-critical tracking-wider">{alert.type}</span>
                                    <span className="text-xs text-muted font-mono">{alert.timestamp.split('T')[0]}</span>
                                </div>
                                <p className="text-sm font-medium text-white mb-2">
                                    {alert.message}
                                </p>
                                <div className="flex space-x-2">
                                    {alert.asset_ids.map(id => (
                                        <Badge key={id} status="declared">{id}</Badge>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </DataPanel>

                <DataPanel title="Risk Overlays (GIS Integration)" loading={loadingOverlays}>
                    <div className="space-y-2">
                        {overlays?.map(overlay => (
                            <div key={overlay.id} className="flex items-center justify-between p-3 bg-surface-highlight/10 rounded border border-border">
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
            <div className="lg:col-span-1 space-y-6">
                <DataPanel title="Regulatory & Geopolitical Feed" loading={loadingEvents}>
                    <div className="space-y-6">
                        {events?.map(event => (
                            <div
                                key={event.id}
                                className="border-b border-border pb-4 last:border-0 last:pb-0 cursor-pointer hover:bg-surface-highlight/5 p-2 rounded transition-colors"
                                onClick={() => setSelectedEvent(event)}
                            >
                                <div className="flex justify-between items-start mb-2">
                                    <Badge status={event.severity === 'HIGH' || event.severity === 'CRITICAL' ? 'error' : 'live'}>
                                        {event.severity}
                                    </Badge>
                                    <span className="text-xs text-muted font-mono">{event.date}</span>
                                </div>
                                <h4 className="text-base font-bold text-white mb-1">{event.title}</h4>
                                <div className="text-xs text-primary mb-2 uppercase tracking-wide">{event.source}</div>
                                <p className="text-sm text-muted leading-relaxed line-clamp-2">
                                    {event.description}
                                </p>
                                <div className="mt-3 flex space-x-2">
                                    {event.affected_regions.map(r => (
                                        <span key={r} className="text-[10px] px-2 py-0.5 bg-surface-highlight rounded text-muted font-mono">
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
