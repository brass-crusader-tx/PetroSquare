"use client";

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { Badge, DetailDrawer } from '@petrosquare/ui';
import { Basin, GISAsset, MapOverlay, AISummary } from '@petrosquare/types';
import FilterPanel from './components/FilterPanel';
import AISummaryPanel from './components/AISummary';

// Dynamically import Map to avoid SSR window issues
const GISMap = dynamic(() => import('./components/Map'), { ssr: false, loading: () => <div className="h-full bg-slate-900 animate-pulse flex items-center justify-center text-muted">Loading Geospatial Engine...</div> });

export default function GISPage() {

  // --- State ---
  const [basins, setBasins] = useState<Basin[]>([]);
  const [assets, setAssets] = useState<GISAsset[]>([]);
  const [overlays, setOverlays] = useState<MapOverlay[]>([]);

  const [selectedBasinId, setSelectedBasinId] = useState<string>('b-permian');
  const [selectedAsset, setSelectedAsset] = useState<GISAsset | null>(null);

  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState<AISummary | null>(null);
  const [loadingSummary, setLoadingSummary] = useState(false);

  // Layer Toggles
  const [showWells, setShowWells] = useState(true);
  const [showPipelines, setShowPipelines] = useState(true);

  // --- Effects ---

  // Initial Load
  useEffect(() => {
    async function init() {
      try {
        const [basinsRes, overlaysRes] = await Promise.all([
          fetch('/api/gis/basins').then(r => r.json()),
          fetch('/api/gis/overlays').then(r => r.json())
        ]);

        if (basinsRes.status === 'ok') setBasins(basinsRes.data);
        if (overlaysRes.status === 'ok') setOverlays(overlaysRes.data);
      } catch (e) {
        console.error("Failed to init GIS module", e);
      }
    }
    init();
  }, []);

  // Fetch Assets on Basin Change
  useEffect(() => {
    if (!selectedBasinId) return;

    async function loadAssets() {
      setLoading(true);
      try {
        const res = await fetch(`/api/gis/assets?basin_id=${selectedBasinId}`);
        const json = await res.json();
        if (json.status === 'ok') {
          setAssets(json.data);
        }
      } catch (e) {
        console.error("Failed to load assets", e);
      } finally {
        setLoading(false);
      }
    }
    loadAssets();

    // Also fetch Basin Summary
    fetchBasinSummary(selectedBasinId);

  }, [selectedBasinId]);

  const fetchBasinSummary = async (id: string) => {
      setLoadingSummary(true);
      setSummary(null);
      try {
          const res = await fetch(`/api/gis/ai-summary?context_id=${id}`);
          const json = await res.json();
          if (json.status === 'ok') {
              setSummary(json.data);
          }
      } catch(e) {
          console.error("Failed to load summary", e);
      } finally {
          setLoadingSummary(false);
      }
  };

  const selectedBasin = basins.find(b => b.id === selectedBasinId);
  const center: [number, number] | undefined = selectedBasin ? selectedBasin.center : undefined;

  return (
    <main className="h-screen w-screen bg-background text-text flex flex-col overflow-hidden">
       {/* Header */}
       <header className="border-b border-border bg-surface sticky top-0 z-20 h-16 shrink-0 flex items-center justify-between px-4">
           <div className="flex items-center space-x-4">
             <Link href="/" className="text-muted hover:text-white font-mono">←</Link>
             <h1 className="text-lg font-bold text-white font-sans">GIS & Asset Intelligence</h1>
             <Badge status="live">Live</Badge>
           </div>
           <div className="flex items-center space-x-4">
              {/* Layer Toggles in Header for easy access */}
              <div className="flex space-x-2 mr-4">
                  <button onClick={() => setShowWells(!showWells)} className={`px-2 py-1 text-xs font-mono rounded border ${showWells ? 'bg-emerald-900/30 text-emerald-300 border-emerald-900' : 'bg-surface text-muted border-border'}`}>
                      WELLS
                  </button>
                  <button onClick={() => setShowPipelines(!showPipelines)} className={`px-2 py-1 text-xs font-mono rounded border ${showPipelines ? 'bg-amber-900/30 text-amber-300 border-amber-900' : 'bg-surface text-muted border-border'}`}>
                      PIPELINES
                  </button>
              </div>

              <div className="flex items-center space-x-4 text-xs font-mono text-muted">
                  <span>Assets: {assets.length}</span>
                  <span className="h-4 w-px bg-border"></span>
                  <span>Latency: 12ms</span>
              </div>
           </div>
       </header>

       {/* Main Workspace */}
       <div className="flex-1 flex relative">

           {/* Left Panel - Filters */}
           <div className="w-80 bg-surface border-r border-border flex flex-col z-10 p-4 space-y-4 overflow-y-auto shrink-0">
               <FilterPanel
                  basins={basins}
                  selectedBasinId={selectedBasinId}
                  onSelectBasin={setSelectedBasinId}
                  overlays={overlays}
                  onToggleOverlay={(id) => setOverlays(prev => prev.map(o => o.id === id ? { ...o, visible: !o.visible } : o))}
                  onRefresh={() => setSelectedBasinId(selectedBasinId)}
               />

               <AISummaryPanel
                  title={`Basin Intelligence: ${selectedBasin?.code || ''}`}
                  summary={summary}
                  loading={loadingSummary}
                  onGenerate={() => fetchBasinSummary(selectedBasinId)}
               />
           </div>

           {/* Center - Map */}
           <div className="flex-1 relative bg-black">
               <GISMap
                  basins={basins}
                  assets={assets}
                  overlays={overlays}
                  selectedAssetId={selectedAsset?.id}
                  onAssetSelect={setSelectedAsset}
                  center={center}
                  zoom={selectedBasinId === 'b-permian' ? 6 : 5}
                  showWells={showWells}
                  showPipelines={showPipelines}
               />

               {/* Overlay Loading State */}
               {loading && (
                   <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-surface/80 backdrop-blur px-4 py-2 rounded border border-primary text-xs text-primary animate-pulse z-[400]">
                       Updating Geospatial Index...
                   </div>
               )}
           </div>

           {/* Right Panel - DetailDrawer */}
           <DetailDrawer
              isOpen={!!selectedAsset}
              onClose={() => setSelectedAsset(null)}
              title={selectedAsset?.name || 'Asset Details'}
              subtitle={selectedAsset?.type || 'Unknown Type'}
              source="Internal GIS DB + Real-time Telemetry"
              timestamp={new Date().toISOString()}
              tabs={[
                  {
                      id: 'overview',
                      label: 'Overview',
                      content: (
                          <div className="space-y-4">
                              <div className="grid grid-cols-2 gap-4">
                                  <div className="p-3 bg-surface-highlight/10 rounded border border-border">
                                      <div className="text-xs text-muted uppercase">Status</div>
                                      <div className="text-lg font-mono text-white">{selectedAsset?.status}</div>
                                  </div>
                                  <div className="p-3 bg-surface-highlight/10 rounded border border-border">
                                      <div className="text-xs text-muted uppercase">Operator</div>
                                      <div className="text-sm font-mono text-white truncate">{selectedAsset?.operator_id}</div>
                                  </div>
                              </div>
                              <div className="p-3 bg-surface-highlight/10 rounded border border-border">
                                  <div className="text-xs text-muted uppercase mb-1">Coordinates</div>
                                  <div className="text-sm font-mono text-white">{selectedAsset?.latitude.toFixed(4)}, {selectedAsset?.longitude.toFixed(4)}</div>
                              </div>
                              {selectedAsset?.metadata && (
                                  <div className="p-3 bg-surface-highlight/10 rounded border border-border">
                                      <div className="text-xs text-muted uppercase mb-1">Metadata</div>
                                      <pre className="text-[10px] font-mono text-muted whitespace-pre-wrap">{JSON.stringify(selectedAsset.metadata, null, 2)}</pre>
                                  </div>
                              )}
                          </div>
                      )
                  },
                  {
                      id: 'production',
                      label: 'Production',
                      content: <div className="text-sm text-muted">Production data visualization would go here.</div>
                  },
                  {
                      id: 'risk',
                      label: 'Risk',
                      content: <div className="text-sm text-muted">Risk assessment matrix.</div>
                  }
              ]}
           />
       </div>
    </main>
  );
}
