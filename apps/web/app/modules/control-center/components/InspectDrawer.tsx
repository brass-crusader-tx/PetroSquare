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
          <div className="bg-slate-900 border border-slate-800 rounded p-4">
            <h4 className="text-sm font-semibold text-white mb-2">Source Information</h4>
            <div className="space-y-2 text-xs text-slate-400">
              <div className="flex justify-between">
                <span>System:</span>
                <span className="text-emerald-400 font-mono">SCADA_HISTORIAN_STUB</span>
              </div>
              <div className="flex justify-between">
                <span>Protocol:</span>
                <span className="text-slate-200">OPC-UA / MQTT Bridge</span>
              </div>
              <div className="flex justify-between">
                <span>Last Contact:</span>
                <span className="text-slate-200">{new Date(asset.lastContact).toISOString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Data Quality:</span>
                <span className="text-emerald-400">100% GOOD</span>
              </div>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded p-4">
            <h4 className="text-sm font-semibold text-white mb-2">Transformations</h4>
            <ul className="list-disc list-inside text-xs text-slate-400 space-y-1">
              <li>Raw value scaling (Linear, factor 1.0)</li>
              <li>Unit conversion (Bar -> Psi)</li>
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
          <div className="text-xs text-slate-500 mb-2">
            Displaying raw telemetry points for window: <strong>{window}</strong>
          </div>
          <div className="bg-slate-950 rounded border border-slate-800 overflow-auto max-h-[600px]">
            <table className="w-full text-left text-xs text-slate-400">
              <thead className="bg-slate-900 text-slate-300 font-bold sticky top-0">
                <tr>
                  <th className="p-2">Timestamp</th>
                  <th className="p-2 text-right">Value</th>
                  <th className="p-2">Unit</th>
                  <th className="p-2">Quality</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 font-mono">
                {telemetry.map((point, i) => (
                  <tr key={i} className="hover:bg-slate-900">
                    <td className="p-2">{point.timestamp}</td>
                    <td className="p-2 text-right text-emerald-400">{point.value}</td>
                    <td className="p-2">{point.unit}</td>
                    <td className="p-2">
                      <span className={point.quality === 'GOOD' ? 'text-emerald-500' : 'text-amber-500'}>
                        {point.quality}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )
    },
    {
      id: 'json',
      label: 'JSON Object',
      content: (
        <pre className="bg-slate-950 p-4 rounded text-xs text-emerald-400 font-mono overflow-auto border border-slate-800">
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
