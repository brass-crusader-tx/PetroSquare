"use client";

import { DataPanel, Button } from '@petrosquare/ui';
import { Basin, MapOverlay } from '@petrosquare/types';

interface FilterPanelProps {
  basins: Basin[];
  selectedBasinId: string;
  onSelectBasin: (id: string) => void;
  overlays: MapOverlay[];
  onToggleOverlay: (id: string) => void;
  onRefresh: () => void;
}

export default function FilterPanel({ basins, selectedBasinId, onSelectBasin, overlays, onToggleOverlay, onRefresh }: FilterPanelProps) {
  return (
    <div className="space-y-4">
      <DataPanel title="Navigation" className="p-4">
        <label className="block text-xs uppercase text-muted mb-2">Basin</label>
        <select
          value={selectedBasinId}
          onChange={(e) => onSelectBasin(e.target.value)}
          className="w-full bg-surface-highlight border border-border text-white text-sm rounded p-2 focus:ring-1 focus:ring-primary outline-none"
        >
          {basins.map(basin => (
            <option key={basin.id} value={basin.id}>{basin.name}</option>
          ))}
        </select>

        <div className="mt-4 pt-4 border-t border-border">
          <Button variant="secondary" className="w-full text-xs" onClick={onRefresh}>
             Reset View
          </Button>
        </div>
      </DataPanel>

      <DataPanel title="Intelligence Layers" className="p-4">
        <div className="space-y-3">
          {overlays.map(overlay => (
            <div key={overlay.id} className="flex items-center justify-between">
              <span className="text-sm text-white">{overlay.name}</span>
              <button
                onClick={() => onToggleOverlay(overlay.id)}
                className={`w-10 h-5 rounded-full relative transition-colors ${overlay.visible ? 'bg-primary' : 'bg-surface-highlight border border-border'}`}
              >
                <span className={`absolute top-1 left-1 w-3 h-3 bg-white rounded-full transition-transform ${overlay.visible ? 'translate-x-5' : 'translate-x-0'}`} />
              </button>
            </div>
          ))}
        </div>
      </DataPanel>

      <div className="text-[10px] text-muted p-2">
          Coordinates: WGS84<br/>
          Projection: Web Mercator
      </div>
    </div>
  );
}
