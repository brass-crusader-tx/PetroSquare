"use client";

import { useAISummary } from '@/lib/hooks/useAISummary';
import { DataPanel } from '@petrosquare/ui';
import { Loader2, RefreshCw, AlertTriangle } from 'lucide-react';

interface OperationalInsightProps {
  module: string;
  contextId: string;
  params?: Record<string, any>;
  title?: string;
  className?: string;
}

export default function OperationalInsight({
  module,
  contextId,
  params,
  title = "AI Insight",
  className
}: OperationalInsightProps) {

  const { data, loading, error, refresh } = useAISummary(module, contextId, params);

  // Loading State
  if (loading && !data) {
    return (
      <DataPanel title={title} className={`p-4 border-l-4 border-primary min-h-[150px] ${className || ''}`}>
         <div className="flex flex-col items-center justify-center h-full space-y-3 text-muted py-8">
             <Loader2 className="w-5 h-5 animate-spin text-primary" />
             <span className="text-xs font-mono animate-pulse">ANALYZING DATA STREAMS...</span>
         </div>
      </DataPanel>
    );
  }

  // Error State
  if (error) {
    return (
      <DataPanel title={title} className={`p-4 border-l-4 border-data-critical ${className || ''}`}>
          <div className="flex flex-col items-center justify-center space-y-2 text-data-critical py-6">
              <AlertTriangle className="w-6 h-6" />
              <span className="text-sm font-medium">Analysis Unavailable</span>
              <p className="text-xs text-muted text-center max-w-[250px] opacity-80">{error.message}</p>
              <button
                onClick={refresh}
                className="mt-2 text-xs underline hover:text-white transition-colors"
              >
                  Retry Connection
              </button>
          </div>
      </DataPanel>
    );
  }

  // Empty State
  if (!data) {
      return (
        <DataPanel title={title} className={`p-4 border-l-4 border-border ${className || ''}`}>
             <div className="flex flex-col items-center justify-center space-y-3 text-muted py-8">
                 <span className="text-sm">No insight context available.</span>
                 <button
                    onClick={refresh}
                    className="px-3 py-1.5 bg-surface-highlight hover:bg-border border border-border rounded text-xs transition-colors text-white"
                 >
                     Generate Insight
                 </button>
             </div>
        </DataPanel>
      );
  }

  // Render Markdown (Simple Parser)
  const renderMarkdown = (text: string) => {
      // Split by newlines but preserve semantic blocks roughly
      return text.split('\n').map((line, i) => {
          const trimmed = line.trim();
          if (!trimmed) return <div key={i} className="h-2" />;

          // Headers
          if (trimmed.startsWith('### ')) return <h5 key={i} className="font-bold text-white mb-1 mt-2 text-sm">{trimmed.replace('### ', '')}</h5>;
          if (trimmed.startsWith('**') && trimmed.endsWith('**')) return <h4 key={i} className="font-bold text-primary mb-2 mt-3 text-sm tracking-wide uppercase">{trimmed.replace(/\*\*/g, '')}</h4>;
          if (trimmed.startsWith('**')) return <p key={i} className="font-bold text-white mb-1 mt-2 text-sm">{trimmed.replace(/\*\*/g, '')}</p>;

          // Lists
          if (trimmed.startsWith('* ')) return (
             <div key={i} className="flex items-start space-x-2 mb-1.5 ml-1">
                 <span className="text-primary mt-1.5 w-1 h-1 rounded-full bg-primary shrink-0"></span>
                 <span className="text-muted text-xs leading-relaxed">{trimmed.replace('* ', '')}</span>
             </div>
          );
          if (trimmed.startsWith('- ')) return (
             <div key={i} className="flex items-start space-x-2 mb-1.5 ml-1">
                 <span className="text-muted mt-1.5 w-1 h-1 rounded-full bg-muted shrink-0"></span>
                 <span className="text-muted text-xs leading-relaxed">{trimmed.replace('- ', '')}</span>
             </div>
          );

          // Paragraphs
          // Handle bold inside paragraph
          const parts = line.split(/(\*\*.*?\*\*)/g);
          return (
             <p key={i} className="text-muted text-xs mb-2 leading-relaxed">
                 {parts.map((part, j) => {
                     if (part.startsWith('**') && part.endsWith('**')) {
                         return <strong key={j} className="text-white font-medium">{part.replace(/\*\*/g, '')}</strong>;
                     }
                     return part;
                 })}
             </p>
          );
      });
  };

  return (
    <DataPanel title={title} className={`p-4 border-l-4 border-primary relative group flex flex-col ${className || ''}`}>

       {/* Metadata Badge */}
       <div className="absolute top-3 right-3 flex items-center space-x-2">
           <span className="text-[10px] bg-surface-highlight border border-border px-1.5 py-0.5 rounded text-muted opacity-0 group-hover:opacity-100 transition-opacity">
               {data.model_version}
           </span>
           <button
             onClick={refresh}
             className="p-1 hover:bg-surface-highlight rounded text-muted hover:text-white transition-colors"
             title="Regenerate Insight"
           >
               <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
           </button>
       </div>

       <div className="flex-1 mb-4 overflow-y-auto max-h-[400px] pr-2 scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent">
           {renderMarkdown(data.summary_markdown)}
       </div>

       <div className="border-t border-border pt-3 flex justify-between items-center text-[10px] text-muted font-mono mt-auto">
           <div className="flex space-x-3">
              <span className="flex items-center space-x-1">
                  <span>Confidence:</span>
                  <span className={`${data.confidence_score > 0.8 ? 'text-data-positive' : 'text-data-warning'}`}>
                      {(data.confidence_score * 100).toFixed(0)}%
                  </span>
              </span>
              <span>Sources: {data.sources?.length || 0}</span>
           </div>
           <span className="opacity-50">
               {new Date(data.generated_at).toLocaleTimeString()}
           </span>
       </div>
    </DataPanel>
  );
}
