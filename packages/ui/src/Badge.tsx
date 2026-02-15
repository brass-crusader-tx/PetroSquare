import type { ReactNode } from 'react';

export interface BadgeProps {
  status: 'live' | 'degraded' | 'offline' | 'simulated' | 'declared' | 'beta' | 'connected' | 'error' | string;
  children?: ReactNode;
  className?: string;
}

export function Badge({ status, children, className }: BadgeProps) {
  let colorClass = 'bg-surface-highlight text-muted border-white/5';

  const s = status.toLowerCase();

  if (s === 'live' || s === 'connected') {
    colorClass = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
  } else if (s === 'degraded' || s === 'warning') {
    colorClass = 'bg-amber-500/10 text-amber-400 border-amber-500/20';
  } else if (s === 'offline' || s === 'error' || s === 'critical') {
    colorClass = 'bg-rose-500/10 text-rose-400 border-rose-500/20';
  } else if (s === 'simulated' || s === 'beta') {
    colorClass = 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20';
  } else if (s === 'declared') {
    colorClass = 'bg-slate-500/10 text-slate-400 border-slate-500/20';
  }

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-medium uppercase tracking-wide border ${colorClass} ${className || ''}`}>
      {children || status}
    </span>
  );
}
