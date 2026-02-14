import React from 'react';

export function StalenessPill({ asOf }: { asOf: string }) {
    const date = new Date(asOf);
    // Simple calc
    const diff = typeof window !== 'undefined' ? Date.now() - date.getTime() : 0;
    const isStale = diff > 60000 * 15; // 15 mins

    return (
        <span className={`text-[10px] font-mono flex items-center gap-1 ${isStale ? 'text-rose-400' : 'text-slate-400'}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${isStale ? 'bg-rose-500 animate-pulse' : 'bg-emerald-500'}`}></span>
            {isStale ? 'STALE' : 'LIVE'} • {date.toLocaleTimeString()}
        </span>
    );
}
