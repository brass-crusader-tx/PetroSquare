import type { ReactNode } from 'react';

export interface FilterBarProps {
    children?: ReactNode;
    onRefresh?: () => void;
    lastUpdated?: string;
}

export function FilterBar({ children, onRefresh, lastUpdated }: FilterBarProps) {
    return (
        <div className="bg-surface border-y border-border py-3 px-4 md:px-8 mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4 sticky top-16 z-20 backdrop-blur bg-surface/90">
            <div className="flex items-center space-x-4 overflow-x-auto no-scrollbar">
                {children}
                {/* Stub filters if no children provided */}
                {!children && (
                    <>
                        <div className="h-8 bg-surface-highlight/30 rounded w-32 border border-border flex items-center px-3 text-xs text-muted cursor-not-allowed">
                            Last 24 Hours ▼
                        </div>
                        <div className="h-8 bg-surface-highlight/30 rounded w-32 border border-border flex items-center px-3 text-xs text-muted cursor-not-allowed">
                            All Regions ▼
                        </div>
                    </>
                )}
            </div>
            <div className="flex items-center space-x-4 text-xs font-mono text-muted shrink-0">
                {lastUpdated && <span>Updated: {lastUpdated}</span>}
                {onRefresh && (
                    <button
                        onClick={onRefresh}
                        className="hover:text-white transition-colors flex items-center"
                    >
                        REFRESH ⟳
                    </button>
                )}
            </div>
        </div>
    )
}
