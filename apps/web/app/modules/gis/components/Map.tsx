"use client";

import { useEffect, useRef } from 'react';
import { GISAsset, Basin, MapOverlay } from '@petrosquare/types';

interface MapProps {
  basins: Basin[];
  assets: GISAsset[];
  overlays: MapOverlay[];
  selectedAssetId?: string;
  onAssetSelect: (asset: GISAsset) => void;
  center?: [number, number];
  zoom?: number;
}

export default function GISMap({ basins, assets, overlays, selectedAssetId, onAssetSelect, center, zoom }: MapProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    // Simple Canvas-based Map Mock for stability if Leaflet fails
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Clear
        ctx.fillStyle = '#0F172A';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Draw "Basins"
        ctx.strokeStyle = '#3B82F6';
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 5]);
        ctx.strokeRect(100, 100, 400, 300); // Mock Basin
        ctx.fillStyle = '#3B82F6';
        ctx.font = '12px sans-serif';
        ctx.fillText("Permian Basin (Mock)", 110, 120);

        // Draw Assets
        assets.forEach((asset, i) => {
             // Simple projection simulation
             const x = ((asset.longitude + 103) * 100) + 200; // Mock projection
             const y = ((33 - asset.latitude) * 100) + 150;

             ctx.beginPath();
             ctx.arc(x, y, 4, 0, 2 * Math.PI);
             ctx.fillStyle = asset.type === 'WELL' ? '#10B981' : '#F59E0B';
             ctx.fill();

             if (selectedAssetId === asset.id) {
                 ctx.strokeStyle = 'white';
                 ctx.lineWidth = 2;
                 ctx.setLineDash([]);
                 ctx.stroke();
             }
        });

    }, [assets, selectedAssetId]);

    return (
        <div className="h-full w-full relative bg-slate-900 overflow-hidden">
             <div className="absolute top-4 left-4 z-10 bg-black/50 p-2 text-xs text-muted rounded">
                 Interactive Map Engine (Canvas Fallback)
             </div>
             <canvas
                ref={canvasRef}
                width={800}
                height={600}
                className="w-full h-full object-cover"
                onClick={(e) => {
                    // Mock click handler - select random asset for demo
                    if (assets.length > 0) {
                        const random = assets[Math.floor(Math.random() * assets.length)];
                        onAssetSelect(random);
                    }
                }}
             />
             {/* Legend */}
             <div className="absolute bottom-6 right-6 bg-surface/90 backdrop-blur p-3 rounded border border-border text-xs">
                <div className="font-bold text-white mb-2">Map Layers</div>
                <div className="flex flex-col space-y-1">
                    <div className="flex items-center space-x-2">
                        <span className="w-3 h-3 rounded-full bg-data-positive"></span>
                        <span className="text-muted">High Prod / Low Risk</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
