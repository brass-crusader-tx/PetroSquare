import React from 'react';

export function ConfidenceBadge({ confidence }: { confidence: number }) {
    let color = 'bg-slate-500';
    if (confidence > 0.8) color = 'bg-emerald-600';
    else if (confidence > 0.5) color = 'bg-amber-500';
    else color = 'bg-rose-500';

    return (
        <span className={`px-2 py-0.5 rounded text-[10px] font-bold text-white uppercase tracking-wider ${color}`}>
            {(confidence * 100).toFixed(0)}% Conf
        </span>
    );
}
