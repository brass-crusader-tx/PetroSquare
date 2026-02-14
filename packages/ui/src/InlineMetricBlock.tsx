import React from 'react';

export interface InlineMetricBlockProps {
  label: string;
  value: string | number;
  trend?: 'positive' | 'negative' | 'neutral';
  className?: string;
}

export function InlineMetricBlock({ label, value, trend, className }: InlineMetricBlockProps) {
  let valueColor = 'text-white';
  if (trend === 'positive') valueColor = 'text-data-positive';
  if (trend === 'negative') valueColor = 'text-data-critical';
  if (trend === 'neutral') valueColor = 'text-muted';

  return (
    <div className={`flex flex-col border-l-2 border-white/10 pl-4 py-1 hover:bg-white/5 transition-colors rounded-r-lg pr-2 ${className || ''}`}>
      <span className="text-[10px] font-bold text-muted uppercase tracking-wider mb-1">{label}</span>
      <span className={`text-lg font-mono font-medium tracking-tight ${valueColor}`}>{value}</span>
    </div>
  );
}
