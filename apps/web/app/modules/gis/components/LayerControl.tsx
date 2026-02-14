"use client";

import { GISLayer } from '@/lib/gis/types';

interface LayerControlProps {
  layers: GISLayer[];
  activeLayerIds: string[];
  onToggleLayer: (layerId: string) => void;
}

export default function LayerControl({ layers, activeLayerIds, onToggleLayer }: LayerControlProps) {
  const operationalLayers = layers.filter(l => l.type !== 'HEATMAP' && l.type !== 'RASTER');
  const analyticalLayers = layers.filter(l => l.type === 'HEATMAP' || l.type === 'RASTER');

  return (
    <div className="space-y-4">
      {operationalLayers.length > 0 && (
        <div className="bg-surface-highlight border border-border rounded p-4">
            <h3 className="text-xs font-bold text-white uppercase mb-3">Operational Layers</h3>
            <div className="space-y-2">
                {operationalLayers.map(layer => (
                    <LayerToggle
                        key={layer.id}
                        layer={layer}
                        active={activeLayerIds.includes(layer.id)}
                        onToggle={() => onToggleLayer(layer.id)}
                    />
                ))}
            </div>
        </div>
      )}

      {analyticalLayers.length > 0 && (
        <div className="bg-surface-highlight border border-border rounded p-4">
            <h3 className="text-xs font-bold text-white uppercase mb-3">Intelligence Overlays</h3>
            <div className="space-y-2">
                {analyticalLayers.map(layer => (
                    <LayerToggle
                        key={layer.id}
                        layer={layer}
                        active={activeLayerIds.includes(layer.id)}
                        onToggle={() => onToggleLayer(layer.id)}
                    />
                ))}
            </div>
        </div>
      )}
    </div>
  );
}

function LayerToggle({ layer, active, onToggle }: { layer: GISLayer, active: boolean, onToggle: () => void }) {
    return (
        <div className="flex items-center justify-between group cursor-pointer" onClick={onToggle}>
            <div className="flex items-center space-x-2">
                <LayerIcon type={layer.type} active={active} />
                <span className={`text-sm transition-colors ${active ? 'text-white' : 'text-muted group-hover:text-gray-300'}`}>
                    {layer.name}
                </span>
            </div>
            <div className={`w-8 h-4 rounded-full relative transition-colors ${active ? 'bg-primary' : 'bg-slate-700'}`}>
                <div className={`absolute top-0.5 left-0.5 w-3 h-3 bg-white rounded-full transition-transform ${active ? 'translate-x-4' : 'translate-x-0'}`} />
            </div>
        </div>
    );
}

function LayerIcon({ type, active }: { type: string, active: boolean }) {
    const color = active ? 'text-primary' : 'text-muted';
    // Simple icons based on type
    if (type === 'POINT') return <span className={`text-[10px] ${color}`}>●</span>;
    if (type === 'LINE') return <span className={`text-[10px] ${color}`}>〰</span>;
    if (type === 'POLYGON') return <span className={`text-[10px] ${color}`}>⬠</span>;
    return <span className={`text-[10px] ${color}`}>▒</span>;
}
