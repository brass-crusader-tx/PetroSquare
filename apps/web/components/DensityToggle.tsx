"use client";

import { useDensity } from '../context/DensityContext';
import { IconButton } from '@petrosquare/ui';

export function DensityToggle() {
  const { density, toggleDensity, inspectMode, toggleInspectMode } = useDensity();

  return (
    <div className="flex items-center space-x-2 border-l border-border pl-4">
      <IconButton
        onClick={toggleDensity}
        title={`Density: ${density}`}
        variant="ghost"
        size="sm"
      >
        {density === 'compact' ? (
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        ) : (
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
          </svg>
        )}
      </IconButton>

      <IconButton
        onClick={toggleInspectMode}
        title={`Inspect Mode: ${inspectMode ? 'On' : 'Off'}`}
        variant={inspectMode ? 'surface' : 'ghost'}
        className={inspectMode ? 'text-data-warning' : ''}
        size="sm"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
        </svg>
      </IconButton>
    </div>
  );
}
