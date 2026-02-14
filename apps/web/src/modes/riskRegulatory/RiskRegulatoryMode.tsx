'use client';

import { useMemo } from 'react';
import { Html } from '@react-three/drei';
import { ModeProps } from '../BaseMode';
import { useModeStore } from '../../os/stores/modeStore';
import { ShieldAlert, Info, MapPin } from 'lucide-react';
import * as THREE from 'three';

export const RiskRegulatoryMode = ({ visible }: ModeProps) => {
  const selectEntity = useModeStore((state) => state.selectEntity);

  const zones = useMemo(() => [
    { id: 'zone-1', name: 'Methane Emissions Exclusion', pos: [-2, 0, -2], radius: 3, type: 'ENV', severity: 'HIGH' },
    { id: 'zone-2', name: 'Protected Habitat (Sage Grouse)', pos: [4, 0, 4], radius: 2.5, type: 'BIO', severity: 'MED' },
  ], []);

  if (!visible) return null;

  return (
    <group>
      {zones.map((zone) => (
        <group key={zone.id} position={zone.pos as [number, number, number]}>
          {/* Zone Radius */}
          <mesh
            rotation={[-Math.PI / 2, 0, 0]}
            position={[0, 0.1, 0]}
            onClick={() => selectEntity('Zone', zone.id)}
          >
            <cylinderGeometry args={[zone.radius, zone.radius, 0.5, 32]} />
            <meshStandardMaterial
              color={zone.severity === 'HIGH' ? '#EF4444' : '#F59E0B'}
              transparent opacity={0.15} depthWrite={false}
            />
          </mesh>
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.11, 0]}>
             <ringGeometry args={[zone.radius - 0.1, zone.radius, 64]} />
             <meshBasicMaterial color={zone.severity === 'HIGH' ? '#EF4444' : '#F59E0B'} transparent opacity={0.6} side={THREE.DoubleSide} />
          </mesh>

          {/* Warning Flag */}
          <group position={[0, 2, 0]}>
             <mesh onClick={() => selectEntity('Zone', zone.id)}>
                <cylinderGeometry args={[0.05, 0.05, 4, 8]} />
                <meshStandardMaterial color="#ffffff" />
             </mesh>

             <Html position={[0, 1, 0]} center distanceFactor={15}>
               <div
                 className={`flex items-center space-x-2 px-3 py-1.5 rounded-full border shadow-lg backdrop-blur cursor-pointer hover:scale-110 transition-transform ${
                   zone.severity === 'HIGH'
                     ? 'bg-red-950/60 border-red-500/50 text-red-100'
                     : 'bg-amber-950/60 border-amber-500/50 text-amber-100'
                 }`}
                 onClick={() => selectEntity('Zone', zone.id)}
               >
                 <ShieldAlert className="w-4 h-4" />
                 <span className="text-[10px] font-bold uppercase tracking-wider">{zone.type} Violation Risk</span>
               </div>

               <div className="mt-2 text-center text-xs text-white/70 font-medium bg-black/50 px-2 py-0.5 rounded backdrop-blur">
                  {zone.name}
               </div>
             </Html>
          </group>
        </group>
      ))}
    </group>
  );
};
