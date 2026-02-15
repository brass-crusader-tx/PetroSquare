"use client";

import { useDensity } from '../context/DensityContext';
import { IconButton } from '@petrosquare/ui';
import { Monitor, Eye, Minimize2, Maximize2 } from 'lucide-react';

export function DensityToggle() {
  const { density, toggleDensity, inspectMode, toggleInspectMode } = useDensity();

  return (
    <div className="flex items-center space-x-1 border-l border-white/5 pl-2">
      <IconButton
        onClick={toggleDensity}
        title={`Density: ${density}`}
        variant="ghost"
        size="sm"
        className={density === 'compact' ? 'text-primary' : 'text-muted'}
      >
        {density === 'compact' ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
      </IconButton>

      <IconButton
        onClick={toggleInspectMode}
        title={`Inspect Mode: ${inspectMode ? 'On' : 'Off'}`}
        variant={inspectMode ? 'surface' : 'ghost'}
        className={inspectMode ? 'text-data-warning bg-amber-500/10 border-amber-500/20' : 'text-muted'}
        size="sm"
      >
        <Eye size={16} />
      </IconButton>
    </div>
  );
}
