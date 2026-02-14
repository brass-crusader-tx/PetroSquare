'use client';

import { CommandPalette } from './CommandPalette';
import { TimeScrubber } from './TimeScrubber';
import { ContextPanel } from './ContextPanel';

export const GlobalOverlays = () => {
  return (
    <>
      <div className="absolute top-0 right-0 z-50">
        <ContextPanel />
      </div>

      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-40 w-full max-w-lg">
        {/* Command Palette triggers from anywhere, but this is a visual placeholder if needed */}
      </div>

      {/* Render the actual command palette (it has its own fixed positioning) */}
      <CommandPalette />

      {/* Time Scrubber (bottom) */}
      <TimeScrubber />

      {/* Top Left Branding/OS Status */}
      <div className="absolute top-4 left-4 z-40 bg-black/40 backdrop-blur rounded px-3 py-1 border border-white/10 flex items-center">
        <div className="w-2 h-2 rounded-full bg-emerald-500 mr-2 animate-pulse shadow-lg shadow-emerald-500/50" />
        <span className="font-mono text-xs text-white/70 tracking-widest">PETROSQUARE OS v2.0</span>
      </div>
    </>
  );
};
