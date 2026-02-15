"use client";

import { DetailDrawer } from '@petrosquare/ui';
import { ControlAsset, TelemetryPoint } from '@petrosquare/types';

interface InspectDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  asset: ControlAsset | null;
  telemetry: TelemetryPoint[];
  window: string;
}

export function InspectDrawer({ isOpen, onClose, asset, telemetry, window }: InspectDrawerProps) {
  if (!asset) return null;

  const tabs = [
    {
      id: 'provenance',
      label: 'Data Provenance',
      content: (
        <div className="space-y-6">
          <div className="bg-surface border border-white/5 rounded-xl p-4 shadow-sm">
            <h4 className="text-sm font-semibold text-white mb-3 tracking-tight">Source Information</h4>
            <div className="space-y-2 text-xs text-muted">
              <div className="flex justify-between items-center py-1 border-b border-white/5 last:border-0">
                <span>System</span>
                <span className="text-emerald-500 font-mono bg-emerald-500/10 px-1.5 py-0.5 rounded">SCADA_HISTORIAN_STUB</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-white/5 last:border-0">
                <span>Protocol</span>
                <span className="text-white">OPC-UA / MQTT Bridge</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-white/5 last:border-0">
                <span>Last Contact</span>
                <span className="text-white font-mono">{new Date(asset.lastContact).toISOString()}</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-white/5 last:border-0">
                <span>Data Quality</span>
                <span className="text-emerald-500 font-medium">100% GOOD</span>
              </div>
            </div>
          </div>

          <div className="bg-surface border border-white/5 rounded-xl p-4 shadow-sm">
            <h4 className="text-sm font-semibold text-white mb-3 tracking-tight">Transformations</h4>
            <ul className="list-disc list-inside text-xs text-muted space-y-2 ml-1">
              <li>Raw value scaling (Linear, factor 1.0)</li>
              <li>Unit conversion (Bar -&gt; Psi)</li>
              <li>Outlier detection (3-sigma filter applied)</li>
            </ul>
          </div>
        </div>
      )
    },
    {
      id: 'raw-data',
      label: 'Raw Payload',
      content: (
        <div className="space-y-4">
          <div className="text-xs text-muted mb-2 flex items-center gap-2">
            Displaying raw telemetry points for window:
            <span className="bg-surface-highlight px-1.5 py-0.5 rounded text-white font-mono">{window}</span>
          </div>
          <div className="bg-background rounded-xl border border-white/5 overflow-hidden max-h-[600px] shadow-inner">
            <div className="overflow-auto max-h-[600px]">
              <table className="w-full text-left text-xs text-muted">
                <thead className="bg-surface text-white font-medium sticky top-0 z-10 shadow-sm">
                  <tr>
                    <th className="p-3 font-medium">Timestamp</th>
                    <th className="p-3 text-right font-medium">Value</th>
                    <th className="p-3 font-medium">Unit</th>
                    <th className="p-3 font-medium">Quality</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 font-mono bg-background/50">
                  {telemetry.map((point, i) => (
                    <tr key={i} className="hover:bg-white/5 transition-colors">
                      <td className="p-3 text-muted">{point.timestamp}</td>
                      <td className="p-3 text-right text-emerald-500 font-medium">{point.value}</td>
                      <td className="p-3 text-muted">{point.unit}</td>
                      <td className="p-3">
                        <span className={`px-1.5 py-0.5 rounded ${
                          point.quality === 'GOOD'
                            ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
                            : 'bg-amber-500/10 text-amber-500 border border-amber-500/20'
                        }`}>
                          {point.quality}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'json',
      label: 'JSON Object',
      content: (
        <pre className="bg-background p-4 rounded-xl text-xs text-emerald-500 font-mono overflow-auto border border-white/5 shadow-inner">
          {JSON.stringify({ asset, telemetry_sample: telemetry.slice(0, 5) }, null, 2)}
        </pre>
      )
    }
  ];

  return (
    <DetailDrawer
      isOpen={isOpen}
      onClose={onClose}
      title={`Inspect: ${asset.name}`}
      subtitle={`ID: ${asset.id}`}
      source="SCADA Gateway"
      timestamp={new Date().toISOString()}
      tabs={tabs}
    />
  );
}
