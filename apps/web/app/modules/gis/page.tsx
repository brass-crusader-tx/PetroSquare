"use client";

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { PageHeader, StatusPill } from '@petrosquare/ui';
import { Basin, GISAsset, MapOverlay, AISummary } from '@petrosquare/types';
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
    <div className="flex flex-col h-full">
       <PageHeader
            title="GIS & Asset Intelligence"
            description="Geospatial analysis of assets, basins, and infrastructure."
            actions={
                <div className="flex items-center space-x-4 text-xs font-mono text-muted">
                    <StatusPill status="success">Live</StatusPill>
                    <span>Assets: {assets.length}</span>
                    <span className="h-4 w-px bg-border"></span>
                    <span>Latency: 12ms</span>
                </div>
            }
       />

       {/* Main Workspace */}
       <div className="flex-1 flex relative overflow-hidden border-t border-border">

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
           <div className="flex-1 relative bg-black min-h-[500px]">
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
    </div>
  );
}
