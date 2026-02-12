import type { ReactNode } from 'react';

export interface DataPanelProps {
  children: ReactNode;
  className?: string;
  title?: ReactNode;
}

export function DataPanel({ children, className, title }: DataPanelProps) {
  return (
    <div className={`bg-surface border border-border rounded-sm p-6 overflow-hidden ${className || ''}`}>
      {title && (
        <div className="mb-4 border-b border-border pb-2">
          <h3 className="text-lg font-semibold text-white font-sans tracking-tight">{title}</h3>
        </div>
      )}
      <div className="text-muted font-mono text-sm">
        {children}
      </div>
    </div>
  );
}
