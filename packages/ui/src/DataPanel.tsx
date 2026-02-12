import type { ReactNode } from 'react';
import { SkeletonCard } from './SkeletonCard';
import { EmptyState } from './EmptyState';
import { InlineError } from './InlineError';
import { DegradedBanner } from './DegradedBanner';

export interface DataPanelProps {
  children?: ReactNode;
  className?: string;
  title?: ReactNode;
  subtitle?: string;
  actions?: ReactNode;
  footer?: ReactNode;
  loading?: boolean;
  error?: string;
  empty?: boolean;
  emptyMessage?: string;
  degraded?: boolean;
  degradedMessage?: string;
}

export function DataPanel({
  children,
  className,
  title,
  subtitle,
  actions,
  footer,
  loading,
  error,
  empty,
  emptyMessage,
  degraded,
  degradedMessage
}: DataPanelProps) {
  if (loading) {
    return <SkeletonCard className={className} />;
  }

  if (error) {
    return (
        <div className={`bg-surface border border-border rounded flex flex-col ${className || ''}`}>
            {(title || actions) && (
                <div className="px-6 py-4 border-b border-border flex justify-between items-start">
                    <div>
                        {title && <h3 className="text-sm font-bold text-white uppercase tracking-wider">{title}</h3>}
                    </div>
                </div>
            )}
            <div className="flex-1 p-6">
                <InlineError message={error} />
            </div>
        </div>
    );
  }

  return (
    <div className={`bg-surface border border-border rounded flex flex-col group hover:border-surface-highlight transition-colors ${className || ''}`}>
      {(title || actions || subtitle) && (
        <div className="px-6 py-4 border-b border-border flex justify-between items-start">
          <div className="flex flex-col">
            {title && <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">{title}</h3>}
            {subtitle && <p className="text-xs text-muted mt-1">{subtitle}</p>}
          </div>
          {actions && <div className="flex items-center space-x-2">{actions}</div>}
        </div>
      )}

      {degraded && <DegradedBanner message={degradedMessage} />}

      <div className="flex-1 p-6 relative">
        {empty ? (
          <EmptyState message={emptyMessage} />
        ) : (
          children
        )}
      </div>

      {footer && (
        <div className="px-6 py-3 bg-surface-inset/30 border-t border-border mt-auto">
          {footer}
        </div>
      )}
    </div>
  );
}
