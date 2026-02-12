import type { ReactNode } from 'react';

export interface StatusPillProps {
  status: 'success' | 'warning' | 'error' | 'info' | 'neutral';
  children?: ReactNode;
  className?: string;
}

export function StatusPill({ status, children, className }: StatusPillProps) {
  const styles = {
    success: 'bg-green-900/30 text-success border-success/30',
    warning: 'bg-amber-900/30 text-warning border-warning/30',
    error: 'bg-red-900/30 text-error border-error/30',
    info: 'bg-blue-900/30 text-info border-info/30',
    neutral: 'bg-slate-800 text-muted border-border',
  };

  const dotStyles = {
    success: 'bg-success',
    warning: 'bg-warning',
    error: 'bg-error',
    info: 'bg-info',
    neutral: 'bg-muted',
  };

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full border text-xs font-mono uppercase tracking-wide ${styles[status]} ${className || ''}`}>
      <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${dotStyles[status]}`} />
      {children || status}
    </span>
  );
}
