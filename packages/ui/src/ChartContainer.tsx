"use client";

import React, { ReactNode } from 'react';
import { Info, Maximize2, RefreshCw } from 'lucide-react';
import { useDrawer } from './context/DrawerContext';

export interface ChartContainerProps {
  title: string;
  subtitle?: string;
  units?: string;
  timestamp?: string;
  source?: string;
  loading?: boolean;
  error?: string;
  onRefresh?: () => void;
  children: ReactNode;
  className?: string;
  height?: number | string;
}

export function ChartContainer({
  title,
  subtitle,
  units,
  timestamp,
  source,
  loading,
  error,
  onRefresh,
  children,
  className = "",
  height = 300
}: ChartContainerProps) {
  const { openDrawer } = useDrawer();

  const handleExpand = () => {
    openDrawer(
      <div className="h-[500px] w-full">{children}</div>,
      { title, subtitle: `Detailed view • ${units || ''}`, width: 800 }
    );
  };

  return (
    <div className={`bg-surface border border-border rounded-lg overflow-hidden flex flex-col ${className}`}>
      {/* Header */}
      <div className="px-4 py-3 border-b border-border flex items-center justify-between bg-surface-highlight/5">
        <div className="min-w-0">
          <div className="flex items-baseline gap-2">
            <h3 className="text-sm font-bold text-white truncate">{title}</h3>
            {units && <span className="text-xs text-muted font-mono">({units})</span>}
          </div>
          {subtitle && <div className="text-xs text-muted truncate mt-0.5">{subtitle}</div>}
        </div>

        <div className="flex items-center gap-1 pl-2">
           {onRefresh && (
             <button
               onClick={onRefresh}
               className={`p-1.5 text-muted hover:text-white rounded hover:bg-surface-highlight/20 transition-colors ${loading ? 'animate-spin' : ''}`}
               title="Refresh"
             >
               <RefreshCw size={14} />
             </button>
           )}
           <button
             onClick={handleExpand}
             className="p-1.5 text-muted hover:text-white rounded hover:bg-surface-highlight/20 transition-colors"
             title="Expand"
           >
             <Maximize2 size={14} />
           </button>
        </div>
      </div>

      {/* Content */}
      <div className="relative flex-1 w-full" style={{ height }}>
        {loading && (
          <div className="absolute inset-0 z-10 bg-surface/50 backdrop-blur-[1px] flex items-center justify-center">
            <div className="flex flex-col items-center gap-2">
              <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
              <span className="text-xs text-muted font-mono">LOADING DATA...</span>
            </div>
          </div>
        )}

        {error ? (
          <div className="absolute inset-0 flex items-center justify-center p-6 text-center">
            <div className="max-w-xs">
              <div className="text-data-critical mb-2">Error Loading Data</div>
              <div className="text-xs text-muted break-words">{error}</div>
            </div>
          </div>
        ) : (
          <div className="w-full h-full p-4 overflow-hidden">
            {children}
          </div>
        )}
      </div>

      {/* Footer / Meta */}
      {(timestamp || source) && (
        <div className="px-3 py-2 border-t border-border bg-surface-highlight/5 flex items-center justify-between text-[10px] text-muted font-mono">
          <span>{source ? `Source: ${source}` : ''}</span>
          <span>{timestamp ? `Updated: ${timestamp}` : ''}</span>
        </div>
      )}
    </div>
  );
}
