"use client";

import { useEffect, useRef, useState } from 'react';
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
    const [hoveredInfo, setHoveredInfo] = useState<{x: number, y: number, text: string} | null>(null);

    const showInfra = overlays.find(o => o.id === 'ov-infra')?.visible;
    const showHeatmap = overlays.find(o => o.id === 'ov-econ')?.visible;
    const showCarbon = overlays.find(o => o.id === 'ov-carbon')?.visible;

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Clear
        ctx.fillStyle = '#0F172A';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // --- Layers ---

        // 1. Heatmap (Economy) - Mock gradient
        if (showHeatmap) {
            const gradient = ctx.createRadialGradient(400, 300, 50, 400, 300, 300);
            gradient.addColorStop(0, 'rgba(16, 185, 129, 0.2)');
            gradient.addColorStop(1, 'rgba(16, 185, 129, 0)');
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
        }

        // 2. Carbon Intensity - Mock red zones
        if (showCarbon) {
             ctx.fillStyle = 'rgba(239, 68, 68, 0.15)';
             ctx.beginPath();
             ctx.arc(600, 200, 80, 0, 2 * Math.PI);
             ctx.fill();
        }

        // 3. Basins
        ctx.strokeStyle = '#3B82F6';
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 5]);
        ctx.strokeRect(100, 100, 400, 300);
        ctx.fillStyle = '#3B82F6';
        ctx.font = '12px sans-serif';
        ctx.fillText("Permian Basin", 110, 120);

        // 4. Wells (Bottom)
        assets.filter(a => a.type === 'WELL').forEach(asset => drawAsset(ctx, asset));

        // 5. Pipelines & Facilities (Top)
        if (showInfra) {
            // Mock pipelines connecting some dots
            ctx.beginPath();
            ctx.moveTo(150, 150);
            ctx.lineTo(450, 350);
            ctx.strokeStyle = '#F59E0B';
            ctx.lineWidth = 4;
            ctx.setLineDash([]);
            ctx.stroke();

            assets.filter(a => a.type !== 'WELL').forEach(asset => drawAsset(ctx, asset));
        }

        function drawAsset(ctx: CanvasRenderingContext2D, asset: GISAsset) {
             // Simple projection simulation
             const x = ((asset.longitude + 103) * 100) + 200;
             const y = ((33 - asset.latitude) * 100) + 150;

             ctx.beginPath();
             ctx.arc(x, y, asset.type === 'WELL' ? 4 : 6, 0, 2 * Math.PI);

             // Colors
             if (asset.type === 'WELL') ctx.fillStyle = '#10B981';
             else if (asset.type === 'PIPELINE') ctx.fillStyle = '#F59E0B'; // Amber for pipeline points
             else ctx.fillStyle = '#3B82F6'; // Blue for Facilities

             ctx.fill();

             if (selectedAssetId === asset.id) {
                 ctx.strokeStyle = 'white';
                 ctx.lineWidth = 2;
                 ctx.stroke();
             }
        }

    }, [assets, selectedAssetId, showInfra, showHeatmap, showCarbon]);

    const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        let found = null;
        // Check assets (reverse order of drawing for hit test priority?)
        // Actually pipelines are top, so check them first if visible
        const relevantAssets = showInfra ? assets : assets.filter(a => a.type === 'WELL');

        for (const asset of relevantAssets) {
             const ax = ((asset.longitude + 103) * 100) + 200;
             const ay = ((33 - asset.latitude) * 100) + 150;
             const dist = Math.sqrt((x - ax) ** 2 + (y - ay) ** 2);
             if (dist < 10) {
                 found = { x: e.clientX, y: e.clientY, text: `${asset.type}: ${asset.name}` };
                 break;
             }
        }
        setHoveredInfo(found);
    };

    const handleClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const relevantAssets = showInfra ? assets : assets.filter(a => a.type === 'WELL');
        for (const asset of relevantAssets) {
             const ax = ((asset.longitude + 103) * 100) + 200;
             const ay = ((33 - asset.latitude) * 100) + 150;
             const dist = Math.sqrt((x - ax) ** 2 + (y - ay) ** 2);
             if (dist < 10) {
                 onAssetSelect(asset);
                 return;
             }
        }
    };

    return (
        <div className="h-full w-full relative bg-slate-900 overflow-hidden">
             <div className="absolute top-4 left-4 z-10 bg-black/50 p-2 text-xs text-muted rounded pointer-events-none">
                 Interactive Map Engine (Canvas Fallback)
             </div>

             <canvas
                ref={canvasRef}
                width={800}
                height={600}
                className={`w-full h-full object-cover ${hoveredInfo ? 'cursor-pointer' : 'cursor-default'}`}
                onMouseMove={handleMouseMove}
                onMouseLeave={() => setHoveredInfo(null)}
                onClick={handleClick}
             />

             {/* Hover Tooltip */}
             {hoveredInfo && (
                 <div
                    className="fixed z-50 bg-surface border border-border rounded px-2 py-1 text-xs text-white shadow-xl pointer-events-none"
                    style={{ left: hoveredInfo.x + 10, top: hoveredInfo.y + 10 }}
                 >
                     {hoveredInfo.text}
                 </div>
             )}

             {/* Legend */}
             <div className="absolute bottom-6 right-6 bg-surface/90 backdrop-blur p-3 rounded border border-border text-xs pointer-events-none">
                <div className="font-bold text-white mb-2">Map Layers</div>
                <div className="flex flex-col space-y-1">
                    <div className="flex items-center space-x-2">
                        <span className="w-3 h-3 rounded-full bg-[#10B981]"></span>
                        <span className="text-muted">Wells (Active)</span>
                    </div>
                    {showInfra && (
                        <div className="flex items-center space-x-2">
                            <span className="w-3 h-3 rounded-full bg-[#F59E0B]"></span>
                            <span className="text-muted">Pipelines</span>
                        </div>
                    )}
                     {showInfra && (
                        <div className="flex items-center space-x-2">
                            <span className="w-3 h-3 rounded-full bg-[#3B82F6]"></span>
                            <span className="text-muted">Facilities</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
