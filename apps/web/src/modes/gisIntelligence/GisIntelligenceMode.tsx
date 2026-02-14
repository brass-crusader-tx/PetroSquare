'use client';

import { useMemo } from 'react';
import { Html, Line } from '@react-three/drei';
import { ModeProps } from '../BaseMode';
import { useModeStore } from '../../os/stores/modeStore';
import { MapPin } from 'lucide-react';

export const GisIntelligenceMode = ({ visible }: ModeProps) => {
  const selectEntity = useModeStore((state) => state.selectEntity);
  const { setMode } = useModeStore();

  const regions = useMemo(() => [
    { id: 'permian', name: 'Permian Basin', pos: [0, 0, 0] as [number, number, number], color: '#10B981' },
    { id: 'eagle-ford', name: 'Eagle Ford', pos: [-8, 0, 5] as [number, number, number], color: '#3B82F6' },
    { id: 'bakken', name: 'Bakken', pos: [8, 0, -5] as [number, number, number], color: '#F59E0B' },
  ], []);

  if (!visible) return null;

  return (
    <group>
      {/* Base Map Plane */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.1, 0]}>
        <planeGeometry args={[100, 100]} />
        <meshStandardMaterial color="#064E3B" wireframe={true} transparent opacity={0.3} />
      </mesh>

      {/* Regions */}
      {regions.map((region) => (
        <group key={region.id} position={region.pos}>
          <mesh
            onClick={(e) => {
              e.stopPropagation();
              selectEntity('Region', region.id);
            }}
            onPointerOver={() => document.body.style.cursor = 'pointer'}
            onPointerOut={() => document.body.style.cursor = 'default'}
          >
            <cylinderGeometry args={[2, 2, 0.5, 32]} />
            <meshStandardMaterial color={region.color} opacity={0.6} transparent />
          </mesh>

          <Html position={[0, 1, 0]} center distanceFactor={15}>
            <div
              className="flex flex-col items-center group cursor-pointer"
              onClick={() => selectEntity('Region', region.id)}
            >
              <div
                className="w-8 h-8 rounded-full bg-black/40 backdrop-blur border border-white/20 flex items-center justify-center hover:bg-white/20 transition-colors shadow-lg"
                style={{borderColor: region.color}}
              >
                 <MapPin className="w-4 h-4 text-white" style={{color: region.color}} />
              </div>
              <div className="mt-2 px-2 py-1 bg-black/80 rounded text-xs text-white font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                {region.name}
              </div>
            </div>
          </Html>
        </group>
      ))}

      {/* Pipeline Connections */}
      <Line
        points={[[0, 0.5, 0], [-8, 0.5, 5]]} // Permian -> Eagle Ford
        color="#6EE7B7"
        lineWidth={2}
        opacity={0.5}
        transparent
      />
      <Line
        points={[[0, 0.5, 0], [8, 0.5, -5]]} // Permian -> Bakken
        color="#FCD34D"
        lineWidth={2}
        opacity={0.5}
        transparent
      />

    </group>
  );
};
