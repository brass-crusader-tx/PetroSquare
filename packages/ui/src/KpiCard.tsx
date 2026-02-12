import type { ReactNode } from 'react';
import { StatusPill } from './StatusPill';

export interface KpiCardProps {
  title: string;
  value: string | number;
  unit?: string;
  change?: number;
  changeLabel?: string;
  status?: 'success' | 'warning' | 'error' | 'info' | 'neutral';
  loading?: boolean;
}

export function KpiCard({ title, value, unit, change, changeLabel, status = 'neutral', loading = false }: KpiCardProps) {
  if (loading) {
    return (
      <div className="bg-surface border border-border rounded p-4 animate-pulse h-full">
        <div className="h-3 w-20 bg-surface-highlight rounded mb-2"></div>
        <div className="h-6 w-32 bg-surface-highlight rounded mb-2"></div>
        <div className="h-3 w-16 bg-surface-highlight rounded"></div>
      </div>
    );
  }

  const isPositive = change && change > 0;
  const isNegative = change && change < 0;

  // Determine color based on trend if status is neutral, otherwise force status
  let trendColor = 'text-muted';
  if (change !== undefined) {
      if (isPositive) trendColor = 'text-success';
      if (isNegative) trendColor = 'text-error';
  }

  return (
    <div className="bg-surface border border-border rounded p-4 flex flex-col justify-between hover:border-surface-highlight transition-colors h-full">
      <div className="text-xs text-muted uppercase tracking-wider font-mono mb-1">{title}</div>
      <div className="flex items-baseline space-x-1 mb-2">
        <span className="text-2xl font-bold text-white tracking-tight">{value}</span>
        {unit && <span className="text-sm text-muted font-mono">{unit}</span>}
      </div>
      <div className="flex items-center justify-between mt-auto">
         {change !== undefined && (
             <div className={`text-xs font-mono flex items-center ${trendColor}`}>
                 <span className="mr-1">{isPositive ? '▲' : isNegative ? '▼' : '—'}</span>
                 {Math.abs(change)}%
                 {changeLabel && <span className="ml-1 text-muted opacity-70">{changeLabel}</span>}
             </div>
         )}
         <StatusPill status={status} className="scale-90 origin-right ml-auto" />
      </div>
    </div>
  );
}
