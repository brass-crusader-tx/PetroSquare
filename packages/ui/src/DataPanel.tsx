import type { ReactNode } from 'react';

export interface DataPanelProps {
  children: ReactNode;
  className?: string;
  title?: ReactNode;
  loading?: boolean;
}

export function DataPanel({ children, className, title, loading }: DataPanelProps) {
  return (
    <div className={`bg-surface border border-white/5 rounded-2xl p-6 overflow-hidden shadow-sm transition-all hover:border-white/10 ${className || ''}`}>
      {title && (
        <div className="mb-6 flex justify-between items-center">
          <h3 className="text-lg font-medium text-white tracking-tight">{title}</h3>
          {loading && (
             <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary border-t-transparent"></div>
          )}
        </div>
      )}
      <div className="text-muted text-sm min-h-[50px] leading-relaxed">
        {loading ? (
           <div className="flex items-center justify-center h-full py-8 opacity-50 space-x-2">
             <div className="w-2 h-2 rounded-full bg-muted animate-bounce"></div>
             <div className="w-2 h-2 rounded-full bg-muted animate-bounce delay-75"></div>
             <div className="w-2 h-2 rounded-full bg-muted animate-bounce delay-150"></div>
           </div>
        ) : children}
      </div>
    </div>
  );
}
