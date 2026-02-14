"use client";

import React, { useState } from 'react';
import { Sparkles, HelpCircle, ChevronDown, ChevronUp, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Badge } from './Badge';

export interface IntelligenceBlockProps {
  insight: string;
  confidence?: 'high' | 'medium' | 'low';
  sources?: string[];
  assumptions?: string[];
  loading?: boolean;
  className?: string;
  title?: string;
  onRefine?: (prompt: string) => void;
}

export function IntelligenceBlock({
  insight,
  confidence = 'high',
  sources = [],
  assumptions = [],
  loading = false,
  className = "",
  title = "AI Analysis",
  onRefine
}: IntelligenceBlockProps) {
  const [expanded, setExpanded] = useState(false);
  const [explainOpen, setExplainOpen] = useState(false);

  const getConfidenceColor = (c: string) => {
    switch(c) {
      case 'high': return 'data-positive';
      case 'medium': return 'data-warning';
      case 'low': return 'data-critical';
      default: return 'muted';
    }
  };

  if (loading) {
    return (
      <div className={`p-4 rounded-lg border border-border bg-surface-highlight/5 animate-pulse ${className}`}>
        <div className="flex items-center gap-2 mb-3">
          <div className="w-4 h-4 rounded-full bg-primary/20"></div>
          <div className="h-4 w-24 bg-surface-highlight/20 rounded"></div>
        </div>
        <div className="space-y-2">
          <div className="h-3 w-full bg-surface-highlight/20 rounded"></div>
          <div className="h-3 w-5/6 bg-surface-highlight/20 rounded"></div>
          <div className="h-3 w-4/6 bg-surface-highlight/20 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className={`rounded-lg border border-border bg-surface-highlight/5 overflow-hidden transition-all duration-300 ${className}`}>
      {/* Header */}
      <div className="px-4 py-3 border-b border-border/50 bg-surface-highlight/10 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles size={16} className="text-primary" />
          <h3 className="text-sm font-bold text-white">{title}</h3>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full border border-border bg-surface/50 text-[10px] font-mono text-muted cursor-help" title="Confidence Score">
             <div className={`w-1.5 h-1.5 rounded-full bg-${getConfidenceColor(confidence)}`}></div>
             <span className="uppercase">{confidence} Conf.</span>
          </div>
          <button
            onClick={() => setExplainOpen(!explainOpen)}
            className={`p-1 rounded hover:bg-surface-highlight/20 transition-colors ${explainOpen ? 'text-primary' : 'text-muted'}`}
            title="Explainability"
          >
            <HelpCircle size={16} />
          </button>
        </div>
      </div>

      {/* Insight Content */}
      <div className="p-4 relative">
        <div className={`prose prose-invert prose-sm max-w-none text-muted leading-relaxed ${!expanded ? 'line-clamp-3' : ''}`}>
           {insight}
        </div>

        {/* Expand/Collapse Trigger (if long) */}
        {insight.length > 200 && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="mt-2 text-xs font-bold text-primary hover:text-white flex items-center gap-1"
          >
            {expanded ? <>Show Less <ChevronUp size={12}/></> : <>Read More <ChevronDown size={12}/></>}
          </button>
        )}
      </div>

      {/* Explainability / Transparency Panel */}
      {explainOpen && (
        <div className="bg-surface-highlight/10 border-t border-border p-4 animate-fade-in">
           <h4 className="text-xs font-bold text-white uppercase mb-3 tracking-wider">Transparency Report</h4>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div>
                 <div className="text-muted mb-1 font-mono">DATA SOURCES</div>
                 <ul className="space-y-1">
                    {sources.length > 0 ? sources.map((s, i) => (
                      <li key={i} className="flex items-center gap-1.5 text-white/80">
                        <CheckCircle2 size={10} className="text-data-positive" />
                        {s}
                      </li>
                    )) : <li className="text-muted italic">No specific sources cited.</li>}
                 </ul>
              </div>

              <div>
                 <div className="text-muted mb-1 font-mono">KEY ASSUMPTIONS</div>
                 <ul className="space-y-1">
                    {assumptions.length > 0 ? assumptions.map((a, i) => (
                      <li key={i} className="flex items-start gap-1.5 text-white/80">
                        <AlertCircle size={10} className="text-data-warning mt-0.5 shrink-0" />
                        <span>{a}</span>
                      </li>
                    )) : <li className="text-muted italic">Standard model parameters used.</li>}
                 </ul>
              </div>
           </div>

           <div className="mt-4 pt-3 border-t border-border/50 text-[10px] text-muted font-mono flex justify-between">
              <span>Model: PetroGPT-4-Turbo</span>
              <span>Generated: {new Date().toLocaleTimeString()}</span>
           </div>
        </div>
      )}
    </div>
  );
}
