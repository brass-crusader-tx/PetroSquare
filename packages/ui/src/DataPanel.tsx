import type { ReactNode } from 'react';

export interface DataPanelProps {
  children: ReactNode;
  className?: string;
  title?: ReactNode;
  loading?: boolean;
}

export function DataPanel({ children, className, title, loading }: DataPanelProps) {
  return (
    <div className={`bg-surface border border-border rounded-sm p-6 overflow-hidden ${className || ''}`}>
      {title && (
        <div className="mb-4 border-b border-border pb-2 flex justify-between items-center">
          <h3 className="text-lg font-semibold text-white font-sans tracking-tight">{title}</h3>
          {loading && (
             <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
          )}
        </div>
      )}
      <div className="text-muted font-mono text-sm min-h-[50px]">
        {loading ? (
           <div className="flex items-center justify-center h-full py-4 opacity-50">
             <span className="text-xs">Loading data...</span>
           </div>
        ) : children}
      </div>
    </div>
  );
}
