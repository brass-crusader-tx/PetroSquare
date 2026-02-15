"use client";

import { useEffect, useState } from 'react';
import { ControlAsset, TelemetryPoint } from '@petrosquare/types';
import { TelemetryChart } from '../../components/TelemetryChart';
import { InspectDrawer } from '../../components/InspectDrawer';
import { Badge, DataPanel } from '@petrosquare/ui';

export default function AssetDetailPage({ params }: { params: { id: string } }) {
  const [asset, setAsset] = useState<ControlAsset | null>(null);
  const [telemetry, setTelemetry] = useState<TelemetryPoint[]>([]);
  const [window, setWindow] = useState<'1h' | '24h' | '7d'>('1h');
  const [loading, setLoading] = useState(true);
  const [loadingTelemetry, setLoadingTelemetry] = useState(false);
  const [isInspectOpen, setIsInspectOpen] = useState(false);

  useEffect(() => {
    // Fetch Asset + Initial Telemetry
    setLoading(true);
    fetch(`/api/control-center/assets?query=${params.id}`)
      .then(res => res.json())
      .then((data: ControlAsset[]) => {
        const found = data.find(a => a.id === params.id);
        if (found) setAsset(found);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [params.id]);

  useEffect(() => {
    // Fetch Telemetry when window changes
    setLoadingTelemetry(true);
    fetch(`/api/control-center/assets/${params.id}/telemetry?window=${window}`)
      .then(res => res.json())
      .then(data => setTelemetry(data.series))
      .catch(console.error)
      .finally(() => setLoadingTelemetry(false));
  }, [params.id, window]);

  if (loading) return <div className="p-8 text-center text-muted animate-pulse">Loading Asset Details...</div>;
  if (!asset) return <div className="p-8 text-center text-red-500">Asset Not Found</div>;

  return (
    <div className="flex flex-col h-full bg-background text-white font-sans">
      {/* Header */}
      <div className="bg-surface/50 backdrop-blur-md border-b border-white/5 p-6 flex justify-between items-start sticky top-0 z-10">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold text-white tracking-tight">{asset.name}</h1>
            <Badge status={asset.status} />
          </div>
          <div className="text-muted font-mono text-sm mt-1">{asset.id} • {asset.type} • {asset.metadata?.basin as string}</div>
        </div>
        <div className="text-right">
          <div className="text-xs text-muted uppercase tracking-wider mb-1">Health Score</div>
          <div className={`text-3xl font-mono font-bold ${
            asset.healthScore > 90 ? 'text-emerald-500' : 'text-amber-500'
          }`}>
            {asset.healthScore}%
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-6 overflow-auto space-y-6">
        {/* Telemetry Section */}
        <div className="bg-surface border border-white/5 rounded-2xl p-6 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-medium text-white flex items-center gap-2 tracking-tight">
              <span>Real-Time Telemetry</span>
              {loadingTelemetry && <span className="text-xs text-muted animate-pulse">(Updating...)</span>}
            </h2>
            <div className="flex items-center gap-2">
              <div className="flex bg-surface-highlight/50 rounded-lg p-1 border border-white/5">
                {(['1h', '24h', '7d'] as const).map((w) => (
                  <button
                    key={w}
                    onClick={() => setWindow(w)}
                    className={`px-3 py-1 rounded-md text-xs font-medium transition-all ${
                      window === w
                        ? 'bg-surface-highlight text-white shadow-sm border border-white/10'
                        : 'text-muted hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {w}
                  </button>
                ))}
              </div>
              <button
                onClick={() => setIsInspectOpen(true)}
                className="ml-4 px-3 py-1.5 text-xs bg-surface-highlight/50 hover:bg-surface-highlight text-muted hover:text-white border border-white/5 hover:border-white/10 rounded-lg transition-all flex items-center gap-1 shadow-sm"
              >
                Inspect Raw Data
              </button>
            </div>
          </div>

          <div className="h-80 w-full">
            <TelemetryChart data={telemetry} window={window} />
          </div>
        </div>

        {/* Other Details Placeholder */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <DataPanel title="Active Alerts" className="min-h-[200px]">
            {asset.activeAlarms > 0 ? (
              <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 text-red-400 text-sm flex items-start gap-2">
                 <div className="w-2 h-2 rounded-full bg-red-500 mt-1.5 shrink-0 animate-pulse" />
                {asset.activeAlarms} critical alarms active. Check Alerts Center.
              </div>
            ) : (
              <div className="text-muted text-sm flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500/50" />
                No active alerts.
              </div>
            )}
          </DataPanel>

          <DataPanel title="Technical Specs" className="min-h-[200px]">
            <pre className="text-xs font-mono text-muted whitespace-pre-wrap">
              {JSON.stringify(asset.metadata, null, 2)}
            </pre>
          </DataPanel>
        </div>
      </div>

      <InspectDrawer
        isOpen={isInspectOpen}
        onClose={() => setIsInspectOpen(false)}
        asset={asset}
        telemetry={telemetry}
        window={window}
      />
    </div>
  );
}
