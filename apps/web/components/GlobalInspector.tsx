"use client";

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { Drawer, IconButton, Badge, Button } from '@petrosquare/ui';
import type { HealthResponse, MetaResponse, Capability } from '@petrosquare/types';
import { useDensity } from '../context/DensityContext';
import { Settings, Activity, Copy, Check, Terminal } from 'lucide-react';

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

  // Listen for global open event
  useEffect(() => {
    const handleOpen = () => setIsOpen(true);
    window.addEventListener('petrosquare-open-inspector', handleOpen);
    return () => window.removeEventListener('petrosquare-open-inspector', handleOpen);
  }, []);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <>
      <Drawer isOpen={isOpen} onClose={() => setIsOpen(false)} title="System Inspector">

        <div className="space-y-6">
          {/* Route Context */}
          <section>
            <h3 className="text-xs font-bold uppercase text-muted mb-2 tracking-wider flex items-center gap-2">
                <Terminal size={12} /> Current Context
            </h3>
            <div className="bg-black/30 p-3 rounded-lg border border-white/5 font-mono text-sm text-blue-400 break-all shadow-inner">
              {pathname}
            </div>
            <div className="mt-2 flex items-center space-x-2 text-xs text-muted font-mono">
               <span>Density: <span className="text-white">{density}</span></span>
               <span className="mx-1 opacity-30">|</span>
               <span>Inspect: <span className={inspectMode ? "text-data-warning" : "text-white"}>{inspectMode ? 'ON' : 'OFF'}</span></span>
            </div>
          </section>

          {/* Health Check */}
          <section>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs font-bold uppercase text-muted tracking-wider flex items-center gap-2">
                  <Activity size={12} /> Health Status
              </h3>
              <IconButton
                size="sm"
                variant="ghost"
                onClick={() => copyToClipboard(JSON.stringify(health, null, 2))}
                title="Copy JSON"
              >
                <Copy size={12} />
              </IconButton>
            </div>
            {health ? (
               <div className="bg-black/30 p-3 rounded-lg border border-white/5 space-y-2 shadow-inner">
                 <div className="flex justify-between items-center">
                   <span className="text-xs text-muted">Status</span>
                   <Badge status={health.status === 'ok' ? 'live' : 'error'} />
                 </div>
                 <div className="flex justify-between items-center">
                   <span className="text-xs text-muted">Version</span>
                   <span className="text-xs font-mono text-white">{health.version}</span>
                 </div>
                 <div className="text-[10px] text-muted/50 pt-2 border-t border-dashed border-white/5 mt-2 font-mono text-right">
                   {new Date(health.timestamp).toLocaleString()}
                 </div>
               </div>
            ) : (
              <div className="text-xs text-muted italic animate-pulse">Checking system health...</div>
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
                <Copy size={12} />
              </IconButton>
            </div>
            {meta ? (
               <div className="bg-black/30 p-3 rounded-lg border border-white/5 space-y-2 font-mono text-xs shadow-inner">
                 <div className="flex flex-col">
                   <span className="text-muted text-[10px] uppercase tracking-wider mb-0.5">Commit</span>
                   <span className="text-white break-all bg-white/5 px-1.5 py-0.5 rounded">{meta.commit}</span>
                 </div>
                 <div className="flex flex-col">
                   <span className="text-muted text-[10px] uppercase tracking-wider mb-0.5">Environment</span>
                   <span className="text-primary">{meta.environment}</span>
                 </div>
               </div>
            ) : (
               <div className="text-xs text-muted italic animate-pulse">Loading metadata...</div>
            )}
          </section>

          {/* Capabilities */}
           <section>
            <h3 className="text-xs font-bold uppercase text-muted mb-2 tracking-wider">Capabilities</h3>
             <div className="space-y-2">
               {capabilities.map(cap => (
                 <div key={cap.id} className="bg-surface-highlight/10 p-2.5 rounded-lg border border-white/5 flex items-center justify-between hover:bg-surface-highlight/20 transition-colors">
                   <span className="text-xs text-white font-medium">{cap.title}</span>
                   <Badge status={cap.status} className="scale-90 origin-right" />
                 </div>
               ))}
             </div>
          </section>

          <section className="pt-4 border-t border-white/5">
             <h3 className="text-xs font-bold uppercase text-muted mb-3 tracking-wider">Production APIs</h3>
             <div className="space-y-2 mb-4">
                <div className="flex justify-between items-center text-xs">
                   <span className="text-muted">EIA Last Fetch</span>
                   <span className="text-white font-mono bg-white/5 px-1.5 rounded">{lastEiaFetch ? new Date(lastEiaFetch).toLocaleTimeString() : 'N/A'}</span>
                </div>
                 <div className="flex justify-between items-center text-xs">
                   <span className="text-muted">CER Last Fetch</span>
                   <span className="text-white font-mono bg-white/5 px-1.5 rounded">{lastCerFetch ? new Date(lastCerFetch).toLocaleTimeString() : 'N/A'}</span>
                </div>
             </div>
             <div className="grid grid-cols-2 gap-2">
                  <Button variant="secondary" size="sm" className="text-[10px] h-8 justify-start" onClick={() => copyToClipboard('/api/data/production-reserves/regions')}>Copy Regions</Button>
                  <Button variant="secondary" size="sm" className="text-[10px] h-8 justify-start" onClick={() => copyToClipboard('/api/data/production-reserves/top-producers?kind=US_STATE')}>Copy Top Prod</Button>
                  <Button variant="secondary" size="sm" className="text-[10px] h-8 justify-start" onClick={() => copyToClipboard('/api/data/production-reserves/production?kind=US_STATE&code=TX')}>Copy Prod</Button>
                  <Button variant="secondary" size="sm" className="text-[10px] h-8 justify-start" onClick={() => copyToClipboard('/api/data/production-reserves/reserves?kind=US_STATE&code=TX')}>Copy Resv</Button>
              </div>
          </section>

          <section className="pt-4 border-t border-white/5">
             <h3 className="text-xs font-bold uppercase text-muted mb-2 tracking-wider">System Contracts</h3>
             <div className="space-y-1">
                <a href="/api/health" target="_blank" className="block text-xs font-mono text-primary hover:text-white transition-colors py-1">GET /api/health</a>
                <a href="/api/meta" target="_blank" className="block text-xs font-mono text-primary hover:text-white transition-colors py-1">GET /api/meta</a>
                <a href="/api/capabilities" target="_blank" className="block text-xs font-mono text-primary hover:text-white transition-colors py-1">GET /api/capabilities</a>
             </div>
          </section>

        </div>
      </Drawer>
    </>
  );
}
