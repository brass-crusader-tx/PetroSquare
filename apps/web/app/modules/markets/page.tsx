"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { PageContainer, SectionHeader, DataPanel, Badge, IconButton } from '@petrosquare/ui';
import { useDensity } from '../../../context/DensityContext';
import { DensityToggle } from '../../../components/DensityToggle';
import type { MarketData } from '@petrosquare/types';

// Static Definition
const moduleDef = {
  id: 'markets',
  title: 'Market & Trading',
  status: 'declared',
  purpose: 'Monitor commodity prices and analyze arbitrage opportunities.',
  inputs: ['WTI/Brent Futures', 'Crack Spreads', 'Tanker Rates'],
  outputs: ['Realized Price Netback', 'VaR (Value at Risk)', 'Hedging Recommendations'],
  assumptions: ['Market Liquidity', 'FX Rates Stability'],
  scope: 'Global crude and product markets.',
  decisionSupport: 'Supports hedging decisions and cargo routing.',
  interfaces: ['Bloomberg Feed', 'Platts API', 'Internal Trading System'],
  auditability: 'Trade execution logs and price fixings recorded.',
};

export default function MarketsPage() {
  const { density, inspectMode } = useDensity();
  const [commit, setCommit] = useState<string>('Loading...');
  const [benchmarks, setBenchmarks] = useState<MarketData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/meta').then(r => r.json()).then(data => setCommit(data.commit)).catch(() => setCommit('Unknown'));

    fetch('/api/data/market/benchmark')
      .then(r => r.json())
      .then(res => {
        if (res.data) setBenchmarks(res.data);
        if (res.meta?.errors) console.warn('Benchmark errors:', res.meta.errors);
      })
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const densityClass = density === 'compact' ? 'space-y-2' : 'space-y-6';
  const panelPadding = density === 'compact' ? 'p-4' : 'p-6';
  const fontSize = density === 'compact' ? 'text-xs' : 'text-sm';

  return (
    <main className="min-h-screen bg-background text-text">
       <header className="border-b border-border bg-surface sticky top-0 z-20">
         <div className="container mx-auto px-4 h-16 flex items-center justify-between">
           <div className="flex items-center space-x-4">
             <Link href="/" className="text-muted hover:text-white font-mono">←</Link>
             <h1 className="text-lg font-bold text-white font-sans">{moduleDef.title}</h1>
             <Badge status={moduleDef.status as any}>{moduleDef.status}</Badge>
           </div>
           <div className="flex items-center space-x-4">
              <div className="hidden md:flex flex-col items-end text-xs text-muted font-mono">
                <span>COMMIT</span>
                <span className="text-white">{commit.substring(0, 7)}</span>
              </div>
              <DensityToggle />
           </div>
         </div>
       </header>

       <div className="container mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-4 gap-8">

          {/* Left Rail - Definition */}
          <aside className="lg:col-span-1 space-y-6">
             <div className="bg-surface/50 p-4 rounded border border-border">
               <h3 className="text-xs font-bold uppercase text-muted mb-4 tracking-wider">Definition</h3>

               <div className="space-y-4">
                 <div>
                   <h4 className="text-[10px] uppercase text-muted mb-1">Purpose</h4>
                   <p className="text-sm text-white leading-relaxed">{moduleDef.purpose}</p>
                 </div>

                 <div>
                   <h4 className="text-[10px] uppercase text-muted mb-1">Data Inputs</h4>
                   <ul className="text-xs text-blue-200 font-mono space-y-1">
                     {moduleDef.inputs.map(i => <li key={i}>• {i}</li>)}
                   </ul>
                 </div>

                 <div>
                   <h4 className="text-[10px] uppercase text-muted mb-1">Outputs</h4>
                   <ul className="text-xs text-green-200 font-mono space-y-1">
                     {moduleDef.outputs.map(o => <li key={o}>→ {o}</li>)}
                   </ul>
                 </div>
               </div>
             </div>
          </aside>

          {/* Main Canvas */}
          <section className={`lg:col-span-3 ${densityClass}`}>

             {/* Live Data Section */}
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               {loading ? (
                 <DataPanel className="col-span-2">
                   <div className="animate-pulse flex space-x-4">
                     <div className="h-12 w-12 bg-surface-highlight rounded"></div>
                     <div className="space-y-2 py-1 flex-1">
                       <div className="h-4 bg-surface-highlight rounded w-3/4"></div>
                       <div className="h-4 bg-surface-highlight rounded w-1/2"></div>
                     </div>
                   </div>
                 </DataPanel>
               ) : benchmarks.length > 0 ? (
                 benchmarks.map((b) => (
                   <DataPanel key={b.symbol} title={`${b.symbol} Spot Price`}>
                     <div className="flex items-end space-x-2">
                       <span className="text-3xl font-bold text-white font-mono">{typeof b.price === 'number' ? b.price.toFixed(2) : b.price}</span>
                       <span className="text-sm text-muted mb-1">{b.unit}</span>
                     </div>
                     <div className="mt-2 text-xs text-muted">
                        Source: <a href={b.provenance.sourceUrl} target="_blank" className="text-primary hover:underline">{b.provenance.sourceName}</a>
                     </div>
                     <div className="text-[10px] text-muted font-mono mt-1">
                        As of: {new Date(b.provenance.retrievedAt).toLocaleDateString()}
                     </div>

                     {inspectMode && (
                        <div className="mt-4 pt-2 border-t border-dashed border-border text-xs font-mono text-data-warning bg-black/20 p-2 rounded break-all">
                          <div>url="{b.provenance.sourceUrl}"</div>
                          <div>license="{b.provenance.license}"</div>
                          <div>connector="eia.ts"</div>
                        </div>
                     )}
                   </DataPanel>
                 ))
               ) : (
                 <DataPanel className="col-span-2">
                   <div className="flex flex-col items-center justify-center p-4 text-center">
                     <p className="text-muted text-sm mb-2">No live benchmark data available.</p>
                     <p className="text-xs text-data-neutral max-w-md">
                       Ensure <code>EIA_API_KEY</code> is set in environment variables to enable live WTI/Brent spot prices from the U.S. Energy Information Administration.
                     </p>
                     {error && <p className="text-data-critical text-xs mt-2 font-mono">{error}</p>}
                   </div>
                 </DataPanel>
               )}
             </div>

             <DataPanel title="Scope" className={panelPadding}>
               <p className={`${fontSize} text-muted`}>{moduleDef.scope}</p>
             </DataPanel>

             <DataPanel title="Interfaces" className={panelPadding}>
                <ul className={`list-disc list-inside ${fontSize} text-muted`}>
                  {moduleDef.interfaces.map(i => <li key={i}>{i}</li>)}
                </ul>
             </DataPanel>

          </section>

       </div>
    </main>
  );
}
