import React from 'react';
import { ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';

export interface KpiCardProps {
  label: string;
  value: string | number;
  trend?: 'positive' | 'negative' | 'neutral';
  onClick?: () => void;
  className?: string;
}

export function KpiCard({ label, value, trend, onClick, className }: KpiCardProps) {
  let valueColor = 'text-white';
  let Icon = Minus;

  if (trend === 'positive') {
      valueColor = 'text-data-positive';
      Icon = ArrowUpRight;
  }
  if (trend === 'negative') {
      valueColor = 'text-data-critical';
      Icon = ArrowDownRight;
  }
  if (trend === 'neutral') {
      valueColor = 'text-muted';
  }

  return (
    <div
        onClick={onClick}
        className={`group bg-surface hover:bg-surface-highlight/20 border border-white/5 hover:border-white/10 rounded-2xl p-6 transition-all duration-300 flex flex-col justify-between h-full ${onClick ? 'cursor-pointer hover:shadow-lg hover:shadow-primary/5' : ''} ${className || ''}`}
    >
      <div className="flex justify-between items-start mb-2">
        <span className="text-sm font-medium text-muted/80 group-hover:text-muted transition-colors tracking-wide">{label}</span>
        {trend && (
            <div className={`p-1 rounded-full ${trend === 'positive' ? 'bg-emerald-500/10 text-emerald-500' : trend === 'negative' ? 'bg-rose-500/10 text-rose-500' : 'bg-slate-500/10 text-slate-500'}`}>
                <Icon size={14} />
            </div>
        )}
      </div>
      <div className={`text-3xl font-semibold tracking-tight ${valueColor} group-hover:scale-[1.02] transition-transform origin-left`}>
        {value}
      </div>
    </div>
  );
}
