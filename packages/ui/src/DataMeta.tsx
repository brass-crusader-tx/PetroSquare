import type { ReactNode } from 'react';

export interface DataMetaProps {
  label?: string;
  value?: string | number | ReactNode;
  unit?: string;
  source?: string;
  lastUpdated?: string;
  className?: string;
}

export function DataMeta({ label, value, unit, source, lastUpdated, className }: DataMetaProps) {
  return (
    <div className={`flex flex-col text-xs text-muted font-mono space-y-1 ${className || ''}`}>
      {label && <span className="uppercase tracking-wider text-[10px] opacity-70">{label}</span>}
      <div className="flex items-baseline space-x-1">
        {value !== undefined && <span className="text-white font-bold">{value}</span>}
        {unit && <span className="text-muted">{unit}</span>}
      </div>
      <div className="flex items-center space-x-2 opacity-60 text-[10px]">
        {source && <span>SRC: {source}</span>}
        {lastUpdated && <span>UPD: {lastUpdated}</span>}
      </div>
    </div>
  );
}
