"use client";

import { useEffect, useState } from 'react';
import { KpiCard } from '@petrosquare/ui';

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

  if (loading) return <div className="p-8 text-slate-400 animate-pulse">Loading Control Center Overview...</div>;
  if (error) return <div className="p-8 text-red-500">Error: {error}</div>;
  if (!data) return null;

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white tracking-tight">Control Center Dashboard</h1>
        <div className="text-xs text-slate-500 font-mono">
          Last Updated: {new Date(data.timestamp).toLocaleTimeString()}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Placeholder for future widgets (e.g. Map, Feed) */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-6 h-64 flex items-center justify-center text-slate-600">
          GIS Map View (Coming Soon)
        </div>
        <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-6 h-64 flex items-center justify-center text-slate-600">
          Alert Feed (See Alerts Tab)
        </div>
      </div>
    </div>
  );
}
