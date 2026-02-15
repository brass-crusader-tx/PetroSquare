import React from 'react';
import { ProvenanceRef } from '@petrosquare/types';

export function ProvenanceList({ items }: { items?: ProvenanceRef[] }) {
    if (!items || items.length === 0) return null;
    return (
        <div className="mt-4 p-4 bg-surface-highlight/10 rounded-xl border border-white/5">
            <h4 className="text-[10px] font-bold text-muted uppercase mb-3 tracking-wider flex items-center gap-2">
                <span className="w-1 h-1 rounded-full bg-primary"></span> Data Provenance
            </h4>
            <ul className="space-y-2">
                {items.map((p, i) => (
                    <li key={i} className="text-xs text-muted/80 flex justify-between items-center group hover:bg-white/5 p-1 rounded transition-colors">
                        <span className="flex items-center gap-2">
                            <span className="font-mono text-primary bg-primary/10 px-1.5 py-0.5 rounded text-[10px] group-hover:bg-primary/20">{p.sourceSystem}</span>
                            <span className="text-white">{p.notes || p.sourceType}</span>
                        </span>
                        <span className="opacity-50 font-mono text-[10px]">{new Date(p.asOf).toLocaleTimeString()}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
}
