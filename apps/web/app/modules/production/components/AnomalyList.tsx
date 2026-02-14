"use client";

import React, { useState, useEffect } from 'react';
import { DataPanel } from '@petrosquare/ui';
import { useData } from '@/lib/hooks';
import { Anomaly } from '@petrosquare/types';

export function AnomalyList({ assetId }: { assetId: string }) {
  const { data: anomalies, loading } = useData<Anomaly[]>(`/api/production/anomalies?asset_id=${assetId}`);

  return (
    <DataPanel title="Detected Anomalies" loading={loading}>
      <div className="space-y-3">
        {(anomalies || []).map(a => (
            <div key={a.id} className="flex items-start space-x-3 p-3 bg-surface-highlight/10 rounded border border-border">
                <div className={`w-2 h-2 mt-2 rounded-full ${a.severity === 'HIGH' ? 'bg-critical' : (a.severity === 'MEDIUM' ? 'bg-warning' : 'bg-info')}`} />
                <div>
                    <div className="flex items-center space-x-2">
                        <span className="font-bold text-white text-sm">{a.type}</span>
                        <span className="text-xs text-muted">{new Date(a.timestamp).toLocaleDateString()}</span>
                        <span className={`text-[10px] px-1 rounded border ${a.severity === 'HIGH' ? 'border-critical text-critical' : 'border-warning text-warning'}`}>{a.severity}</span>
                    </div>
                    <p className="text-sm text-muted mt-1">{a.explanation}</p>
                </div>
            </div>
        ))}
      </div>
    </DataPanel>
  );
}
