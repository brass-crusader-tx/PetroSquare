'use client';

import { useMemo } from 'react';
import { Html } from '@react-three/drei';
import { ModeProps } from '../BaseMode';
import { useModeStore } from '../../os/stores/modeStore';
import { DollarSign, BarChart3 } from 'lucide-react';
import * as THREE from 'three';

export const EconomicsMode = ({ visible }: ModeProps) => {
  const selectEntity = useModeStore((state) => state.selectEntity);

  const projects = useMemo(() => [
    { id: 'proj-A', name: 'Permian Growth', pos: [-2, 0, -2], npv: '$14.5M', irr: '22%', status: 'PROFITABLE' },
    { id: 'proj-B', name: 'Bakken EOR', pos: [3, 0, -5], npv: '$3.2M', irr: '11%', status: 'MARGINAL' },
  ], []);

  if (!visible) return null;

  return (
    <group>
      {projects.map((proj) => (
        <group key={proj.id} position={proj.pos as [number, number, number]}>
          {/* Project Footprint */}
          <mesh onClick={() => selectEntity('Project', proj.id)} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.1, 0]}>
            <circleGeometry args={[2, 32]} />
            <meshStandardMaterial
              color={proj.status === 'PROFITABLE' ? '#10B981' : '#F59E0B'}
              opacity={0.2} transparent side={THREE.DoubleSide}
            />
          </mesh>
          <mesh position={[0, 0.1, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[1.9, 2, 32]} />
            <meshBasicMaterial color={proj.status === 'PROFITABLE' ? '#10B981' : '#F59E0B'} />
          </mesh>

          {/* Economics Card */}
          <Html position={[0, 1.5, 0]} center distanceFactor={15}>
            <div
              className={`p-3 rounded-xl backdrop-blur-xl border shadow-2xl flex flex-col items-center cursor-pointer hover:border-white/50 transition-colors ${
                proj.status === 'PROFITABLE'
                  ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-100'
                  : 'bg-amber-950/40 border-amber-500/30 text-amber-100'
              }`}
              onClick={() => selectEntity('Project', proj.id)}
            >
              <div className="flex items-center space-x-2 text-[10px] font-bold uppercase tracking-wider mb-2 opacity-70">
                <BarChart3 className="w-3 h-3" />
                <span>{proj.name}</span>
              </div>

              <div className="grid grid-cols-2 gap-3 w-full border-t border-white/10 pt-2">
                <div className="flex flex-col items-center">
                  <span className="text-[10px] opacity-50 uppercase">NPV (10)</span>
                  <span className="text-sm font-mono font-bold">{proj.npv}</span>
                </div>
                <div className="flex flex-col items-center border-l border-white/10 pl-3">
                  <span className="text-[10px] opacity-50 uppercase">IRR</span>
                  <span className="text-sm font-mono font-bold">{proj.irr}</span>
                </div>
              </div>
            </div>
          </Html>
        </group>
      ))}
    </group>
  );
};
