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

// Simple projection helper (matching the original mock logic)
function project(lat: number, lng: number) {
    const x = ((lng + 103) * 100) + 200;
    const y = ((33 - lat) * 100) + 150;
    return { x, y };
}

export default function GISMap({ basins, assets, overlays, selectedAssetId, onAssetSelect, center, zoom }: MapProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [hoveredAsset, setHoveredAsset] = useState<GISAsset | null>(null);
    const [tooltipPos, setTooltipPos] = useState<{x: number, y: number} | null>(null);

    const showInfra = overlays.find(o => o.id === 'ov-infra')?.visible ?? true;
    const showEcon = overlays.find(o => o.id === 'ov-econ')?.visible ?? false;
    const showCarbon = overlays.find(o => o.id === 'ov-carbon')?.visible ?? false;

    // Draw
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Clear
        ctx.fillStyle = '#0F172A';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Draw Heatmaps (Background layers)
        if (showEcon) {
             ctx.save();
             ctx.globalAlpha = 0.3;
             // Mock Heatmap Regions
             const gradient = ctx.createRadialGradient(400, 300, 50, 400, 300, 300);
             gradient.addColorStop(0, '#059669');
             gradient.addColorStop(1, 'transparent');
             ctx.fillStyle = gradient;
             ctx.fillRect(0, 0, canvas.width, canvas.height);

             ctx.fillStyle = '#EF4444';
             ctx.fillRect(500, 400, 100, 100); // Low margin zone
             ctx.restore();
        }

        if (showCarbon) {
             ctx.save();
             ctx.globalAlpha = 0.2;
             ctx.fillStyle = '#6366F1';
             ctx.beginPath();
             ctx.arc(250, 200, 120, 0, 2 * Math.PI);
             ctx.fill(); // CCUS Zone

             ctx.fillStyle = '#7F1D1D';
             ctx.beginPath();
             ctx.arc(600, 150, 80, 0, 2 * Math.PI);
             ctx.fill(); // High Intensity Zone
             ctx.restore();
        }

        // Draw "Basins"
        ctx.strokeStyle = '#3B82F6';
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 5]);
        ctx.strokeRect(100, 100, 400, 300); // Mock Basin
        ctx.fillStyle = '#3B82F6';
        ctx.font = '12px sans-serif';
        ctx.fillText("Permian Basin (Mock)", 110, 120);

        // Helper to draw asset
        const drawAsset = (asset: GISAsset) => {
             const { x, y } = project(asset.latitude, asset.longitude);

             ctx.beginPath();

             if (asset.type === 'PIPELINE') {
                 // Draw as a small square or line segment for pipeline points
                 ctx.rect(x - 3, y - 3, 6, 6);
                 ctx.fillStyle = '#10B981'; // Green for Oil Pipeline (mock)
                 // Or check legend?
             } else if (asset.type === 'FACILITY') {
                 ctx.rect(x - 4, y - 4, 8, 8);
                 ctx.fillStyle = '#F59E0B'; // Amber
             } else {
                 // WELL
                 ctx.arc(x, y, 4, 0, 2 * Math.PI);
                 ctx.fillStyle = '#10B981'; // Green default
                 // Override color based on overlays?
             }

             // Color overrides
             if (asset.type === 'PIPELINE') ctx.fillStyle = '#10B981'; // Matches legend Green
             if (asset.type === 'WELL') ctx.fillStyle = '#3B82F6'; // Wells blue? Or use own token.
             // Prompt: "Pipeline point color MUST match the PIPELINES legend color token." -> Green #10B981
             // Prompt: "Wells must use their own color token consistent with WELLS control." -> Let's use Blue #3B82F6 or similar.
             // Legend in data.ts says: Oil Pipeline: #10B981. Gas Pipeline: #3B82F6.
             // Let's stick to Green for Pipelines as per prompt example.
             // And Wells? Let's make Wells Gray or White?
             // Original code: WELL -> #10B981 (Green).
             // If Pipeline is Green, Wells should be different. Let's make Wells Slate-400 (#94A3B8) or Blue.
             if (asset.type === 'WELL') ctx.fillStyle = '#94A3B8';

             ctx.fill();

             if (selectedAssetId === asset.id || hoveredAsset?.id === asset.id) {
                 ctx.strokeStyle = 'white';
                 ctx.lineWidth = 2;
                 ctx.setLineDash([]);
                 ctx.stroke();
             }
        };

        // Draw Assets with Z-Order
        // 1. Wells (Bottom)
        assets.filter(a => a.type === 'WELL').forEach(drawAsset);

        // 2. Infrastructure (Top)
        if (showInfra) {
            assets.filter(a => a.type !== 'WELL').forEach(drawAsset);
        }

    }, [assets, selectedAssetId, showEcon, showInfra, showCarbon, hoveredAsset]);

    const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
        const rect = canvasRef.current?.getBoundingClientRect();
        if (!rect) return;
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        // Find hovered asset
        // Search in reverse draw order (Top first) for correct hit testing
        // Infra first, then Wells
        let found: GISAsset | null = null;

        const checkHit = (asset: GISAsset) => {
             const pos = project(asset.latitude, asset.longitude);
             const dist = Math.sqrt((pos.x - x) ** 2 + (pos.y - y) ** 2);
             return dist < 8; // Hit radius
        };

        // Check Infra first (if visible)
        if (showInfra) {
            const infra = assets.filter(a => a.type !== 'WELL');
            for (let i = infra.length - 1; i >= 0; i--) {
                if (checkHit(infra[i])) {
                    found = infra[i];
                    break;
                }
            }
        }

        // If not found, check Wells
        if (!found) {
            const wells = assets.filter(a => a.type === 'WELL');
            for (let i = wells.length - 1; i >= 0; i--) {
                if (checkHit(wells[i])) {
                    found = wells[i];
                    break;
                }
            }
        }

        setHoveredAsset(found);
        if (found && (found.type === 'PIPELINE' || found.type === 'FACILITY')) {
             setTooltipPos({ x: e.clientX, y: e.clientY });
        } else {
             setTooltipPos(null);
        }
    };

    const handleClick = () => {
        if (hoveredAsset) {
            onAssetSelect(hoveredAsset);
        }
    };

    return (
        <div className="h-full w-full relative bg-slate-900 overflow-hidden">
             <div className="absolute top-4 left-4 z-10 bg-black/50 p-2 text-xs text-muted rounded">
                 Interactive Map Engine (Canvas Fallback)
             </div>
             <canvas
                ref={canvasRef}
                width={800}
                height={600}
                className={`w-full h-full object-cover ${hoveredAsset ? 'cursor-pointer' : 'cursor-default'}`}
                onMouseMove={handleMouseMove}
                onClick={handleClick}
                onMouseLeave={() => { setHoveredAsset(null); setTooltipPos(null); }}
             />

             {/* Tooltip for Pipelines */}
             {tooltipPos && hoveredAsset && (hoveredAsset.type === 'PIPELINE' || hoveredAsset.type === 'FACILITY') && (
                 <div
                    className="fixed z-50 bg-surface border border-border p-2 rounded shadow-xl pointer-events-none"
                    style={{ left: tooltipPos.x + 10, top: tooltipPos.y + 10 }}
                 >
                     <div className="text-xs font-bold text-white mb-1">
                         {hoveredAsset.type === 'PIPELINE' ? 'Pipeline Segment' : 'Facility'}
                     </div>
                     <div className="text-[10px] text-muted font-mono">
                         ID: {hoveredAsset.id}
                     </div>
                 </div>
             )}

             {/* Legend */}
             <div className="absolute bottom-6 right-6 bg-surface/90 backdrop-blur p-3 rounded border border-border text-xs">
                <div className="font-bold text-white mb-2">Map Layers</div>
                <div className="flex flex-col space-y-1">
                    <div className="flex items-center space-x-2">
                        <span className="w-3 h-3 bg-[#10B981]"></span>
                        <span className="text-muted">Pipeline / Infra</span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <span className="w-3 h-3 rounded-full bg-[#94A3B8]"></span>
                        <span className="text-muted">Well</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
