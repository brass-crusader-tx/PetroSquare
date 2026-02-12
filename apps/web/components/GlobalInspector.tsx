"use client";

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { Drawer, IconButton, Badge } from '@petrosquare/ui';
import type { HealthResponse, MetaResponse, Capability, ApiResponse } from '@petrosquare/types';
import { useDensity } from '../context/DensityContext';

interface ConnectorStatus {
  status: 'ok' | 'degraded' | 'unknown';
  retrievedAt: string;
}

export function GlobalInspector() {
  const [isOpen, setIsOpen] = useState(false);
  const [health, setHealth] = useState<HealthResponse | null>(null);
  const [meta, setMeta] = useState<MetaResponse | null>(null);
  const [capabilities, setCapabilities] = useState<Capability[]>([]);

  // Data Health State
  const [dataHealth, setDataHealth] = useState<{
    eia: ConnectorStatus;
    openweather: ConnectorStatus;
    sec: ConnectorStatus;
  }>({
    eia: { status: 'unknown', retrievedAt: '-' },
    openweather: { status: 'unknown', retrievedAt: '-' },
    sec: { status: 'unknown', retrievedAt: '-' },
  });

  const pathname = usePathname();
  const { density, inspectMode } = useDensity();

  useEffect(() => {
    if (isOpen) {
      fetch('/api/health').then(r => r.json()).then(setHealth).catch(console.error);
      fetch('/api/meta').then(r => r.json()).then(setMeta).catch(console.error);
      fetch('/api/capabilities').then(r => r.json()).then(setCapabilities).catch(console.error);

      // Check Data Health
      // EIA
      fetch('/api/data/market/benchmark').then(r => r.json()).then((res: ApiResponse<any>) => {
         setDataHealth(prev => ({
           ...prev,
           eia: {
             status: res.status as any,
             retrievedAt: res.provenance?.retrieved_at || new Date().toISOString()
           }
         }));
      }).catch(() => setDataHealth(prev => ({ ...prev, eia: { status: 'degraded', retrievedAt: 'Error' } })));

      // OpenWeather
      fetch('/api/data/context/weather?lat=29.7604&lon=-95.3698').then(r => r.json()).then((res: ApiResponse<any>) => {
         setDataHealth(prev => ({
           ...prev,
           openweather: {
             status: res.status as any,
             retrievedAt: res.provenance?.retrieved_at || new Date().toISOString()
           }
         }));
      }).catch(() => setDataHealth(prev => ({ ...prev, openweather: { status: 'degraded', retrievedAt: 'Error' } })));

      // SEC
      fetch('/api/data/regulatory/filings?limit=1').then(r => r.json()).then((res: ApiResponse<any>) => {
         setDataHealth(prev => ({
           ...prev,
           sec: {
             status: res.status as any,
             retrievedAt: res.provenance?.retrieved_at || new Date().toISOString()
           }
         }));
      }).catch(() => setDataHealth(prev => ({ ...prev, sec: { status: 'degraded', retrievedAt: 'Error' } })));
    }
  }, [isOpen]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <>
      <div className="fixed bottom-4 right-4 z-50">
        <IconButton
          onClick={() => setIsOpen(true)}
          className="bg-surface border border-border shadow-lg rounded-full h-12 w-12 hover:bg-surface-highlight"
          title="Open System Inspector"
        >
          <svg className="w-6 h-6 text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </IconButton>
      </div>

      <Drawer isOpen={isOpen} onClose={() => setIsOpen(false)} title="System Inspector">

        <div className="space-y-6">
          {/* Route Context */}
          <section>
            <h3 className="text-xs font-bold uppercase text-muted mb-2 tracking-wider">Current Context</h3>
            <div className="bg-black/30 p-3 rounded border border-border font-mono text-sm text-blue-400 break-all">
              {pathname}
            </div>
            <div className="mt-2 flex items-center space-x-2 text-xs text-muted">
               <span>Density: <span className="text-white">{density}</span></span>
               <span className="mx-1">•</span>
               <span>Inspect Mode: <span className={inspectMode ? "text-data-warning" : "text-white"}>{inspectMode ? 'ON' : 'OFF'}</span></span>
            </div>
          </section>

          {/* Health Check */}
          <section>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs font-bold uppercase text-muted tracking-wider">Health Status</h3>
              <IconButton
                size="sm"
                variant="ghost"
                onClick={() => copyToClipboard(JSON.stringify(health, null, 2))}
                title="Copy JSON"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </IconButton>
            </div>
            {health ? (
               <div className="bg-black/30 p-3 rounded border border-border space-y-2">
                 <div className="flex justify-between items-center">
                   <span className="text-xs text-muted">System</span>
                   <Badge status={health.status === 'ok' ? 'live' : 'error'} />
                 </div>
                 <div className="flex justify-between items-center">
                   <span className="text-xs text-muted">Version</span>
                   <span className="text-xs font-mono text-white">{health.version}</span>
                 </div>
                 <div className="text-xs text-muted pt-1 border-t border-dashed border-border mt-1">
                   {new Date(health.timestamp).toLocaleString()}
                 </div>
               </div>
            ) : (
              <div className="text-xs text-muted italic">Loading...</div>
            )}
          </section>

          {/* Data Health */}
          <section>
            <h3 className="text-xs font-bold uppercase text-muted mb-2 tracking-wider">Data Connectors</h3>
            <div className="space-y-2 bg-black/30 p-3 rounded border border-border">
               <div className="flex justify-between items-center">
                 <span className="text-xs text-muted">EIA (Energy)</span>
                 <Badge status={dataHealth.eia.status === 'ok' ? 'live' : (dataHealth.eia.status === 'unknown' ? 'beta' : 'error')} />
               </div>
               <div className="flex justify-between items-center">
                 <span className="text-xs text-muted">OpenWeather</span>
                 <Badge status={dataHealth.openweather.status === 'ok' ? 'live' : (dataHealth.openweather.status === 'unknown' ? 'beta' : 'error')} />
               </div>
               <div className="flex justify-between items-center">
                 <span className="text-xs text-muted">SEC (Filings)</span>
                 <Badge status={dataHealth.sec.status === 'ok' ? 'live' : (dataHealth.sec.status === 'unknown' ? 'beta' : 'error')} />
               </div>
               <div className="text-[10px] text-muted pt-2 border-t border-dashed border-border mt-2 font-mono">
                 Last Sync: {dataHealth.eia.retrievedAt !== '-' ? new Date(dataHealth.eia.retrievedAt).toLocaleTimeString() : '-'}
               </div>
            </div>
          </section>

          {/* Metadata */}
          <section>
             <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs font-bold uppercase text-muted tracking-wider">Build Metadata</h3>
               <IconButton
                size="sm"
                variant="ghost"
                onClick={() => copyToClipboard(JSON.stringify(meta, null, 2))}
                title="Copy JSON"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </IconButton>
            </div>
            {meta ? (
               <div className="bg-black/30 p-3 rounded border border-border space-y-2 font-mono text-xs">
                 <div className="flex flex-col">
                   <span className="text-muted text-[10px] uppercase">Commit</span>
                   <span className="text-white break-all">{meta.commit}</span>
                 </div>
                 <div className="flex flex-col">
                   <span className="text-muted text-[10px] uppercase">Environment</span>
                   <span className="text-white">{meta.environment}</span>
                 </div>
               </div>
            ) : (
               <div className="text-xs text-muted italic">Loading...</div>
            )}
          </section>

          {/* Capabilities */}
           <section>
            <h3 className="text-xs font-bold uppercase text-muted mb-2 tracking-wider">Capabilities</h3>
             <div className="space-y-2">
               {capabilities.map(cap => (
                 <div key={cap.id} className="bg-surface-highlight/10 p-2 rounded border border-border flex items-center justify-between">
                   <span className="text-xs text-white">{cap.title}</span>
                   <Badge status={cap.status} className="scale-75 origin-right" />
                 </div>
               ))}
             </div>
          </section>

          <section className="pt-4 border-t border-border">
             <h3 className="text-xs font-bold uppercase text-muted mb-2 tracking-wider">API Contracts</h3>
             <div className="space-y-2">
                <div className="flex justify-between items-center group">
                  <a href="/api/health" target="_blank" className="text-xs font-mono text-primary hover:underline">GET /api/health</a>
                  <IconButton size="sm" variant="ghost" onClick={() => copyToClipboard('/api/health')} className="opacity-0 group-hover:opacity-100">
                    <span className="text-[10px]">COPY</span>
                  </IconButton>
                </div>

                <div className="flex justify-between items-center group">
                  <a href="/api/data/market/benchmark" target="_blank" className="text-xs font-mono text-primary hover:underline">GET /api/data/market/benchmark</a>
                  <IconButton size="sm" variant="ghost" onClick={() => copyToClipboard('/api/data/market/benchmark')} className="opacity-0 group-hover:opacity-100">
                    <span className="text-[10px]">COPY</span>
                  </IconButton>
                </div>

                <div className="flex justify-between items-center group">
                  <a href="/api/data/market/inventory" target="_blank" className="text-xs font-mono text-primary hover:underline">GET /api/data/market/inventory</a>
                   <IconButton size="sm" variant="ghost" onClick={() => copyToClipboard('/api/data/market/inventory')} className="opacity-0 group-hover:opacity-100">
                    <span className="text-[10px]">COPY</span>
                  </IconButton>
                </div>

                <div className="flex justify-between items-center group">
                  <a href="/api/data/context/weather?lat=29.76&lon=-95.36" target="_blank" className="text-xs font-mono text-primary hover:underline">GET /api/data/context/weather</a>
                   <IconButton size="sm" variant="ghost" onClick={() => copyToClipboard('/api/data/context/weather?lat=29.76&lon=-95.36')} className="opacity-0 group-hover:opacity-100">
                    <span className="text-[10px]">COPY</span>
                  </IconButton>
                </div>

                <div className="flex justify-between items-center group">
                  <a href="/api/data/regulatory/filings" target="_blank" className="text-xs font-mono text-primary hover:underline">GET /api/data/regulatory/filings</a>
                   <IconButton size="sm" variant="ghost" onClick={() => copyToClipboard('/api/data/regulatory/filings')} className="opacity-0 group-hover:opacity-100">
                    <span className="text-[10px]">COPY</span>
                  </IconButton>
                </div>

             </div>
          </section>

        </div>
      </Drawer>
    </>
  );
}
