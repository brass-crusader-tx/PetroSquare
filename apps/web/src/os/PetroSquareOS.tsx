'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { GlobalOverlays } from './overlays/GlobalOverlays';

const InfiniteCanvasStage = dynamic(
  () => import('./stage/InfiniteCanvasStage').then((mod) => mod.InfiniteCanvasStage),
  { ssr: false }
);
import { ModeLayerManager } from './ModeLayerManager';
import { useModeStore } from './stores/modeStore';
import { ModeId } from './types';
import { useMockTelemetry } from './adapters/mockTelemetryAdapter';

interface PetroSquareOSProps {
  initialMode?: ModeId;
}

export const PetroSquareOS = ({ initialMode }: PetroSquareOSProps) => {
  const setMode = useModeStore((state) => state.setMode);
  const [mounted, setMounted] = useState(false);

  // Start mock telemetry
  useMockTelemetry();

  useEffect(() => {
    setMounted(true);
    if (initialMode) {
      setMode(initialMode);
    }
  }, [initialMode, setMode]);

  if (!mounted) {
      return (
        <div className="relative w-screen h-screen overflow-hidden bg-[#0F172A] flex items-center justify-center">
           <div className="w-8 h-8 rounded-full border-2 border-t-transparent border-blue-500 animate-spin"></div>
        </div>
      );
  }

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#0F172A] text-white selection:bg-blue-500/30 selection:text-blue-200 font-sans antialiased">
      {/* 3D Stage Layer */}
      <InfiniteCanvasStage>
        <ModeLayerManager />
      </InfiniteCanvasStage>

      {/* UI Overlay Layer */}
      <GlobalOverlays />
    </div>
  );
};
