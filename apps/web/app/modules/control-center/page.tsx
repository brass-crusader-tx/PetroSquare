"use client";

import { useEffect, useState } from 'react';
import { KpiCard, PageContainer, DataPanel, Badge } from '@petrosquare/ui';

interface OverviewData {
  activeAlerts: number;
  criticalAlerts: number;
  avgHealth: number;
  totalAssets: number;
  timestamp: string;
}

export default function ControlCenterOverview() {
  const [data, setData] = useState<OverviewData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/control-center/overview')
      .then(res => {
        if (!res.ok) throw new Error('Failed to load overview data');
        return res.json();
      })
      .then(setData)
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <PageContainer>
        <div className="p-8 text-muted animate-pulse">Loading Control Center Overview...</div>
    </PageContainer>
  );

  if (error) return (
    <PageContainer>
        <div className="p-8 text-data-critical">Error: {error}</div>
    </PageContainer>
  );

  if (!data) return null;

  return (
    <PageContainer>
      <div className="flex justify-between items-end mb-8">
        <div>
            <h1 className="text-3xl font-medium text-white tracking-tight mb-2">Control Center</h1>
            <p className="text-muted text-sm">Real-time operational oversight and system health monitoring.</p>
        </div>
        <div className="flex items-center gap-3">
             <Badge status="live">System Active</Badge>
             <div className="text-xs text-muted font-mono bg-surface-highlight/20 px-2 py-1 rounded">
                Updated: {new Date(data.timestamp).toLocaleTimeString()}
             </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <KpiCard
          label="Total Assets"
          value={data.totalAssets}
          trend="neutral"
        />
        <KpiCard
          label="Avg Health Score"
          value={`${data.avgHealth}%`}
          trend={data.avgHealth > 90 ? 'positive' : data.avgHealth > 70 ? 'neutral' : 'negative'}
        />
        <KpiCard
          label="Active Alerts"
          value={data.activeAlerts}
          trend={data.activeAlerts > 0 ? 'negative' : 'positive'}
        />
        <KpiCard
          label="Critical Alerts"
          value={data.criticalAlerts}
          trend={data.criticalAlerts > 0 ? 'negative' : 'positive'}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DataPanel title="GIS Map View">
            <div className="h-64 flex items-center justify-center text-muted/50 text-sm italic bg-surface-highlight/5 rounded-xl border border-white/5 border-dashed">
                Interactive Map Component (Placeholder)
            </div>
        </DataPanel>

        <DataPanel title="Recent Activity">
            <div className="h-64 flex items-center justify-center text-muted/50 text-sm italic bg-surface-highlight/5 rounded-xl border border-white/5 border-dashed">
                Alert Feed & System Logs (See Alerts Tab)
            </div>
        </DataPanel>
      </div>
    </PageContainer>
  );
}
