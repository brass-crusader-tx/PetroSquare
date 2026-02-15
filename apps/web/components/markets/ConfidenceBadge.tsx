import React from 'react';

export function ConfidenceBadge({ confidence }: { confidence: number }) {
    let color = 'bg-slate-500/20 text-slate-400 border-slate-500/30';
    if (confidence > 0.8) color = 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
    else if (confidence > 0.5) color = 'bg-amber-500/20 text-amber-400 border-amber-500/30';
    else color = 'bg-rose-500/20 text-rose-400 border-rose-500/30';

    return (
        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${color}`}>
            {(confidence * 100).toFixed(0)}% Conf
        </span>
    );
}
