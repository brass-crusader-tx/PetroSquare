import type { ReactNode } from 'react';

export function SkeletonTable({ rows = 5 }: { rows?: number }) {
    return (
        <div className="w-full animate-pulse">
            <div className="h-8 bg-surface-highlight rounded mb-2"></div>
            {[...Array(rows)].map((_, i) => (
                <div key={i} className="h-10 border-b border-surface-highlight/30 flex items-center space-x-4">
                    <div className="h-4 w-1/4 bg-surface-highlight/50 rounded"></div>
                    <div className="h-4 w-1/4 bg-surface-highlight/50 rounded"></div>
                    <div className="h-4 w-1/4 bg-surface-highlight/50 rounded"></div>
                    <div className="h-4 w-1/4 bg-surface-highlight/50 rounded"></div>
                </div>
            ))}
        </div>
    )
}
