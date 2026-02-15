"use client";

import { DataPanel, Button, Select } from '@petrosquare/ui';
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

  const basinOptions = basins.map(basin => ({
    label: basin.name,
    value: basin.id
  }));

  return (
    <div className="space-y-4">
      <DataPanel title="Navigation" className="p-5 overflow-visible">
        <label className="block text-[10px] uppercase font-bold text-muted mb-2 tracking-wider">Basin Selection</label>

        <Select
            value={selectedBasinId}
            onChange={onSelectBasin}
            options={basinOptions}
            placeholder="Select Basin..."
        />

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
