import type { ReactNode } from 'react';

export interface BadgeProps {
  status: 'live' | 'declared' | 'beta' | 'connected' | 'error';
  children?: ReactNode;
  className?: string;
}

export function Badge({ status, children, className }: BadgeProps) {
  let colorClass = 'bg-surface-highlight text-muted';

  if (status === 'live' || status === 'connected') {
    colorClass = 'bg-green-900/30 text-data-positive border border-green-900/50';
  } else if (status === 'declared' || status === 'beta') {
    colorClass = 'bg-slate-800 text-data-neutral border border-border';
  } else if (status === 'error') {
    colorClass = 'bg-red-900/30 text-data-critical border border-red-900/50';
  }

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-mono uppercase tracking-wide ${colorClass} ${className || ''}`}>
      {children || status}
    </span>
  );
}
