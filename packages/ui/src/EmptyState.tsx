import type { ReactNode } from 'react';

export function EmptyState({ title = "No Data Available", message, icon, action }: { title?: string, message?: string, icon?: ReactNode, action?: ReactNode }) {
    return (
        <div className="flex flex-col items-center justify-center p-8 text-center border border-dashed border-border rounded bg-surface/30 min-h-[200px] h-full">
            {icon || <div className="text-4xl mb-4 opacity-20">∅</div>}
            <h3 className="text-sm font-bold text-white mb-1">{title}</h3>
            {message && <p className="text-xs text-muted max-w-xs mx-auto mb-4">{message}</p>}
            {action}
        </div>
    )
}
