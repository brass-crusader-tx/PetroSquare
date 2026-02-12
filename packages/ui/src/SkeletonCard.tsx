import type { ReactNode } from 'react';

export function SkeletonCard({ className }: { className?: string }) {
    return (
        <div className={`bg-surface border border-border rounded p-4 animate-pulse ${className || ''}`}>
            <div className="flex justify-between items-center mb-4">
                <div className="h-4 w-1/3 bg-surface-highlight rounded"></div>
                <div className="h-4 w-1/6 bg-surface-highlight rounded"></div>
            </div>
            <div className="h-32 bg-surface-highlight/20 rounded mb-4"></div>
            <div className="flex justify-between items-center mt-auto">
                 <div className="h-3 w-1/4 bg-surface-highlight rounded"></div>
                 <div className="h-3 w-1/4 bg-surface-highlight rounded"></div>
            </div>
        </div>
    )
}
