"use client";

import { DataPanel, Button } from '@petrosquare/ui';
import { Basin } from '@petrosquare/types';

interface FilterPanelProps {
  basins: Basin[];
  selectedBasinId: string;
  onSelectBasin: (id: string) => void;
  onRefresh: () => void;
  // Specific Toggles
  showWells: boolean;
  setShowWells: (v: boolean) => void;
  showPipelines: boolean;
  setShowPipelines: (v: boolean) => void;
  showHeatmap: boolean;
  setShowHeatmap: (v: boolean) => void;
  showCarbon: boolean;
  setShowCarbon: (v: boolean) => void;
}

export default function FilterPanel({
  basins, selectedBasinId, onSelectBasin, onRefresh,
  showWells, setShowWells,
  showPipelines, setShowPipelines,
  showHeatmap, setShowHeatmap,
  showCarbon, setShowCarbon
}: FilterPanelProps) {

  const ToggleRow = ({ label, checked, onChange }: { label: string, checked: boolean, onChange: (v: boolean) => void }) => (
      <div className="flex items-center justify-between group py-1">
        <span className="text-sm text-muted group-hover:text-white transition-colors">{label}</span>
        <button
          onClick={() => onChange(!checked)}
          className={`w-9 h-5 rounded-full relative transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-surface focus:ring-primary/50 ${checked ? 'bg-primary' : 'bg-surface-highlight border border-white/10'}`}
        >
          <span className={`absolute top-1 left-1 w-3 h-3 bg-white rounded-full transition-transform shadow-sm ${checked ? 'translate-x-4' : 'translate-x-0'}`} />
        </button>
      </div>
  );

  return (
    <div className="space-y-4">
      <DataPanel title="Navigation" className="p-5">
        <label className="block text-[10px] uppercase font-bold text-muted mb-2 tracking-wider">Basin Selection</label>
        <div className="relative">
            <select
            value={selectedBasinId}
            onChange={(e) => onSelectBasin(e.target.value)}
            className="w-full bg-surface-highlight/50 border border-white/10 text-white text-sm rounded-lg p-2.5 focus:border-primary/50 focus:ring-1 focus:ring-primary/50 outline-none appearance-none cursor-pointer hover:bg-surface-highlight transition-colors"
            >
            {basins.map(basin => (
                <option key={basin.id} value={basin.id}>{basin.name}</option>
            ))}
            </select>
            <div className="absolute right-3 top-3 pointer-events-none text-muted">
                <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
            </div>
        </div>

        <div className="mt-5 pt-5 border-t border-white/5">
          <Button variant="secondary" size="sm" className="w-full" onClick={onRefresh}>
             Reset View
          </Button>
        </div>
      </DataPanel>

      <DataPanel title="Operational Layers" className="p-5">
        <div className="space-y-4">
          <ToggleRow label="Wells (Points)" checked={showWells} onChange={setShowWells} />
          <ToggleRow label="Infrastructure & Pipelines" checked={showPipelines} onChange={setShowPipelines} />
        </div>
      </DataPanel>

      <DataPanel title="Intelligence Overlays" className="p-5">
        <div className="space-y-4">
          <ToggleRow label="Economic Margin Heatmap" checked={showHeatmap} onChange={setShowHeatmap} />
          <ToggleRow label="Carbon Intensity & CCUS" checked={showCarbon} onChange={setShowCarbon} />
        </div>
      </DataPanel>

      <div className="text-[10px] text-muted/40 p-2 font-mono text-center">
          WGS84 • EPSG:3857
      </div>
    </div>
  );
}
