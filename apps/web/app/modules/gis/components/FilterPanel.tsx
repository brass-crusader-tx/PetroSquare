"use client";

import { DataPanel, Button } from '@petrosquare/ui';
import { Basin } from '@petrosquare/types';

interface FilterPanelProps {
  basins: Basin[];
  selectedBasinId: string;
  onSelectBasin: (id: string) => void;
  onRefresh: () => void;
  // Deprecated props kept for compatibility if needed, but unused in UI
  showWells?: boolean;
  setShowWells?: (v: boolean) => void;
  showPipelines?: boolean;
  setShowPipelines?: (v: boolean) => void;
  showHeatmap?: boolean;
  setShowHeatmap?: (v: boolean) => void;
  showCarbon?: boolean;
  setShowCarbon?: (v: boolean) => void;
}

export default function FilterPanel({
  basins, selectedBasinId, onSelectBasin, onRefresh
}: FilterPanelProps) {

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

      <div className="text-[10px] text-muted p-2">
          Coordinates: WGS84<br/>
          Projection: Web Mercator
      </div>
    </div>
  );
}
