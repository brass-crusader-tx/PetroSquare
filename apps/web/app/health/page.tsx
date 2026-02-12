"use client";

import React, { useEffect, useState } from 'react';
import { PageContainer, SectionHeader, DataPanel, Badge } from '@petrosquare/ui';

interface ConnectorHealth {
  id: string;
  name: string;
  status: 'operational' | 'degraded' | 'down';
  latency: number;
  last_check: string;
}

interface SystemHealth {
    status: 'ok' | 'degraded';
    version: string;
    environment: string;
    timestamp: string;
    connectors: ConnectorHealth[];
    database: {
        mode: string;
        status: string;
    }
}

export default function HealthPage() {
  const [health, setHealth] = useState<SystemHealth | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchHealth = () => {
      setLoading(true);
      fetch('/api/health')
          .then(res => res.json())
          .then(setHealth)
          .catch(console.error)
          .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchHealth();
    const interval = setInterval(fetchHealth, 10000); // Poll every 10s
    return () => clearInterval(interval);
  }, []);

  return (
    <main className="min-h-screen bg-background text-text">
      <PageContainer>
        <SectionHeader
            title="System Status"
            description="Real-time health monitoring of PetroSquare Platform services and connectors."
        >
            <div className="flex items-center space-x-2">
                <span className="text-xs text-muted font-mono">
                    Last check: {health ? new Date(health.timestamp).toLocaleTimeString() : '-'}
                </span>
                <button onClick={fetchHealth} className="p-2 bg-surface-highlight rounded hover:bg-border transition-colors">
                    ↻
                </button>
            </div>
        </SectionHeader>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* Main Status */}
            <div className="lg:col-span-1 space-y-6">
                 <DataPanel title="Platform Health" loading={loading}>
                    <div className="flex flex-col items-center justify-center py-6 space-y-4">
                        <div className={`w-24 h-24 rounded-full flex items-center justify-center border-4 ${health?.status === 'ok' ? 'border-data-positive text-data-positive' : 'border-data-critical text-data-critical'}`}>
                            <span className="text-2xl font-bold uppercase">{health?.status}</span>
                        </div>
                        <div className="text-center space-y-1">
                            <div className="text-sm text-white">v{health?.version}</div>
                            <div className="text-xs text-muted uppercase tracking-wider">{health?.environment}</div>
                        </div>
                    </div>
                    <div className="border-t border-border pt-4 mt-4 space-y-2">
                         <div className="flex justify-between text-sm">
                             <span className="text-muted">Database Mode</span>
                             <Badge status={health?.database.mode === 'NO_DB' ? 'beta' : 'live'}>{health?.database.mode}</Badge>
                         </div>
                         <div className="flex justify-between text-sm">
                             <span className="text-muted">Database Connection</span>
                             <Badge status={health?.database.status === 'connected' ? 'live' : 'error'}>{health?.database.status}</Badge>
                         </div>
                    </div>
                </DataPanel>
            </div>

            {/* Connectors */}
            <div className="lg:col-span-2">
                <DataPanel title="Connector Status" loading={loading}>
                     <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="text-xs text-muted uppercase bg-surface-highlight/10 border-b border-border">
                                <tr>
                                    <th className="px-4 py-3">Source</th>
                                    <th className="px-4 py-3 text-center">Status</th>
                                    <th className="px-4 py-3 text-right">Latency</th>
                                    <th className="px-4 py-3 text-right">Last Check</th>
                                </tr>
                            </thead>
                            <tbody>
                                {health?.connectors.map((c) => (
                                    <tr key={c.id} className="border-b border-border hover:bg-surface-highlight/5">
                                        <td className="px-4 py-3 font-medium text-white">{c.name}</td>
                                        <td className="px-4 py-3 text-center">
                                            <Badge status={c.status === 'operational' ? 'live' : 'error'}>
                                                {c.status}
                                            </Badge>
                                        </td>
                                        <td className="px-4 py-3 text-right font-mono text-muted">
                                            {c.latency}ms
                                        </td>
                                        <td className="px-4 py-3 text-right font-mono text-muted text-xs">
                                            {new Date(c.last_check).toLocaleTimeString()}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </DataPanel>
            </div>

        </div>
      </PageContainer>
    </main>
  );
}
