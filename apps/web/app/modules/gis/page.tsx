"use client";

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { Badge, DetailDrawer, getStandardTabs } from '@petrosquare/ui';
import { Basin, GISAsset, AISummary } from '@petrosquare/types';
import { GISLayer } from '@/lib/gis/types';
import FilterPanel from './components/FilterPanel';
import LayerControl from './components/LayerControl';
import AISummaryPanel from './components/AISummary';

// Dynamically import Map to avoid SSR window issues
const GISMap = dynamic(() => import('./components/Map'), { ssr: false, loading: () => <div className="h-full bg-slate-900 animate-pulse flex items-center justify-center text-muted">Loading Geospatial Engine...</div> });

export default function GISPage() {

  // --- State ---
  const [basins, setBasins] = useState<Basin[]>([]);

  // Layer Management
  const [layers, setLayers] = useState<GISLayer[]>([]);
  const [activeLayerIds, setActiveLayerIds] = useState<string[]>([]);
  const [loadingLayers, setLoadingLayers] = useState(true);

  const [selectedBasinId, setSelectedBasinId] = useState<string>('b-permian');
  const [selectedAsset, setSelectedAsset] = useState<GISAsset | null>(null);

  const [summary, setSummary] = useState<AISummary | null>(null);
  const [loadingSummary, setLoadingSummary] = useState(false);

  // --- Effects ---

  // Initial Load: Basins & Layers
  useEffect(() => {
    async function init() {
      try {
        const [basinsRes, layersRes] = await Promise.all([
             fetch('/api/gis/basins').then(r => r.json()),
             fetch('/api/gis/layers').then(r => r.json())
        ]);

        if (basinsRes.status === 'ok') setBasins(basinsRes.data);
        if (layersRes.status === 'ok') {
            const allLayers = layersRes.data as GISLayer[];
            setLayers(allLayers);
            // Default active layers: Wells, Pipelines
            setActiveLayerIds(allLayers.filter(l => l.id === 'l-wells' || l.id === 'l-pipelines').map(l => l.id));
        }
      } catch (e) {
        console.error("Failed to init GIS module", e);
      } finally {
        setLoadingLayers(false);
      }
    }
    init();
  }, []);

  // Fetch Basin Summary on change
  useEffect(() => {
    if (!selectedBasinId) return;
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

  const activeLayers = layers.filter(l => activeLayerIds.includes(l.id));

  const toggleLayer = (id: string) => {
      setActiveLayerIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

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
              <div className="flex items-center space-x-4 text-xs font-mono text-muted">
                  <span>Layers: {layers.length}</span>
                  <span className="h-4 w-px bg-border"></span>
                  <span>Active: {activeLayerIds.length}</span>
              </div>
           </div>
       </header>

       {/* Main Workspace */}
       <div className="flex-1 flex relative">

           {/* Left Panel - Filters */}
           <div className="w-80 bg-surface border-r border-border flex flex-col z-10 p-4 space-y-4 overflow-y-auto shrink-0">
               {/* Reuse FilterPanel just for Basin selection for now, pass dummy props for toggles */}
               <FilterPanel
                  basins={basins}
                  selectedBasinId={selectedBasinId}
                  onSelectBasin={setSelectedBasinId}
                  onRefresh={() => setSelectedBasinId(selectedBasinId)}

                  // Deprecated props (noop)
                  showWells={false} setShowWells={() => {}}
                  showPipelines={false} setShowPipelines={() => {}}
                  showHeatmap={false} setShowHeatmap={() => {}}
                  showCarbon={false} setShowCarbon={() => {}}
               />

               {/* New Layer Control */}
               <div className="border-t border-border pt-4">
                  <h2 className="text-xs uppercase text-muted mb-2 font-bold">Layer Registry</h2>
                  {loadingLayers ? (
                      <div className="text-xs text-muted animate-pulse">Loading Layers...</div>
                  ) : (
                      <LayerControl
                          layers={layers}
                          activeLayerIds={activeLayerIds}
                          onToggleLayer={toggleLayer}
                      />
                  )}
               </div>

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
                  activeLayers={activeLayers}
                  selectedAssetId={selectedAsset?.id}
                  onAssetSelect={setSelectedAsset}
                  center={center}
                  zoom={selectedBasinId === 'b-permian' ? 6 : 5}
               />

               {/* Overlay Loading State */}
               {loadingLayers && (
                   <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-surface/80 backdrop-blur px-4 py-2 rounded border border-primary text-xs text-primary animate-pulse z-[400]">
                       Loading GIS Module...
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
              tabs={getStandardTabs(selectedAsset, null, 'Asset')}
           />
       </div>
    </main>
  );
}
