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
  if (trend === 'neutral') valueColor = 'text-data-neutral';

  return (
    <div className={`flex flex-col border-l-2 border-border pl-3 ${className || ''}`}>
      <span className="text-xs font-medium text-muted uppercase tracking-wider font-sans">{label}</span>
      <span className={`text-xl font-mono font-bold ${valueColor}`}>{value}</span>
    </div>
  );
}
