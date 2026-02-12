import type { ReactNode } from 'react';

export function DegradedBanner({ message = "Data stream degraded. Values may be delayed." }: { message?: string }) {
    return (
        <div className="bg-warning/10 border-l-2 border-warning px-4 py-2 text-xs text-warning font-mono mb-4 flex items-center w-full">
            <span className="mr-2">⚠</span>
            {message}
        </div>
    )
}
