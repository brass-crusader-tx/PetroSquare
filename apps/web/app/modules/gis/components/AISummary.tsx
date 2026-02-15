"use client";

import { AISummary } from '@petrosquare/types';
import { DataPanel } from '@petrosquare/ui';

interface AISummaryProps {
  summary: AISummary | null;
  loading: boolean;
  onGenerate: () => void;
  title?: string;
}

export default function AISummaryPanel({ summary, loading, onGenerate, title = "AI Insights" }: AISummaryProps) {
  if (loading) {
    return (
      <DataPanel title={title} className="p-4 border-l-4 border-primary">
         <div className="animate-pulse space-y-3">
             <div className="h-4 bg-surface-highlight rounded w-3/4"></div>
             <div className="h-3 bg-surface-highlight rounded w-full"></div>
             <div className="h-3 bg-surface-highlight rounded w-5/6"></div>
         </div>
      </DataPanel>
    );
  }

  if (!summary) {
    return (
      <DataPanel title={title} className="p-4 flex flex-col items-center justify-center text-center space-y-3 border-dashed border-2 border-border">
          <p className="text-muted text-sm">No summary generated for this context.</p>
          <button
             onClick={onGenerate}
             className="px-3 py-1 bg-primary text-white text-xs font-bold rounded hover:bg-primary/80 transition-colors"
          >
              Generate AI Summary
          </button>
      </DataPanel>
    );
  }

  return (
    <DataPanel title={title} className="p-4 border-l-4 border-primary relative group">
       <div className="prose prose-invert prose-sm max-w-none mb-4">
           {/* Simple markdown rendering (MVP: basic replacement or just render text) */}
           {summary.summary_markdown.split('\n').map((line, i) => {
               if (line.trim().startsWith('**')) return <p key={i} className="font-bold text-white mb-1">{line.replace(/\*\*/g, '')}</p>;
               if (line.trim().startsWith('*')) return <li key={i} className="text-muted text-xs ml-4 list-disc">{line.replace('*', '').trim()}</li>;
               return <p key={i} className="text-muted text-xs mb-2">{line}</p>;
           })}
       </div>

       <div className="border-t border-border pt-2 flex justify-between items-center text-[10px] text-muted font-mono">
           <div className="flex space-x-2">
              <span>Confidence: <span className="text-white">{(summary.confidence_score * 100).toFixed(0)}%</span></span>
              <span>Sources: {summary.sources.length}</span>
           </div>
           <button className="hover:text-white underline decoration-dotted">Inspect Sources</button>
       </div>
    </DataPanel>
  );
}
