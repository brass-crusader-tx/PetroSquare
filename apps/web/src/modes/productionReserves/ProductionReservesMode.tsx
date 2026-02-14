'use client';

import { useMemo } from 'react';
import { Html } from '@react-three/drei';
import { ModeProps } from '../BaseMode';
import { useModeStore } from '../../os/stores/modeStore';
import { Droplet, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import * as THREE from 'three';

export const ProductionReservesMode = ({ visible }: ModeProps) => {
  const selectEntity = useModeStore((state) => state.selectEntity);

  const wells = useMemo(() => [
    { id: 'well-001', name: 'Permian-12A', pos: [-2, 0, -2], status: 'Active', rate: 450, decline: 12 },
    { id: 'well-002', name: 'Permian-12B', pos: [1, 0, 1], status: 'Active', rate: 320, decline: 8 },
    { id: 'well-003', name: 'Permian-14C', pos: [3, 0, -4], status: 'Shut-in', rate: 0, decline: 0 },
  ], []);

  if (!visible) return null;

  return (
    <group>
      {wells.map((well) => (
        <group key={well.id} position={well.pos as [number, number, number]}>
          {/* Wellhead */}
          <mesh onClick={() => selectEntity('Well', well.id)} position={[0, 1, 0]}>
            <cylinderGeometry args={[0.2, 0.2, 2, 8]} />
            <meshStandardMaterial
              color={well.status === 'Active' ? '#10B981' : '#6B7280'}
              metalness={0.8} roughness={0.2}
            />
          </mesh>
          <mesh position={[0, 0, 0]}>
             <boxGeometry args={[0.8, 0.2, 0.8]} />
             <meshStandardMaterial color="#374151" />
          </mesh>

          {/* Production Widget */}
          <Html position={[0, 2.5, 0]} center distanceFactor={10}>
            <div
              className={`p-2 rounded-lg backdrop-blur border shadow-xl flex flex-col items-center cursor-pointer hover:scale-105 transition-transform ${
                well.status === 'Active'
                  ? 'bg-emerald-900/40 border-emerald-500/30'
                  : 'bg-gray-800/60 border-gray-600/30 grayscale opacity-70'
              }`}
              onClick={() => selectEntity('Well', well.id)}
            >
              <div className="flex items-center space-x-2 text-white/80 text-[10px] font-bold uppercase tracking-wider mb-1">
                <Droplet className="w-3 h-3 fill-current" />
                <span>{well.name}</span>
              </div>

              {well.status === 'Active' && (
                <div className="flex items-end space-x-1">
                  <span className="text-lg font-mono font-bold text-white leading-none">{well.rate}</span>
                  <span className="text-[10px] text-white/50 mb-0.5">bpd</span>
                </div>
              )}

              {well.decline > 10 && (
                <div className="mt-1 flex items-center text-[10px] text-red-400 font-medium bg-red-500/10 px-1.5 rounded">
                  <ArrowDownRight className="w-3 h-3 mr-1" />
                  Decline Alert
                </div>
              )}
            </div>
          </Html>
        </group>
      ))}
    </group>
  );
};
