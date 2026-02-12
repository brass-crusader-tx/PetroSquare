"use client";

import React, { useState } from 'react';
import { Badge } from './Badge';
import { ChevronDown, ChevronUp, Sparkles } from 'lucide-react';

export interface InsightCardProps {
    insight: string | null;
    loading?: boolean;
    enabled?: boolean;
    className?: string;
}

export function InsightCard({ insight, loading, enabled = true, className = "" }: InsightCardProps) {
    const [expanded, setExpanded] = useState(false);

    // If disabled and no content, don't render.
    // But if loading, we render skeleton.
    if (!enabled && !insight && !loading) return null;

    return (
        <div className={`bg-surface-highlight/5 border border-border rounded-lg overflow-hidden transition-all duration-300 ${className}`}>
             {/* Header */}
             <div
                className="flex items-center justify-between p-4 bg-surface-highlight/10 border-b border-border cursor-pointer hover:bg-surface-highlight/20 select-none"
                onClick={() => setExpanded(!expanded)}
             >
                 <div className="flex items-center space-x-2">
                     <Sparkles size={16} className="text-primary shrink-0" />
                     <h3 className="text-sm font-bold text-white uppercase tracking-wide truncate">Operational Insight</h3>
                 </div>
                 <div className="flex items-center space-x-3 shrink-0">
                     <Badge status={enabled ? 'live' : 'offline'}>{enabled ? 'AI Enabled' : 'AI Disabled'}</Badge>
                     {expanded ? <ChevronUp size={16} className="text-muted" /> : <ChevronDown size={16} className="text-muted" />}
                 </div>
             </div>

             {/* Content */}
             <div className={`relative transition-all duration-500 ease-in-out overflow-hidden ${expanded ? 'max-h-[1000px] opacity-100' : 'max-h-24 opacity-80'}`}>
                 <div className="p-4 text-sm text-muted leading-relaxed prose prose-invert max-w-none">
                     {loading ? (
                         <div className="animate-pulse space-y-3">
                             <div className="h-2 bg-surface-highlight rounded w-3/4"></div>
                             <div className="h-2 bg-surface-highlight rounded w-full"></div>
                             <div className="h-2 bg-surface-highlight rounded w-5/6"></div>
                         </div>
                     ) : (
                         <div className="whitespace-pre-line">{insight || 'No insight generated.'}</div>
                     )}
                 </div>

                 {/* Fade Overlay (only if collapsed and has content) */}
                 {!expanded && !loading && insight && (
                     <div
                        className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-surface via-surface/80 to-transparent flex items-end justify-center pb-3 cursor-pointer"
                        onClick={(e) => { e.stopPropagation(); setExpanded(true); }}
                     >
                         <button
                            className="text-xs font-bold text-primary hover:text-white uppercase tracking-wider bg-surface/90 px-4 py-1.5 rounded-full border border-border backdrop-blur-sm shadow-sm transition-transform hover:scale-105"
                         >
                             Read Analysis
                         </button>
                     </div>
                 )}
             </div>
        </div>
    );
}
