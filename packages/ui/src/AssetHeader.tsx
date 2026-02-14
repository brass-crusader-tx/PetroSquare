"use client";

import React, { ReactNode } from 'react';
import { Badge } from './Badge';
import { MapPin, Activity, Clock } from 'lucide-react';

export interface AssetHeaderProps {
  title: string;
  subtitle?: string;
  status?: 'active' | 'inactive' | 'maintenance' | 'warning' | 'critical';
  location?: string;
  operator?: string;
  lastUpdated?: string;
  actions?: ReactNode;
  tags?: string[];
}

export function AssetHeader({
  title,
  subtitle,
  status = 'active',
  location,
  operator,
  lastUpdated,
  actions,
  tags
}: AssetHeaderProps) {

  const getStatusColor = (s: string) => {
    switch(s) {
      case 'active': return 'live';
      case 'inactive': return 'neutral';
      case 'maintenance': return 'beta';
      case 'warning': return 'warning';
      case 'critical': return 'critical';
      default: return 'neutral';
    }
  };

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-6 border-b border-border">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-3 mb-1">
          <h1 className="text-2xl font-bold text-white tracking-tight truncate">{title}</h1>
          <Badge status={getStatusColor(status)} className="uppercase text-[10px] tracking-wider font-bold">
            {status}
          </Badge>
        </div>

        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted">
          {subtitle && <span className="font-medium text-white/80">{subtitle}</span>}

          {operator && (
            <span className="flex items-center gap-1.5">
              <span className="w-1 h-1 rounded-full bg-border"></span>
              {operator}
            </span>
          )}

          {location && (
            <span className="flex items-center gap-1.5">
              <MapPin size={14} />
              {location}
            </span>
          )}

          {lastUpdated && (
            <span className="flex items-center gap-1.5 font-mono text-xs opacity-70">
              <Clock size={12} />
              Updated {lastUpdated}
            </span>
          )}
        </div>

        {tags && tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {tags.map(tag => (
              <span key={tag} className="px-2 py-0.5 rounded bg-surface-highlight/10 border border-border text-[10px] text-muted font-mono">
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {actions && (
        <div className="flex items-center gap-2 shrink-0">
          {actions}
        </div>
      )}
    </div>
  );
}
