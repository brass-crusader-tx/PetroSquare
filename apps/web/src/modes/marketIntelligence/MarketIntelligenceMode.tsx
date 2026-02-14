'use client';

import { useMemo } from 'react';
import { Html, Line } from '@react-three/drei';
import { ModeProps } from '../BaseMode';
import { useModeStore } from '../../os/stores/modeStore';
import { Ship, Radio, AlertOctagon } from 'lucide-react';
import * as THREE from 'three';

export const MarketIntelligenceMode = ({ visible }: ModeProps) => {
  const selectEntity = useModeStore((state) => state.selectEntity);

  const flows = useMemo(() => [
    { id: 'flow-1', from: [10, 0, 10], to: [-5, 0, 0], volume: '2.5M bpd', type: 'Crude' }, // Tanker route
    { id: 'flow-2', from: [8, 0, -5], to: [0, 0, 0], volume: '500k bpd', type: 'Product' }, // Pipeline
  ], []);

  const events = useMemo(() => [
    { id: 'event-1', pos: [5, 0, 5], type: 'Disruption', label: 'Port Congestion', severity: 'High' },
    { id: 'event-2', pos: [-2, 0, -8], type: 'Intel', label: 'New Refinery Online', severity: 'Low' },
  ], []);

  if (!visible) return null;

  return (
    <group>
      {/* Flow Lines */}
      {flows.map((flow, i) => (
        <group key={flow.id}>
           <Line
            points={[flow.from as [number, number, number], flow.to as [number, number, number]]}
            color={flow.type === 'Crude' ? '#F59E0B' : '#EC4899'}
            lineWidth={3}
            dashed
            dashScale={2}
            dashSize={1}
            gapSize={0.5}
            opacity={0.6}
            transparent
          />
          {/* Flow Label */}
          <Html position={[
            (flow.from[0] + flow.to[0]) / 2,
            1,
            (flow.from[2] + flow.to[2]) / 2
          ]} center distanceFactor={15}>
             <div className="px-2 py-0.5 bg-black/60 rounded text-[10px] text-white/70 font-mono border border-white/10 backdrop-blur">
               {flow.volume}
             </div>
          </Html>
        </group>
      ))}

      {/* Event Pins */}
      {events.map((event) => (
        <group key={event.id} position={event.pos as [number, number, number]}>
          <mesh onClick={() => selectEntity('Event', event.id)}>
            <octahedronGeometry args={[1]} />
            <meshStandardMaterial
              color={event.severity === 'High' ? '#EF4444' : '#3B82F6'}
              emissive={event.severity === 'High' ? '#EF4444' : '#3B82F6'}
              emissiveIntensity={0.5}
            />
          </mesh>

          <Html position={[0, 1.5, 0]} center distanceFactor={12}>
            <div
              className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg backdrop-blur border shadow-xl cursor-pointer hover:scale-105 transition-transform ${
                event.severity === 'High'
                  ? 'bg-red-500/20 border-red-500/50 text-red-100'
                  : 'bg-blue-500/20 border-blue-500/50 text-blue-100'
              }`}
              onClick={() => selectEntity('Event', event.id)}
            >
              {event.severity === 'High' ? <AlertOctagon className="w-4 h-4" /> : <Radio className="w-4 h-4" />}
              <div className="flex flex-col">
                <span className="text-[10px] font-bold uppercase tracking-wider opacity-70">{event.type}</span>
                <span className="text-xs font-semibold whitespace-nowrap">{event.label}</span>
              </div>
            </div>
          </Html>
        </group>
      ))}

      {/* Contextual Vessels */}
      <group position={[12, 0, 8]}>
         <Html transform occlude>
            <Ship className="w-6 h-6 text-white/20" />
         </Html>
      </group>

    </group>
  );
};
