'use client';

import { useMemo } from 'react';
import { Html, Line } from '@react-three/drei';
import { ModeProps } from '../BaseMode';
import { useModeStore } from '../../os/stores/modeStore';
import { TrendingUp, TrendingDown, DollarSign } from 'lucide-react';
import * as THREE from 'three';

export const MarketsTradingMode = ({ visible }: ModeProps) => {
  const selectEntity = useModeStore((state) => state.selectEntity);

  const hubs = useMemo(() => [
    { id: 'wti', name: 'WTI Crude', pos: [-5, 0, 0], price: 76.42, change: '+1.2%', trend: 'up' },
    { id: 'brent', name: 'Brent Crude', pos: [5, 0, -5], price: 81.15, change: '+0.8%', trend: 'up' },
    { id: 'hh', name: 'Henry Hub', pos: [-2, 0, 5], price: 2.34, change: '-3.1%', trend: 'down' },
  ], []);

  if (!visible) return null;

  return (
    <group>
      {/* Spread Links */}
      <Line points={[[-5, 0.5, 0], [5, 0.5, -5]]} color="#3B82F6" dashed dashScale={10} opacity={0.3} transparent lineWidth={1} />
      <Html position={[0, 1, -2.5]} center distanceFactor={20}>
         <div className="px-2 py-1 bg-black/80 rounded text-[10px] text-blue-400 font-mono border border-blue-500/30">
           WTI-Brent Spread: $4.73
         </div>
      </Html>

      {/* Market Cards */}
      {hubs.map((hub) => (
        <group key={hub.id} position={hub.pos as [number, number, number]}>
          {/* Base Marker */}
          <mesh onClick={() => selectEntity('MarketHub', hub.id)}>
            <cylinderGeometry args={[1, 1, 0.2, 32]} />
            <meshStandardMaterial color={hub.trend === 'up' ? '#10B981' : '#EF4444'} opacity={0.8} transparent />
          </mesh>

          {/* Detailed Card */}
          <Html position={[0, 1.5, 0]} center distanceFactor={12}>
            <div
              className={`p-3 rounded-xl backdrop-blur-xl border shadow-2xl min-w-[140px] cursor-pointer hover:border-white/40 transition-colors ${
                hub.trend === 'up'
                  ? 'bg-emerald-950/40 border-emerald-500/30'
                  : 'bg-red-950/40 border-red-500/30'
              }`}
              onClick={() => selectEntity('MarketHub', hub.id)}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-bold text-white/50 tracking-wider uppercase">{hub.name}</span>
                {hub.trend === 'up'
                  ? <TrendingUp className="w-3 h-3 text-emerald-400" />
                  : <TrendingDown className="w-3 h-3 text-red-400" />
                }
              </div>

              <div className="flex items-baseline space-x-1">
                <span className="text-lg font-mono font-bold text-white">${hub.price}</span>
                <span className={`text-[10px] font-mono ${hub.trend === 'up' ? 'text-emerald-400' : 'text-red-400'}`}>
                  {hub.change}
                </span>
              </div>

              <div className="mt-2 h-1 w-full bg-white/10 rounded-full overflow-hidden">
                <div className={`h-full ${hub.trend === 'up' ? 'bg-emerald-500' : 'bg-red-500'} w-2/3`} />
              </div>
            </div>
          </Html>
        </group>
      ))}
    </group>
  );
};
