'use client';

import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import { ModeProps } from '../BaseMode';
import { useModeStore } from '../../os/stores/modeStore';
import { useTelemetryStore } from '../../os/stores/telemetryStore';
import { WidgetFrame } from '../../os/components/WidgetFrame';
import { Activity, AlertTriangle } from 'lucide-react';

export const ControlCenterMode = ({ visible }: ModeProps) => {
  const selectEntity = useModeStore((state) => state.selectEntity);
  const telemetryPoints = useTelemetryStore((state) => state.points);

  // Mock Assets
  const assets = [
    { id: 'pump-101', type: 'AssetNode', position: [-5, 0, 0] as [number, number, number], name: 'Main Pump A' },
    { id: 'separator-202', type: 'AssetNode', position: [5, 0, 0] as [number, number, number], name: 'Separator B' },
    { id: 'compressor-303', type: 'AssetNode', position: [0, 0, -5] as [number, number, number], name: 'Compressor C' },
  ];

  if (!visible) return null;

  return (
    <group>
      {assets.map((asset) => (
        <group key={asset.id} position={asset.position}>
          {/* Asset Geometry */}
          <mesh
            onClick={(e) => {
              e.stopPropagation();
              selectEntity(asset.type, asset.id);
            }}
            onPointerOver={() => document.body.style.cursor = 'pointer'}
            onPointerOut={() => document.body.style.cursor = 'default'}
          >
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial color="#3B82F6" transparent opacity={0.8} />
          </mesh>

          {/* Telemetry Label (HTML Overlay) */}
          <Html position={[0, 1.2, 0]} center distanceFactor={10}>
            <WidgetFrame status="RAW" label={asset.name} source="SCADA-1">
               <div className="flex flex-col items-center min-w-[120px]">
                 <div className="text-xl font-mono font-bold text-emerald-400">
                   {/* Try explicit mappings, fallback to flow */}
                   {(
                     telemetryPoints[asset.id + '-pressure']?.value.toFixed(0) ||
                     telemetryPoints[asset.id + '-temp']?.value.toFixed(1) ||
                     telemetryPoints[asset.id + '-flow']?.value.toFixed(1) ||
                     '---'
                   )}
                   <span className="text-xs text-white/50 ml-1">
                     {telemetryPoints[asset.id + '-pressure'] ? 'psi' :
                      telemetryPoints[asset.id + '-temp'] ? '°C' :
                      'unit'}
                   </span>
                 </div>

                {/* Mock Alert */}
                {asset.id === 'pump-101' && (
                  <div className="mt-2 w-full bg-red-500/20 border border-red-500/50 rounded px-2 py-1 flex items-center justify-center animate-pulse">
                    <AlertTriangle className="w-3 h-3 text-red-400 mr-1" />
                    <span className="text-[10px] font-bold text-red-100">CRITICAL</span>
                  </div>
                )}
               </div>
            </WidgetFrame>
          </Html>
        </group>
      ))}

      {/* Floor Grid for context */}
      <gridHelper args={[20, 20, '#1E3A8A', '#1E3A8A']} position={[0, -0.5, 0]} />
    </group>
  );
};
