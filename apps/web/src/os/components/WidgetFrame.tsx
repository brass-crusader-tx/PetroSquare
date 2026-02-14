'use client';

import { ReactNode } from 'react';
import { TelemetryStatus } from '../stores/telemetryStore';
import { Clock, Zap, BrainCircuit } from 'lucide-react';

interface WidgetFrameProps {
  children: ReactNode;
  status: TelemetryStatus;
  timestamp?: number;
  label?: string;
  source?: string;
}

export const WidgetFrame = ({ children, status, timestamp, label, source }: WidgetFrameProps) => {
  const getBorderClass = () => {
    switch (status) {
      case 'RAW':
        return 'border-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.2)]';
      case 'INFERRED':
        return 'border-blue-500 border-dashed animate-pulse-slow shadow-[0_0_10px_rgba(59,130,246,0.2)]';
      case 'STALE':
        return 'border-gray-500/30 opacity-60 grayscale';
      default:
        return 'border-white/10';
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'RAW': return <Zap className="w-3 h-3 text-emerald-400" />;
      case 'INFERRED': return <BrainCircuit className="w-3 h-3 text-blue-400" />;
      case 'STALE': return <Clock className="w-3 h-3 text-gray-400" />;
    }
  };

  return (
    <div className={`relative bg-[#0F172A]/90 backdrop-blur-md rounded-lg border p-3 transition-all duration-500 ${getBorderClass()}`}>
      {(label || status) && (
        <div className="flex items-center justify-between mb-2 pb-2 border-b border-white/5">
          <div className="flex items-center space-x-2">
            {getStatusIcon()}
            {label && <span className="text-[10px] font-bold uppercase tracking-wider text-white/70">{label}</span>}
          </div>
          <div className="flex items-center space-x-2">
             {source && <span className="text-[9px] font-mono text-white/30">{source}</span>}
             {timestamp && (
               <span className="text-[9px] font-mono text-white/30">
                 {new Date(timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit', second:'2-digit'})}
               </span>
             )}
          </div>
        </div>
      )}
      {children}
    </div>
  );
};
