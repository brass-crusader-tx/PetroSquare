"use client";

import { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import { PageContainer, SectionHeader, DataPanel, Badge, IconButton, Button } from '@petrosquare/ui';
import { useDensity } from '../../../context/DensityContext';
import { DensityToggle } from '../../../components/DensityToggle';
import { RegionRef, ProductionSeriesResponse, ReservesSeriesResponse, TopProducersResponse, DataEnvelope, RegionKind } from '@petrosquare/types';

// --- Types ---

type Metric = 'PRODUCTION' | 'RESERVES';
type Tab = 'DETAIL' | 'TOP_PRODUCERS';

interface RegionOption {
  kind: RegionKind;
  code: string;
  name: string;
}

// --- Components ---

function ProvenanceBlock({ provenance, className }: { provenance?: any, className?: string }) {
  if (!provenance) return null;
  return (
    <div className={`text-xs font-mono text-muted border-t border-border mt-4 pt-2 ${className}`}>
      <div className="flex justify-between items-center mb-1">
        <span className="uppercase tracking-wider text-[10px]">Source</span>
        <span className="text-white">{provenance.source_name}</span>
      </div>
      {provenance.retrieved_at && (
        <div className="flex justify-between items-center mb-1">
          <span className="uppercase tracking-wider text-[10px]">Retrieved</span>
          <span>{new Date(provenance.retrieved_at).toLocaleDateString()}</span>
        </div>
      )}
      {provenance.units && (
        <div className="flex justify-between items-center mb-1">
           <span className="uppercase tracking-wider text-[10px]">Units</span>
           <span className="text-data-positive">{provenance.units}</span>
        </div>
      )}
      {provenance.notes && (
        <div className="mt-2 text-[10px] italic text-muted">
           {provenance.notes}
        </div>
      )}
       {provenance.cache_policy && (
        <div className="mt-1 text-[10px] text-data-warning">
           Cache: {provenance.cache_policy}
        </div>
      )}
    </div>
  );
}

function ErrorPanel({ error }: { error: any }) {
    if (!error) return null;
    return (
        <div className="bg-red-900/20 border border-red-900/50 p-4 rounded text-red-200 text-sm font-mono">
            <strong>Error:</strong> {error.message || 'Unknown error'}
            {error.code && <span className="block text-xs mt-1 opacity-70">Code: {error.code}</span>}
        </div>
    );
}

export default function ProductionPage() {
  const { density, inspectMode } = useDensity();

  // --- State ---
  const [activeTab, setActiveTab] = useState<Tab>('DETAIL');

  // Detail Tab State
  const [regions, setRegions] = useState<RegionOption[]>([]);
  const [loadingRegions, setLoadingRegions] = useState(true);
  const [selectedKind, setSelectedKind] = useState<RegionKind>('US_STATE');
  const [selectedRegionCode, setSelectedRegionCode] = useState<string>('');
  const [selectedMetric, setSelectedMetric] = useState<Metric>('PRODUCTION');
  const [dateRangeStart, setDateRangeStart] = useState<string>(''); // YYYY-MM
  const [dateRangeEnd, setDateRangeEnd] = useState<string>(''); // YYYY-MM

  // Data State
  const [seriesData, setSeriesData] = useState<ProductionSeriesResponse | ReservesSeriesResponse | null>(null);
  const [loadingData, setLoadingData] = useState(false);
  const [dataError, setDataError] = useState<any>(null);

  // Top Producers State
  const [topLimit, setTopLimit] = useState<number>(10);
  const [topProducersData, setTopProducersData] = useState<TopProducersResponse | null>(null);
  const [loadingTop, setLoadingTop] = useState(false);
  const [topError, setTopError] = useState<any>(null);
  const [topKind, setTopKind] = useState<RegionKind>('US_STATE');


  // --- Effects ---

  // 1. Fetch Regions on Mount
  useEffect(() => {
    async function fetchRegions() {
      try {
        const res = await fetch('/api/data/production-reserves/regions');
        const json = await res.json() as DataEnvelope<RegionRef[]>;
        if (json.status === 'ok' && json.data) {
          setRegions(json.data);
          // Set default selection
          const defaultUs = json.data.find(r => r.kind === 'US_STATE' && r.code === 'TX');
          if (defaultUs) setSelectedRegionCode(defaultUs.code);
        }
      } catch (e) {
        console.error("Failed to fetch regions", e);
      } finally {
        setLoadingRegions(false);
      }
    }
    fetchRegions();
  }, []);

  // 2. Fetch Series Data when selections change
  useEffect(() => {
    if (!selectedRegionCode) return;

    async function fetchData() {
      setLoadingData(true);
      setSeriesData(null);
      setDataError(null);

      const endpoint = selectedMetric === 'PRODUCTION' ? 'production' : 'reserves';
      // Default dates
      let start = dateRangeStart;
      let end = dateRangeEnd;

      if (!start && !end) {
          // Defaults
          const now = new Date();
          if (selectedMetric === 'PRODUCTION') {
              // Last 24 months
              const past = new Date();
              past.setMonth(now.getMonth() - 24);
              start = past.toISOString().slice(0, 7);
          } else {
              // Last 10 years (Reserves are annual)
              const past = new Date();
              past.setFullYear(now.getFullYear() - 10);
              start = past.getFullYear().toString();
          }
      }

      const params = new URLSearchParams({
          kind: selectedKind,
          code: selectedRegionCode,
      });
      if (start) params.append('start', start);
      if (end) params.append('end', end);

      try {
          const res = await fetch(`/api/data/production-reserves/${endpoint}?${params.toString()}`);
          const json = await res.json() as DataEnvelope<any>;

          if (json.status === 'ok' && json.data) {
              setSeriesData(json.data);
              // Update local storage for Inspector
              if (selectedKind === 'US_STATE') {
                  localStorage.setItem('petrosquare-eia-last-fetch', new Date().toISOString());
              } else {
                  localStorage.setItem('petrosquare-cer-last-fetch', new Date().toISOString());
              }
          } else if (json.status === 'degraded') {
              // Degraded might mean error or partial data.
              // If error is present, show it.
              if (json.error) {
                  setDataError(json.error);
              } else {
                  setSeriesData(null);
              }
          } else {
               setDataError(json.error || { message: 'Unknown error' });
          }
      } catch (e) {
          setDataError({ message: 'Network error' });
      } finally {
          setLoadingData(false);
      }
    }

    // Debounce slightly or just run
    fetchData();
  }, [selectedKind, selectedRegionCode, selectedMetric, dateRangeStart, dateRangeEnd]); // Removed date range dependencies to avoid loops if dates are derived inside, but here they are state.

  // 3. Fetch Top Producers when tab is active or params change
  useEffect(() => {
      if (activeTab !== 'TOP_PRODUCERS') return;

      async function fetchTop() {
          setLoadingTop(true);
          setTopProducersData(null);
          setTopError(null);

          const params = new URLSearchParams({
              kind: topKind,
              limit: topLimit.toString()
          });

          try {
              const res = await fetch(`/api/data/production-reserves/top-producers?${params.toString()}`);
              const json = await res.json() as DataEnvelope<TopProducersResponse>;

              if (json.status === 'ok' && json.data) {
                  setTopProducersData(json.data);
                  // Update local storage for Inspector
                  if (topKind === 'US_STATE') {
                      localStorage.setItem('petrosquare-eia-last-fetch', new Date().toISOString());
                  } else {
                      localStorage.setItem('petrosquare-cer-last-fetch', new Date().toISOString());
                  }
              } else {
                   setTopError(json.error || { message: 'Unknown error' });
              }
          } catch (e) {
              setTopError({ message: 'Network error' });
          } finally {
              setLoadingTop(false);
          }
      }

      fetchTop();
  }, [activeTab, topKind, topLimit]);


  // --- Render Helpers ---

  const filteredRegions = useMemo(() => {
      return regions.filter(r => r.kind === selectedKind);
  }, [regions, selectedKind]);

  // Determine latest value from series
  const latestValueObj = useMemo(() => {
      if (!seriesData || !seriesData.series || seriesData.series.length === 0) return null;
      // Assume series is sorted desc by period (API does this)
      const latest = seriesData.series[0];
      const previous = seriesData.series[1];

      const delta = previous ? latest.value - previous.value : 0;
      const deltaPercent = previous && previous.value !== 0 ? (delta / previous.value) * 100 : 0;

      return {
          value: latest.value,
          period: latest.period,
          delta,
          deltaPercent,
          units: seriesData.units
      };
  }, [seriesData]);

  // --- Handlers ---

  const handleExportCsv = () => {
      if (!seriesData) return;
      const headers = ['Period', `Value (${seriesData.units})`];
      const rows = seriesData.series.map(p => `${p.period},${p.value}`);
      const csv = [headers.join(','), ...rows].join('\n');
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `production_data_${selectedRegionCode}.csv`;
      a.click();
  };

  const handleExportJson = () => {
      if (!seriesData) return;
      const json = JSON.stringify(seriesData, null, 2);
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `production_data_${selectedRegionCode}.json`;
      a.click();
  };

  const navigateToRegion = (kind: RegionKind, code: string) => {
      setActiveTab('DETAIL');
      setSelectedKind(kind);
      setSelectedRegionCode(code);
      setSelectedMetric('PRODUCTION');
  };


  // --- UI ---

  const densityClass = density === 'compact' ? 'space-y-2' : 'space-y-6';
  const panelPadding = density === 'compact' ? 'p-4' : 'p-6';

  return (
    <main className="min-h-screen bg-background text-text">
       <header className="border-b border-border bg-surface sticky top-0 z-20">
         <div className="container mx-auto px-4 h-16 flex items-center justify-between">
           <div className="flex items-center space-x-4">
             <Link href="/" className="text-muted hover:text-white font-mono">←</Link>
             <h1 className="text-lg font-bold text-white font-sans">Production & Reserves</h1>
             <Badge status="live">Live</Badge>
           </div>
           <div className="flex items-center space-x-4">
              <DensityToggle />
           </div>
         </div>
       </header>

       <div className="container mx-auto px-4 py-8">

           {/* Tab Navigation */}
           <div className="flex space-x-4 mb-6 border-b border-border pb-1">
               <button
                  onClick={() => setActiveTab('DETAIL')}
                  className={`pb-2 px-1 font-mono text-sm border-b-2 transition-colors ${activeTab === 'DETAIL' ? 'border-primary text-primary' : 'border-transparent text-muted hover:text-white'}`}
               >
                   Region Detail
               </button>
               <button
                  onClick={() => setActiveTab('TOP_PRODUCERS')}
                  className={`pb-2 px-1 font-mono text-sm border-b-2 transition-colors ${activeTab === 'TOP_PRODUCERS' ? 'border-primary text-primary' : 'border-transparent text-muted hover:text-white'}`}
               >
                   Top Producers
               </button>
           </div>

           {activeTab === 'DETAIL' && (
               <div className={`grid grid-cols-1 lg:grid-cols-4 gap-8 ${densityClass}`}>

                   {/* Controls Rail */}
                   <aside className="lg:col-span-1 space-y-6">
                       <DataPanel title="Configuration" className={panelPadding}>
                           <div className="space-y-4">
                               <div>
                                   <label className="block text-xs uppercase text-muted mb-2">Region Kind</label>
                                   <div className="flex space-x-2">
                                       <button
                                          onClick={() => { setSelectedKind('US_STATE'); setSelectedRegionCode('TX'); }}
                                          className={`px-3 py-1 text-xs rounded border ${selectedKind === 'US_STATE' ? 'bg-primary border-primary text-white' : 'bg-transparent border-border text-muted'}`}
                                       >
                                           US State
                                       </button>
                                       <button
                                          onClick={() => { setSelectedKind('CA_PROVINCE'); setSelectedRegionCode('AB'); }}
                                          className={`px-3 py-1 text-xs rounded border ${selectedKind === 'CA_PROVINCE' ? 'bg-primary border-primary text-white' : 'bg-transparent border-border text-muted'}`}
                                       >
                                           CA Province
                                       </button>
                                   </div>
                               </div>

                               <div>
                                   <label className="block text-xs uppercase text-muted mb-2">Region</label>
                                   <select
                                      value={selectedRegionCode}
                                      onChange={(e) => setSelectedRegionCode(e.target.value)}
                                      className="w-full bg-surface-highlight border border-border text-white text-sm rounded p-2 focus:ring-1 focus:ring-primary outline-none"
                                      disabled={loadingRegions}
                                   >
                                       {filteredRegions.map(r => (
                                           <option key={r.code} value={r.code}>{r.name} ({r.code})</option>
                                       ))}
                                   </select>
                               </div>

                               <div>
                                   <label className="block text-xs uppercase text-muted mb-2">Metric</label>
                                   <div className="flex space-x-2">
                                       <button
                                          onClick={() => setSelectedMetric('PRODUCTION')}
                                          className={`px-3 py-1 text-xs rounded border ${selectedMetric === 'PRODUCTION' ? 'bg-primary border-primary text-white' : 'bg-transparent border-border text-muted'}`}
                                       >
                                           Production
                                       </button>
                                       <button
                                          onClick={() => setSelectedMetric('RESERVES')}
                                          className={`px-3 py-1 text-xs rounded border ${selectedMetric === 'RESERVES' ? 'bg-primary border-primary text-white' : 'bg-transparent border-border text-muted'}`}
                                       >
                                           Reserves
                                       </button>
                                   </div>
                               </div>

                               {/* Date Range - Simplified */}
                               <div>
                                   <label className="block text-xs uppercase text-muted mb-2">Date Range</label>
                                   <div className="flex items-center space-x-2">
                                       <input
                                          type="text"
                                          placeholder={selectedMetric === 'PRODUCTION' ? "YYYY-MM" : "YYYY"}
                                          value={dateRangeStart}
                                          onChange={e => setDateRangeStart(e.target.value)}
                                          className="w-full bg-surface-highlight border border-border text-white text-xs rounded p-2"
                                       />
                                       <span className="text-muted">-</span>
                                       <input
                                          type="text"
                                          placeholder={selectedMetric === 'PRODUCTION' ? "YYYY-MM" : "YYYY"}
                                          value={dateRangeEnd}
                                          onChange={e => setDateRangeEnd(e.target.value)}
                                          className="w-full bg-surface-highlight border border-border text-white text-xs rounded p-2"
                                       />
                                   </div>
                               </div>
                           </div>
                       </DataPanel>

                       <DataPanel title="Export" className={panelPadding}>
                            <div className="flex flex-col space-y-2">
                                <Button onClick={handleExportCsv} disabled={!seriesData} variant="secondary">Download CSV</Button>
                                <Button onClick={handleExportJson} disabled={!seriesData} variant="secondary">Download JSON</Button>
                            </div>
                       </DataPanel>
                   </aside>

                   {/* Main Content */}
                   <section className={`lg:col-span-3 ${densityClass}`}>
                       {/* Header Panel */}
                        <div className="flex items-center justify-between">
                            <h2 className="text-2xl font-bold text-white">
                                {regions.find(r => r.code === selectedRegionCode)?.name || selectedRegionCode}
                                <span className="ml-2 text-muted font-normal text-lg">/ {selectedMetric}</span>
                            </h2>
                            {latestValueObj && (
                                <div className="text-right">
                                    <div className="text-3xl font-mono text-white">
                                        {latestValueObj.value.toLocaleString()} <span className="text-sm text-muted">{latestValueObj.units}</span>
                                    </div>
                                    <div className={`text-xs font-mono ${latestValueObj.delta >= 0 ? 'text-data-positive' : 'text-data-critical'}`}>
                                        {latestValueObj.delta >= 0 ? '+' : ''}{latestValueObj.delta.toLocaleString()} ({latestValueObj.deltaPercent.toFixed(1)}%) vs prev
                                    </div>
                                    <div className="text-[10px] text-muted uppercase tracking-wider mt-1">
                                        As of {latestValueObj.period}
                                    </div>
                                </div>
                            )}
                        </div>

                        {loadingData && (
                            <div className="animate-pulse bg-surface-highlight h-64 rounded"></div>
                        )}

                        {dataError && (
                            <ErrorPanel error={dataError} />
                        )}

                        {!loadingData && !dataError && seriesData && (
                           <>
                             <DataPanel title="Trend" className={panelPadding}>
                                 {/* Simple List for MVP instead of Chart Library (avoiding extra deps for now) */}
                                 <div className="max-h-96 overflow-y-auto">
                                    <table className="w-full text-sm font-mono text-left">
                                        <thead className="text-muted text-xs uppercase bg-surface-highlight sticky top-0">
                                            <tr>
                                                <th className="p-2">Period</th>
                                                <th className="p-2 text-right">Value ({seriesData.units})</th>
                                                <th className="p-2 text-right">Trend</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-border">
                                            {seriesData.series.map((point, i) => {
                                                const prev = seriesData.series[i + 1];
                                                const trend = prev ? (point.value - prev.value) : 0;
                                                return (
                                                    <tr key={point.period} className="hover:bg-surface-highlight/50">
                                                        <td className="p-2">{point.period}</td>
                                                        <td className="p-2 text-right">{point.value.toLocaleString()}</td>
                                                        <td className={`p-2 text-right ${trend >= 0 ? 'text-data-positive' : 'text-data-critical'}`}>
                                                            {trend !== 0 ? (trend > 0 ? '↑' : '↓') : '-'}
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                 </div>
                             </DataPanel>

                             {(inspectMode || true) && ( // Always show provenance but style it
                                 <DataPanel title="Provenance & Assumptions" className={panelPadding}>
                                     <ProvenanceBlock provenance={seriesData.provenance} />
                                 </DataPanel>
                             )}
                           </>
                        )}
                   </section>
               </div>
           )}

           {activeTab === 'TOP_PRODUCERS' && (
               <div className={`grid grid-cols-1 lg:grid-cols-4 gap-8 ${densityClass}`}>
                   <aside className="lg:col-span-1 space-y-6">
                       <DataPanel title="Ranking Configuration" className={panelPadding}>
                            <div className="space-y-4">
                               <div>
                                   <label className="block text-xs uppercase text-muted mb-2">Region Kind</label>
                                   <div className="flex space-x-2">
                                       <button
                                          onClick={() => setTopKind('US_STATE')}
                                          className={`px-3 py-1 text-xs rounded border ${topKind === 'US_STATE' ? 'bg-primary border-primary text-white' : 'bg-transparent border-border text-muted'}`}
                                       >
                                           US States
                                       </button>
                                       <button
                                          onClick={() => setTopKind('CA_PROVINCE')}
                                          className={`px-3 py-1 text-xs rounded border ${topKind === 'CA_PROVINCE' ? 'bg-primary border-primary text-white' : 'bg-transparent border-border text-muted'}`}
                                       >
                                           CA Provinces
                                       </button>
                                   </div>
                               </div>

                               <div>
                                   <label className="block text-xs uppercase text-muted mb-2">Limit</label>
                                   <select
                                      value={topLimit}
                                      onChange={(e) => setTopLimit(Number(e.target.value))}
                                      className="w-full bg-surface-highlight border border-border text-white text-sm rounded p-2 focus:ring-1 focus:ring-primary outline-none"
                                   >
                                       <option value={5}>Top 5</option>
                                       <option value={10}>Top 10</option>
                                       <option value={20}>Top 20</option>
                                   </select>
                               </div>

                               <div className="pt-4 border-t border-border">
                                   <Button onClick={() => { setTopProducersData(null); setLoadingTop(true); /* trigger effect */ }} variant="secondary" className="w-full text-xs">
                                       Refresh Data
                                   </Button>
                               </div>
                           </div>
                       </DataPanel>
                   </aside>

                   <section className={`lg:col-span-3 ${densityClass}`}>
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-bold text-white">Top Producers (Latest Month)</h2>
                            {topProducersData && (
                                <span className="text-xs font-mono text-muted">
                                    Period: <span className="text-white">{topProducersData.latest_period}</span>
                                </span>
                            )}
                        </div>

                        {loadingTop && (
                             <div className="animate-pulse bg-surface-highlight h-64 rounded"></div>
                        )}

                        {topError && <ErrorPanel error={topError} />}

                        {!loadingTop && topProducersData && (
                            <>
                                <DataPanel className={panelPadding}>
                                    <table className="w-full text-sm font-mono text-left">
                                        <thead className="text-muted text-xs uppercase border-b border-border">
                                            <tr>
                                                <th className="p-3">Rank</th>
                                                <th className="p-3">Region</th>
                                                <th className="p-3 text-right">Production ({topProducersData.units})</th>
                                                <th className="p-3 text-right">Period</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-border">
                                            {topProducersData.rows.map((row) => (
                                                <tr
                                                    key={row.region.code}
                                                    className="hover:bg-surface-highlight/50 cursor-pointer transition-colors"
                                                    onClick={() => navigateToRegion(row.region.kind, row.region.code)}
                                                >
                                                    <td className="p-3 text-muted">#{row.rank}</td>
                                                    <td className="p-3 font-semibold text-white">{row.region.name}</td>
                                                    <td className="p-3 text-right">{row.latest_value.toLocaleString()}</td>
                                                    <td className="p-3 text-right text-muted">{row.latest_period}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </DataPanel>

                                {inspectMode && (
                                    <DataPanel title="Ranking Methodology" className={`mt-6 ${panelPadding}`}>
                                        <ProvenanceBlock provenance={topProducersData.provenance} />
                                    </DataPanel>
                                )}
                            </>
                        )}
                   </section>
               </div>
           )}
       </div>
    </main>
  );
}
