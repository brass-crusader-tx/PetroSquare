"use client";

import React, { useState } from 'react';
import { Badge } from './Badge';
import { ChevronDown, ChevronUp, Sparkles, Zap } from 'lucide-react';

export interface InsightCardProps {
    insight: string | null;
    loading?: boolean;
    enabled?: boolean;
    className?: string;
}

export function InsightCard({ insight, loading, enabled = true, className = "" }: InsightCardProps) {
    const [expanded, setExpanded] = useState(false);

    if (!enabled && !insight && !loading) return null;

    return (
        <div className={`relative group bg-surface-highlight/5 border border-primary/20 hover:border-primary/40 rounded-2xl p-5 transition-all duration-300 ${className}`}>

             {/* Header / Title */}
             <div
                className="flex items-center justify-between mb-3 cursor-pointer select-none"
                onClick={() => setExpanded(!expanded)}
             >
                <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-primary/10 text-primary">
                        <Sparkles size={16} />
                    </div>
                    <span className="text-sm font-medium text-white tracking-wide">AI Analysis</span>
                </div>
                {/* Optional Badge or Status */}
                {loading && (
                    <span className="flex items-center text-xs text-muted animate-pulse">
                        <Zap size={12} className="mr-1" /> Generating...
                    </span>
                )}
             </div>

             {/* Content */}
             <div className={`relative transition-all duration-500 ease-in-out overflow-hidden ${expanded ? 'max-h-[2000px]' : 'max-h-32'}`}>
                 <div className="text-sm text-muted/90 leading-relaxed font-sans prose prose-invert max-w-none">
                     {loading ? (
                         <div className="space-y-3 py-2">
                             <div className="h-2 bg-white/5 rounded w-3/4 animate-pulse"></div>
                             <div className="h-2 bg-white/5 rounded w-full animate-pulse delay-75"></div>
                             <div className="h-2 bg-white/5 rounded w-5/6 animate-pulse delay-150"></div>
                         </div>
                     ) : (
                         <div className="whitespace-pre-line">{insight || 'No insight generated.'}</div>
                     )}
                 </div>

                 {/* Fade Overlay (only if collapsed and has content and content is long) */}
                 {!expanded && !loading && insight && insight.length > 150 && (
                     <div
                        className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-background to-transparent flex items-end justify-center pb-1 cursor-pointer"
                        onClick={(e) => { e.stopPropagation(); setExpanded(true); }}
                     >
                         <div className="bg-surface-highlight/50 backdrop-blur-md px-3 py-1 rounded-full border border-white/5 text-xs text-primary font-medium hover:bg-surface-highlight transition-colors flex items-center gap-1">
                             Show more <ChevronDown size={12} />
                         </div>
                     </div>
                 )}

                 {expanded && (
                     <div
                        className="flex justify-center mt-4 cursor-pointer text-xs text-muted hover:text-white transition-colors"
                        onClick={(e) => { e.stopPropagation(); setExpanded(false); }}
                     >
                        <span className="flex items-center gap-1"><ChevronUp size={12} /> Show less</span>
                     </div>
                 )}
             </div>
        </div>
    );
}
