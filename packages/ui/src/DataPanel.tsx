import React from 'react';

export interface DataPanelProps {
  children: React.ReactNode;
  className?: string;
  title?: React.ReactNode;
  inspectMode?: boolean; // New prop
}

export function DataPanel({ children, className, title, inspectMode }: DataPanelProps) {
  return (
    <div className={`bg-surface border border-border rounded-sm p-6 overflow-hidden relative ${className || ''}`}>
       {inspectMode && (
        <div className="absolute top-0 right-0 p-1 bg-surface-highlight/50 text-[10px] text-muted font-mono uppercase tracking-wider border-b border-l border-border rounded-bl-sm z-10">
          Source: SIMULATION
        </div>
      )}

      {title && (
        <div className="mb-4 border-b border-border pb-2 flex justify-between items-center">
          <h3 className="text-lg font-semibold text-white font-sans tracking-tight">{title}</h3>
           {inspectMode && <span className="text-[10px] font-mono text-muted">ID: {Math.random().toString(36).substr(2, 6).toUpperCase()}</span>}
        </div>
      )}
      <div className="text-muted font-mono text-sm relative">
        {children}

        {inspectMode && (
          <div className="mt-4 pt-4 border-t border-border/50 grid grid-cols-2 gap-2 text-[10px] text-muted/70">
            <div>Unit: Metric (SI)</div>
            <div className="text-right">Latency: &lt;50ms</div>
          </div>
        )}
      </div>
    </div>
  );
}
