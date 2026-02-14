"use client";

import { useEffect, useState } from 'react';
import { ControlAsset, TelemetryPoint } from '@petrosquare/types';
import { TelemetryChart } from '../../components/TelemetryChart';
import { InspectDrawer } from '../../components/InspectDrawer';

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

  if (loading) return <div className="p-8 text-center text-slate-400 animate-pulse">Loading Asset Details...</div>;
  if (!asset) return <div className="p-8 text-center text-red-500">Asset Not Found</div>;

  return (
    <div className="flex flex-col h-full bg-slate-950 text-slate-200">
      {/* Header */}
      <div className="bg-slate-900 border-b border-slate-800 p-6 flex justify-between items-start">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold text-white tracking-tight">{asset.name}</h1>
            <span className={`px-2 py-0.5 rounded text-xs font-bold border ${
              asset.status === 'ACTIVE' ? 'bg-emerald-900/30 text-emerald-400 border-emerald-900' :
              'bg-slate-800 text-slate-400 border-slate-700'
            }`}>
              {asset.status}
            </span>
          </div>
          <div className="text-slate-500 font-mono text-sm mt-1">{asset.id} • {asset.type} • {asset.metadata?.basin as string}</div>
        </div>
        <div className="text-right">
          <div className="text-xs text-slate-500 uppercase tracking-wider mb-1">Health Score</div>
          <div className={`text-3xl font-mono font-bold ${
            asset.healthScore > 90 ? 'text-emerald-400' : 'text-amber-400'
          }`}>
            {asset.healthScore}%
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-6 overflow-auto space-y-6">
        {/* Telemetry Section */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
              <span>Real-Time Telemetry</span>
              {loadingTelemetry && <span className="text-xs text-slate-500 animate-pulse">(Updating...)</span>}
            </h2>
            <div className="flex items-center gap-2">
              <div className="flex bg-slate-800 rounded-md p-1">
                {(['1h', '24h', '7d'] as const).map((w) => (
                  <button
                    key={w}
                    onClick={() => setWindow(w)}
                    className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                      window === w
                        ? 'bg-slate-700 text-white shadow-sm'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {w}
                  </button>
                ))}
              </div>
              <button
                onClick={() => setIsInspectOpen(true)}
                className="ml-4 px-3 py-1.5 text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 rounded transition-colors flex items-center gap-1"
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
          <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-6 min-h-[200px]">
            <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">Active Alerts</h3>
            {asset.activeAlarms > 0 ? (
              <div className="bg-red-900/20 border border-red-900/50 rounded p-4 text-red-400 text-sm">
                {asset.activeAlarms} critical alarms active. Check Alerts Center.
              </div>
            ) : (
              <div className="text-slate-500 text-sm">No active alerts.</div>
            )}
          </div>
          <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-6 min-h-[200px]">
            <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">Technical Specs</h3>
            <pre className="text-xs font-mono text-slate-500 whitespace-pre-wrap">
              {JSON.stringify(asset.metadata, null, 2)}
            </pre>
          </div>
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
