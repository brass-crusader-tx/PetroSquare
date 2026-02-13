import type { ReactNode } from 'react';

export interface BadgeProps {
  status: 'live' | 'degraded' | 'offline' | 'simulated' | 'declared' | 'beta' | 'connected' | 'error' | string;
  children?: ReactNode;
  className?: string;
}

export function Badge({ status, children, className }: BadgeProps) {
  let colorClass = 'bg-surface-highlight text-muted border-border';

  const s = status.toLowerCase();

  if (s === 'live' || s === 'connected') {
    colorClass = 'bg-green-900/20 text-data-positive border-green-900/30';
  } else if (s === 'degraded' || s === 'warning') {
    colorClass = 'bg-amber-900/20 text-data-warning border-amber-900/30';
  } else if (s === 'offline' || s === 'error' || s === 'critical') {
    colorClass = 'bg-red-900/20 text-data-critical border-red-900/30';
  } else if (s === 'simulated' || s === 'beta') {
    colorClass = 'bg-indigo-900/20 text-indigo-300 border-indigo-900/30';
  } else if (s === 'declared') {
    colorClass = 'bg-slate-800 text-slate-400 border-slate-700';
  }

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono uppercase tracking-wide border ${colorClass} ${className || ''}`}>
      {children || status}
    </span>
  );
}
