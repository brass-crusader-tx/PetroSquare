'use client';

import { Canvas } from '@react-three/fiber';
import { CameraController } from './CameraController';
import { useModeStore } from '../stores/modeStore';
import { Suspense } from 'react';
import { Environment } from '@react-three/drei';

interface InfiniteCanvasStageProps {
  children?: React.ReactNode;
}

export const InfiniteCanvasStage = ({ children }: InfiniteCanvasStageProps) => {
  const activeMode = useModeStore((state) => state.activeMode);

  return (
    <div className="absolute inset-0 w-full h-full bg-[#111827] z-0">
      <Canvas
        camera={{ position: [0, 50, 50], fov: 45 }}
        gl={{ antialias: true, alpha: false }}
        dpr={[1, 2]}
      >
        <color attach="background" args={['#111827']} />
        <fog attach="fog" args={['#111827', 50, 200]} />

        <Suspense fallback={null}>
          <Environment preset="city" />
          <ambientLight intensity={0.5} />
          <directionalLight position={[10, 10, 5]} intensity={1} castShadow />

          <CameraController />

          {/* Base Grid */}
          <gridHelper args={[1000, 100, '#1F2937', '#1F2937']} position={[0, -0.1, 0]} />

          {children}
        </Suspense>
      </Canvas>
    </div>
  );
};
