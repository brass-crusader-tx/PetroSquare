"use client";

import { useEffect, useState, useMemo } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { PageContainer, Badge, Drawer } from '@petrosquare/ui';
import { Basin, GISAsset, MapOverlay, AISummary, DataEnvelope } from '@petrosquare/types';
import FilterPanel from './components/FilterPanel';
import AssetDetails from './components/AssetDetails';
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
          // Center map if possible (handled by map component via props)
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

  // --- Handlers ---

  const handleToggleOverlay = (id: string) => {
    setOverlays(prev => prev.map(o => o.id === id ? { ...o, visible: !o.visible } : o));
  };

  const handleAssetSelect = (asset: GISAsset) => {
      setSelectedAsset(asset);
  };

  const selectedBasin = basins.find(b => b.id === selectedBasinId);
  const center: [number, number] | undefined = selectedBasin ? selectedBasin.center : undefined;

  return (
    <main className="h-screen w-screen bg-background text-text flex flex-col overflow-hidden">
       {/* Header */}
       <header className="border-b border-border bg-surface sticky top-0 z-20 h-16 shrink-0">
         <div className="container mx-auto px-4 h-full flex items-center justify-between">
           <div className="flex items-center space-x-4">
             <Link href="/" className="text-muted hover:text-white font-mono">←</Link>
             <h1 className="text-lg font-bold text-white font-sans">GIS & Asset Intelligence</h1>
             <Badge status="live">Live</Badge>
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
                  onToggleOverlay={handleToggleOverlay}
                  onRefresh={() => setSelectedBasinId(selectedBasinId)} // Simple refresh
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
                  onAssetSelect={handleAssetSelect}
                  center={center}
                  zoom={selectedBasinId === 'b-permian' ? 6 : 5}
               />

               {/* Overlay Loading State */}
               {loading && (
                   <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-surface/80 backdrop-blur px-4 py-2 rounded border border-primary text-xs text-primary animate-pulse z-[400]">
                       Updating Geospatial Index...
                   </div>
               )}
           </div>

           {/* Right Panel - Asset Details (Drawer) */}
           {selectedAsset && (
               <AssetDetails
                  asset={selectedAsset}
                  onClose={() => setSelectedAsset(null)}
               />
           )}
       </div>
    </main>
  );
}
