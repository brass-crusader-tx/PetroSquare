"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { PageContainer, DataPanel, Badge, IconButton } from '@petrosquare/ui';
import { useDensity } from '../../../context/DensityContext';
import { DensityToggle } from '../../../components/DensityToggle';
import type {
  ApiResponse,
  MarketBenchmarkResponse,
  InventorySeriesResponse,
  WeatherSnapshotResponse,
  FilingFeedResponse
} from '@petrosquare/types';

// Helper for fetching typed API responses
async function fetchData<T>(endpoint: string): Promise<ApiResponse<T>> {
  try {
    const res = await fetch(endpoint);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (error) {
    return {
      data: null,
      status: 'degraded',
      error: error instanceof Error ? error.message : 'Unknown error',
      provenance: {
        source_name: 'System',
        source_url: endpoint,
        retrieved_at: new Date().toISOString(),
        units: 'Error',
        notes: 'Fetch failed'
      }
    };
  }
}

export default function MarketsPage() {
  const { density, inspectMode } = useDensity();
  const [commit, setCommit] = useState<string>('Loading...');

  // Data State
  const [benchmarks, setBenchmarks] = useState<ApiResponse<MarketBenchmarkResponse> | null>(null);
  const [inventory, setInventory] = useState<ApiResponse<InventorySeriesResponse> | null>(null);
  const [weather, setWeather] = useState<ApiResponse<WeatherSnapshotResponse> | null>(null);
  const [filings, setFilings] = useState<ApiResponse<FilingFeedResponse> | null>(null);

  useEffect(() => {
    fetch('/api/meta').then(r => r.json()).then(data => setCommit(data.commit)).catch(() => setCommit('Unknown'));

    // Fetch live data
    fetchData<MarketBenchmarkResponse>('/api/data/market/benchmark').then(setBenchmarks);
    fetchData<InventorySeriesResponse>('/api/data/market/inventory').then(setInventory);
    fetchData<WeatherSnapshotResponse>('/api/data/context/weather?lat=29.7604&lon=-95.3698').then(setWeather);
    fetchData<FilingFeedResponse>('/api/data/regulatory/filings?limit=5').then(setFilings);
  }, []);

  const densityClass = density === 'compact' ? 'space-y-2' : 'space-y-6';
  const panelPadding = density === 'compact' ? 'p-4' : 'p-6';
  const fontSize = density === 'compact' ? 'text-xs' : 'text-sm';

  const renderProvenance = (prov?: ApiResponse<any>['provenance']) => {
    if (!inspectMode || !prov) return null;
    return (
      <div className="mt-4 pt-2 border-t border-dashed border-border text-[10px] font-mono text-data-warning space-y-1">
        <div>src: <a href={prov.source_url} target="_blank" rel="noreferrer" className="underline hover:text-white">{prov.source_name}</a></div>
        <div>retrieved: {prov.retrieved_at}</div>
        <div>cache: {prov.cache_policy || 'N/A'}</div>
        <div>notes: {prov.notes}</div>
      </div>
    );
  };

  const renderStatus = (status: string) => {
    if (status === 'ok') return <span className="text-data-positive text-[10px] uppercase font-bold tracking-wider">● LIVE</span>;
    return <span className="text-data-warning text-[10px] uppercase font-bold tracking-wider">● DEGRADED</span>;
  };

  return (
    <main className="min-h-screen bg-background text-text">
       {/* Header - duplicated from generic module page */}
       <header className="border-b border-border bg-surface sticky top-0 z-20">
         <div className="container mx-auto px-4 h-16 flex items-center justify-between">
           <div className="flex items-center space-x-4">
             <Link href="/" className="text-muted hover:text-white font-mono">←</Link>
             <h1 className="text-lg font-bold text-white font-sans">Market & Trading</h1>
             <Badge status="live">LIVE</Badge>
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

          {/* Left Rail - Context */}
          <aside className="lg:col-span-1 space-y-6">
             <div className="bg-surface/50 p-4 rounded border border-border">
               <h3 className="text-xs font-bold uppercase text-muted mb-4 tracking-wider">Live Data Slice</h3>
               <p className="text-sm text-white leading-relaxed mb-4">
                 Real-time ingestion of global energy benchmarks, inventory levels, weather conditions at key hubs, and regulatory filings.
               </p>
               <div className="text-xs text-muted font-mono">
                 <div className="flex justify-between"><span>EIA</span> <span>{benchmarks ? renderStatus(benchmarks.status) : '...'}</span></div>
                 <div className="flex justify-between"><span>OpenWeather</span> <span>{weather ? renderStatus(weather.status) : '...'}</span></div>
                 <div className="flex justify-between"><span>SEC EDGAR</span> <span>{filings ? renderStatus(filings.status) : '...'}</span></div>
               </div>
             </div>
          </aside>

          {/* Main Grid */}
          <section className={`lg:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-6`}>

             {/* Panel 1: Benchmarks */}
             <DataPanel title="Global Benchmarks" className={panelPadding}>
               {benchmarks?.data ? (
                 <div className="space-y-4">
                   <div className="flex justify-between items-end">
                     <span className="text-muted text-xs">WTI Crude</span>
                     <span className="text-2xl font-mono text-white">{benchmarks.data.wti_price?.toFixed(2) ?? '---'} <span className="text-xs text-muted">{benchmarks.data.unit}</span></span>
                   </div>
                   <div className="flex justify-between items-end">
                     <span className="text-muted text-xs">Brent Crude</span>
                     <span className="text-2xl font-mono text-white">{benchmarks.data.brent_price?.toFixed(2) ?? '---'} <span className="text-xs text-muted">{benchmarks.data.unit}</span></span>
                   </div>
                   <div className="text-[10px] text-muted text-right">As of: {benchmarks.data.last_updated}</div>
                 </div>
               ) : (
                 <div className="text-sm text-muted italic">Loading benchmarks...</div>
               )}
               {benchmarks?.status === 'degraded' && <div className="text-xs text-data-warning mt-2">Data stream degraded</div>}
               {renderProvenance(benchmarks?.provenance)}
             </DataPanel>

             {/* Panel 2: Inventories */}
             <DataPanel title="US Crude Inventory" className={panelPadding}>
                {inventory?.data ? (
                  <div className="space-y-4">
                    <div className="flex justify-between items-end">
                      <span className="text-muted text-xs">Latest</span>
                      <span className="text-2xl font-mono text-white">
                        {(inventory.data.series[0]?.value / 1000).toFixed(1)} <span className="text-xs text-muted">MMbbl</span>
                      </span>
                    </div>
                    <div className="space-y-1 mt-2">
                       <span className="text-[10px] uppercase text-muted tracking-wider">Recent Trend</span>
                       {inventory.data.series.slice(0, 5).map((point, i) => (
                         <div key={point.date} className="flex justify-between text-xs font-mono">
                           <span className="text-muted">{point.date}</span>
                           <span className="text-white">{(point.value / 1000).toFixed(1)}</span>
                         </div>
                       ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-sm text-muted italic">Loading inventory...</div>
                )}
                {inventory?.status === 'degraded' && <div className="text-xs text-data-warning mt-2">Data stream degraded</div>}
                {renderProvenance(inventory?.provenance)}
             </DataPanel>

             {/* Panel 3: Weather */}
             <DataPanel title="Weather Context (Houston)" className={panelPadding}>
                {weather?.data ? (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                       <span className="text-4xl font-mono text-white">{weather.data.temperature.toFixed(1)}°C</span>
                       <div className="text-right">
                         <div className="text-sm text-white capitalize">{weather.data.conditions}</div>
                         <div className="text-xs text-muted">Wind: {weather.data.wind_speed} m/s</div>
                       </div>
                    </div>
                    <div className="text-[10px] text-muted">Location: {weather.data.location}</div>
                  </div>
                ) : (
                  <div className="text-sm text-muted italic">Loading weather...</div>
                )}
                {weather?.status === 'degraded' && <div className="text-xs text-data-warning mt-2">Weather unavailable</div>}
                {renderProvenance(weather?.provenance)}
             </DataPanel>

             {/* Panel 4: Regulatory */}
             <DataPanel title="Regulatory Pulse (SEC)" className={panelPadding}>
                {filings?.data ? (
                  <div className="space-y-3">
                    {filings.data.filings.length === 0 ? (
                      <div className="text-xs text-muted italic">No recent filings found.</div>
                    ) : (
                      filings.data.filings.map((filing, i) => (
                        <a key={i} href={filing.link} target="_blank" rel="noreferrer" className="block p-2 bg-surface hover:bg-surface-highlight rounded transition-colors group">
                           <div className="flex justify-between items-start">
                             <span className="text-xs font-bold text-white group-hover:text-primary">{filing.ticker}</span>
                             <Badge status="declared" className="scale-75 origin-right">{filing.form_type}</Badge>
                           </div>
                           <div className="text-[10px] text-muted mt-1 truncate">{filing.company}</div>
                           <div className="text-[10px] text-muted text-right mt-1">{filing.filed_at}</div>
                        </a>
                      ))
                    )}
                  </div>
                ) : (
                  <div className="text-sm text-muted italic">Loading filings...</div>
                )}
                {filings?.status === 'degraded' && <div className="text-xs text-data-warning mt-2">Filings feed unavailable</div>}
                {renderProvenance(filings?.provenance)}
             </DataPanel>

          </section>

       </div>
    </main>
  );
}
