import React from 'react';

export interface KpiCardProps {
  label: string;
  value: string | number;
  trend?: 'positive' | 'negative' | 'neutral';
  onClick?: () => void;
  className?: string;
}

export function KpiCard({ label, value, trend, onClick, className }: KpiCardProps) {
  let valueColor = 'text-white';
  if (trend === 'positive') valueColor = 'text-data-positive';
  if (trend === 'negative') valueColor = 'text-data-critical';
  if (trend === 'neutral') valueColor = 'text-data-neutral';

  return (
    <div
        onClick={onClick}
        className={`bg-surface border border-border rounded-lg p-4 ${onClick ? 'cursor-pointer hover:border-primary/50' : ''} transition-colors flex flex-col justify-between ${className || ''}`}
    >
      <div className="flex justify-between items-start">
        <span className="text-xs font-medium text-muted uppercase tracking-wider font-sans">{label}</span>
      </div>
      <div className={`text-2xl font-mono font-bold mt-2 ${valueColor}`}>{value}</div>
    </div>
  );
}
