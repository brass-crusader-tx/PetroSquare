import React from 'react';
import { ProvenanceRef } from '@petrosquare/types';

export function ProvenanceList({ items }: { items?: ProvenanceRef[] }) {
    if (!items || items.length === 0) return null;
    return (
        <div className="mt-4 p-3 bg-slate-900/50 rounded border border-slate-700">
            <h4 className="text-xs font-bold text-slate-400 uppercase mb-2 tracking-wider">Data Provenance</h4>
            <ul className="space-y-1">
                {items.map((p, i) => (
                    <li key={i} className="text-xs text-slate-500 flex justify-between">
                        <span>
                            <span className="font-mono text-emerald-500 mr-2">{p.sourceSystem}</span>
                            {p.notes || p.sourceType}
                        </span>
                        <span className="opacity-50 font-mono text-[10px] ml-2">{new Date(p.asOf).toLocaleTimeString()}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
}
