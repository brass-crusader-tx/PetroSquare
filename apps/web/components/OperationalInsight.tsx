"use client";

import { useState } from 'react';
import { DataPanel, Button } from '@petrosquare/ui';
import { AISummary } from '@petrosquare/types';

interface OperationalInsightProps {
  title?: string;
  summary: AISummary | null;
  loading: boolean;
  onRefresh: () => void;
  className?: string;
}

export function OperationalInsight({
  title = "Operational Insight",
  summary,
  loading,
  onRefresh,
  className
}: OperationalInsightProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Render loading state
  if (loading && !summary) {
    return (
      <DataPanel title={title} className={`p-4 border-l-4 border-primary ${className || ''}`}>
         <div className="flex items-center space-x-3">
             <div className="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full"></div>
             <span className="text-xs text-muted animate-pulse">Analyzing operational data...</span>
         </div>
      </DataPanel>
    );
  }

  // Render empty state
  if (!summary) {
    return (
      <DataPanel title={title} className={`p-4 flex flex-col items-center justify-center text-center space-y-3 border-dashed border-2 border-border ${className || ''}`}>
          <p className="text-muted text-sm">No insights available for this context.</p>
          <Button
             variant="primary"
             className="text-xs"
             onClick={onRefresh}
          >
              Generate Insight
          </Button>
      </DataPanel>
    );
  }

  return (
    <DataPanel
        title={title}
        className={`border-l-4 border-primary relative group transition-all duration-300 ${className || ''}`}
        actions={
            <div className="flex items-center space-x-2">
                {loading && (
                    <div className="animate-spin h-3 w-3 border-2 border-primary border-t-transparent rounded-full mr-2"></div>
                )}
                <button
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="text-muted hover:text-white transition-colors"
                >
                    {isCollapsed ? (
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    ) : (
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                        </svg>
                    )}
                </button>
            </div>
        }
    >
       {!isCollapsed && (
           <div className="p-4 pt-0">
               <div className="flex justify-between items-start mb-3">
                   <div className="flex items-center space-x-2">
                       <span className="text-[10px] bg-surface-highlight px-1.5 py-0.5 rounded text-muted font-mono">
                           v{summary.model_version}
                       </span>
                       <span className="text-[10px] text-muted">
                           {new Date(summary.generated_at).toLocaleTimeString()}
                       </span>
                   </div>
                   <button
                       onClick={onRefresh}
                       className="text-[10px] text-primary hover:text-white hover:underline decoration-dotted transition-colors"
                       disabled={loading}
                   >
                       {loading ? 'Refreshing...' : 'Refresh Analysis'}
                   </button>
               </div>

               <div className="prose prose-invert prose-sm max-w-none mb-4">
                   {summary.summary_markdown.split('\n').map((line, i) => {
                       const trimmed = line.trim();
                       if (!trimmed) return <div key={i} className="h-2"></div>;

                       // Header handling
                       if (trimmed.startsWith('# ')) return <h1 key={i} className="text-lg font-bold text-white mb-2 mt-2">{trimmed.substring(2)}</h1>;
                       if (trimmed.startsWith('## ')) return <h2 key={i} className="text-md font-bold text-white mb-2 mt-2">{trimmed.substring(3)}</h2>;

                       // Bold line handling
                       if (trimmed.startsWith('**') && trimmed.endsWith('**')) {
                           return <p key={i} className="font-bold text-white mb-1">{trimmed.replace(/\*\*/g, '')}</p>;
                       }

                       // List item handling
                       if (trimmed.startsWith('* ') || trimmed.startsWith('- ')) {
                           const content = trimmed.substring(2);
                           // Check for bold key at start of list item
                           const parts = content.split('**');
                           if (parts.length >= 3) {
                               return (
                                   <li key={i} className="text-muted text-sm ml-4 list-disc mb-1">
                                       <span className="text-white font-semibold">{parts[1]}</span>
                                       {parts[2]}
                                   </li>
                               );
                           }
                           return <li key={i} className="text-muted text-sm ml-4 list-disc mb-1">{content}</li>;
                       }

                       return <p key={i} className="text-muted text-sm mb-2">{line}</p>;
                   })}
               </div>

               <div className="border-t border-border pt-2 flex justify-between items-center text-[10px] text-muted font-mono">
                   <div className="flex space-x-3">
                      <span>Confidence: <span className={`font-bold ${summary.confidence_score > 0.8 ? 'text-data-positive' : 'text-data-warning'}`}>{(summary.confidence_score * 100).toFixed(0)}%</span></span>
                      <span>Sources: {summary.sources.length}</span>
                   </div>
                   <div className="flex space-x-2">
                       {summary.sources.slice(0, 2).map((src, idx) => (
                           <span key={idx} className="bg-surface-highlight px-1 rounded truncate max-w-[100px]">{src}</span>
                       ))}
                       {summary.sources.length > 2 && <span>+{summary.sources.length - 2}</span>}
                   </div>
               </div>
           </div>
       )}
    </DataPanel>
  );
}
