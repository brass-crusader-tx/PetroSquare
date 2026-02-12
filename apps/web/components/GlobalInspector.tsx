"use client";

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { Drawer, IconButton, Badge, Button } from '@petrosquare/ui';
import type { HealthResponse, MetaResponse, Capability } from '@petrosquare/types';
import { useDensity } from '../context/DensityContext';

export function GlobalInspector() {
  const [isOpen, setIsOpen] = useState(false);
  const [health, setHealth] = useState<HealthResponse | null>(null);
  const [meta, setMeta] = useState<MetaResponse | null>(null);
  const [capabilities, setCapabilities] = useState<Capability[]>([]);
  const [lastEiaFetch, setLastEiaFetch] = useState<string | null>(null);
  const [lastCerFetch, setLastCerFetch] = useState<string | null>(null);
  const pathname = usePathname();
  const { density, inspectMode } = useDensity();

  useEffect(() => {
    if (isOpen) {
      fetch('/api/health').then(r => r.json()).then(setHealth).catch(console.error);
      fetch('/api/meta').then(r => r.json()).then(setMeta).catch(console.error);
      fetch('/api/capabilities').then(r => r.json()).then(setCapabilities).catch(console.error);

      const eia = localStorage.getItem('petrosquare-eia-last-fetch');
      if (eia) setLastEiaFetch(eia);
      const cer = localStorage.getItem('petrosquare-cer-last-fetch');
      if (cer) setLastCerFetch(cer);
    }
  }, [isOpen]);

  // Open automatically if inspectMode is on? No, that would be annoying.
  // But inspectMode might show inline details. The Drawer is separate.

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
                   <span className="text-xs text-muted">Status</span>
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
             <h3 className="text-xs font-bold uppercase text-muted mb-2 tracking-wider">Production & Reserves</h3>
             <div className="space-y-2 mb-4">
                <div className="flex justify-between items-center text-xs">
                   <span className="text-muted">EIA Last Fetch</span>
                   <span className="text-white font-mono">{lastEiaFetch ? new Date(lastEiaFetch).toLocaleTimeString() : 'N/A'}</span>
                </div>
                 <div className="flex justify-between items-center text-xs">
                   <span className="text-muted">CER Last Fetch</span>
                   <span className="text-white font-mono">{lastCerFetch ? new Date(lastCerFetch).toLocaleTimeString() : 'N/A'}</span>
                </div>
             </div>
             <div className="grid grid-cols-2 gap-2">
                  <Button variant="secondary" className="text-[10px] px-2 py-1 h-auto" onClick={() => copyToClipboard('/api/data/production-reserves/regions')}>Copy Regions API</Button>
                  <Button variant="secondary" className="text-[10px] px-2 py-1 h-auto" onClick={() => copyToClipboard('/api/data/production-reserves/top-producers?kind=US_STATE')}>Copy Top Prod API</Button>
                  <Button variant="secondary" className="text-[10px] px-2 py-1 h-auto" onClick={() => copyToClipboard('/api/data/production-reserves/production?kind=US_STATE&code=TX')}>Copy Prod API</Button>
                  <Button variant="secondary" className="text-[10px] px-2 py-1 h-auto" onClick={() => copyToClipboard('/api/data/production-reserves/reserves?kind=US_STATE&code=TX')}>Copy Resv API</Button>
              </div>
          </section>

          <section className="pt-4 border-t border-border">
             <h3 className="text-xs font-bold uppercase text-muted mb-2 tracking-wider">System Contracts</h3>
             <div className="space-y-2">
                <a href="/api/health" target="_blank" className="block text-xs font-mono text-primary hover:underline">GET /api/health</a>
                <a href="/api/meta" target="_blank" className="block text-xs font-mono text-primary hover:underline">GET /api/meta</a>
                <a href="/api/capabilities" target="_blank" className="block text-xs font-mono text-primary hover:underline">GET /api/capabilities</a>
             </div>
          </section>

        </div>
      </Drawer>
    </>
  );
}
