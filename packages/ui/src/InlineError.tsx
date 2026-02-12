import type { ReactNode } from 'react';

export function InlineError({ message = "Failed to load data." }: { message?: string }) {
    return (
        <div className="bg-error/10 border border-error/20 rounded p-4 text-center h-full flex flex-col items-center justify-center min-h-[150px]">
            <p className="text-xs text-error font-mono flex items-center justify-center">
                <span className="mr-2">✕</span>
                {message}
            </p>
        </div>
    )
}
