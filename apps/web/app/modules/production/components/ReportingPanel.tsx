"use client";

import React, { useState } from 'react';
import { DataPanel } from '@petrosquare/ui';

export function ReportingPanel({ assetId }: { assetId: string }) {
  const [downloading, setDownloading] = useState(false);

  const download = async (type: string) => {
    setDownloading(true);
    try {
        const res = await fetch(`/api/production/export?asset_id=${assetId}&type=${type}`);
        if (!res.ok) throw new Error('Download failed');

        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${assetId}-${type}-${new Date().toISOString()}.json`; // Assuming JSON/CSV
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
    } catch(e) { console.error(e); } finally { setDownloading(false); }
  };

  return (
    <DataPanel title="Reserves & Production Reports">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 bg-surface-highlight/5 border border-border rounded flex flex-col justify-between h-32">
            <div>
                <h4 className="font-bold text-white mb-1">Production History (CSV)</h4>
                <p className="text-xs text-muted">Daily rates, pressures, and downtime logs.</p>
            </div>
            <button
                onClick={() => download('history')}
                disabled={downloading}
                className="self-start text-xs bg-surface-highlight border border-border text-white px-3 py-1 rounded hover:bg-surface-highlight/50 transition-colors"
            >
                Download CSV
            </button>
        </div>

        <div className="p-4 bg-surface-highlight/5 border border-border rounded flex flex-col justify-between h-32">
            <div>
                <h4 className="font-bold text-white mb-1">Reserves Summary (JSON)</h4>
                <p className="text-xs text-muted">PRMS-compliant reserves booking format.</p>
            </div>
            <button
                onClick={() => download('reserves')}
                disabled={downloading}
                className="self-start text-xs bg-surface-highlight border border-border text-white px-3 py-1 rounded hover:bg-surface-highlight/50 transition-colors"
            >
                Download JSON
            </button>
        </div>

        <div className="p-4 bg-surface-highlight/5 border border-border rounded flex flex-col justify-between h-32">
            <div>
                <h4 className="font-bold text-white mb-1">Forecast Scenarios (JSON)</h4>
                <p className="text-xs text-muted">Comparison of base case vs alternative scenarios.</p>
            </div>
            <button
                onClick={() => download('forecast')}
                disabled={downloading}
                className="self-start text-xs bg-surface-highlight border border-border text-white px-3 py-1 rounded hover:bg-surface-highlight/50 transition-colors"
            >
                Download JSON
            </button>
        </div>
      </div>
    </DataPanel>
  );
}
