"use client";

import { useEffect, useState } from 'react';
import GISMap from '@/app/modules/gis/components/Map';
import { Basin, GISAsset, DataEnvelope } from '@petrosquare/types';

export default function ControlCenterMap() {
  const [basins, setBasins] = useState<Basin[]>([]);
  const [assets, setAssets] = useState<GISAsset[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [basinsRes, assetsRes] = await Promise.all([
          fetch('/api/gis/basins'),
          fetch('/api/gis/assets')
        ]);

        const basinsData: DataEnvelope<Basin[]> = await basinsRes.json();
        const assetsData: DataEnvelope<GISAsset[]> = await assetsRes.json();

        if (basinsData.data) setBasins(basinsData.data);
        if (assetsData.data) setAssets(assetsData.data);
      } catch (e) {
        console.error("Failed to fetch GIS data", e);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return (
      <div className="h-[400px] w-full flex items-center justify-center bg-surface-highlight/5 rounded-xl border border-white/5 animate-pulse">
        <div className="text-muted text-sm">Loading Map...</div>
      </div>
  );

  return (
    <div className="h-[400px] w-full rounded-xl overflow-hidden border border-white/10 shadow-lg relative group">
        <GISMap
            basins={basins}
            assets={assets}
            onAssetSelect={(asset) => console.log('Selected asset:', asset)}
            center={[38, -98]} // Centered on US
            zoom={3.5}
            showWells={false}
            showPipelines={false}
            showHeatmap={false}
            showCarbon={false}
        />

        {/* Overlay Stats */}
        <div className="absolute top-4 left-4 bg-surface/90 backdrop-blur-md px-4 py-2 rounded-lg border border-white/10 shadow-lg pointer-events-none opacity-80 group-hover:opacity-100 transition-opacity">
            <div className="flex items-center gap-3">
                <div>
                    <div className="text-[10px] font-bold text-muted uppercase tracking-wider">Active Assets</div>
                    <div className="text-xl font-mono text-emerald-400 leading-none mt-0.5 shadow-emerald-500/20 drop-shadow-sm">{assets.length}</div>
                </div>
                <div className="h-8 w-px bg-white/10 mx-1"></div>
                <div>
                    <div className="text-[10px] font-bold text-muted uppercase tracking-wider">Basins</div>
                    <div className="text-xl font-mono text-blue-400 leading-none mt-0.5">{basins.length}</div>
                </div>
            </div>
        </div>
    </div>
  );
}
