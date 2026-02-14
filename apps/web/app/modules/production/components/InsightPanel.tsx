"use client";

import React, { useState } from 'react';
import { DataPanel } from '@petrosquare/ui';
import { AlertCircle, CheckCircle, Database, Edit2 } from 'lucide-react';

interface Message {
  role: 'user' | 'assistant' | 'system';
  text: string;
  meta?: {
    confidence?: string;
    sources?: string[];
    assumptions?: string;
  };
}

export function InsightPanel({ assetId }: { assetId: string }) {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'system', text: 'Hello! I am your Production Assistant. Ask me about decline rates, anomalies, or future scenarios.' }
  ]);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const sendPrompt = async () => {
    if (!prompt.trim()) return;

    const userMsg: Message = { role: 'user', text: prompt };
    setMessages(prev => [...prev, userMsg]);
    setPrompt('');
    setLoading(true);

    try {
      const res = await fetch('/api/production/ai/insight', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ asset_id: assetId, prompt: userMsg.text })
      });
      const json = await res.json();
      if (json.status === 'ok') {
        // Mock confidence and parse sources from context_used
        const context = json.data.context_used || {};
        const sources = [];
        if (context.stats) sources.push(`Production Data (Current: ${context.stats.current}, Avg: ${context.stats.avg30})`);
        if (context.anomalies_count > 0) sources.push(`${context.anomalies_count} Recent Anomalies`);
        if (context.forecast_model) sources.push(`DCA Model (${context.forecast_model})`);

        const assistantMsg: Message = {
          role: 'assistant',
          text: json.data.text,
          meta: {
            confidence: 'High (92%)', // Mocked as API doesn't return it yet
            sources: sources.length > 0 ? sources : ['General Asset Knowledge'],
            assumptions: 'Standard Decline Curve Analysis'
          }
        };
        setMessages(prev => [...prev, assistantMsg]);
      } else {
        setMessages(prev => [...prev, { role: 'system', text: `Error: ${json.error.message}` }]);
      }
    } catch(e: any) {
      setMessages(prev => [...prev, { role: 'system', text: `Network Error: ${e.message}` }]);
    } finally {
      setLoading(false);
    }
  };

  const refinePrompt = (text: string) => {
    setPrompt(text);
    inputRef.current?.focus();
  };

  return (
    <DataPanel title="Production Insights">
      <div className="flex flex-col h-[500px]">
        <div className="flex-1 overflow-y-auto space-y-4 p-4 border border-border rounded bg-surface-highlight/5 mb-4">
          {messages.map((m, i) => (
            <div key={i} className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'}`}>
              <div
                className={`max-w-[85%] p-3 rounded-lg text-sm mb-1 ${
                  m.role === 'user'
                  ? 'bg-primary text-white rounded-br-none'
                  : (m.role === 'system' ? 'bg-surface-highlight text-muted italic text-xs' : 'bg-surface-highlight text-white rounded-bl-none')
                }`}
              >
                {m.text}
              </div>

              {/* Transparency Block */}
              {m.role === 'assistant' && m.meta && (
                <div className="max-w-[85%] bg-surface-highlight/20 border border-primary/20 rounded-r-lg rounded-bl-lg p-3 mb-3 text-xs text-muted space-y-2 shadow-sm">
                   <div className="flex items-center gap-2">
                      <div className="p-1 rounded-full bg-data-positive/10">
                         <CheckCircle size={12} className="text-data-positive" />
                      </div>
                      <span className="font-bold text-data-positive">Confidence: {m.meta.confidence}</span>
                   </div>
                   <div className="flex items-start gap-2 border-t border-border pt-2">
                      <Database size={12} className="mt-0.5 shrink-0" />
                      <div>
                        <span className="font-bold block mb-1">Data Sources:</span>
                        <ul className="list-disc list-inside ml-1 space-y-0.5">
                            {m.meta.sources?.map((s, idx) => <li key={idx} className="opacity-80">{s}</li>)}
                        </ul>
                      </div>
                   </div>
                   <div className="flex items-start gap-2 border-t border-border pt-2">
                      <AlertCircle size={12} className="mt-0.5 shrink-0" />
                      <span><span className="font-bold">Assumptions:</span> {m.meta.assumptions}</span>
                   </div>
                </div>
              )}

              {/* Refine Action for User messages */}
              {m.role === 'user' && (
                  <div className="flex justify-end mb-3 mr-1">
                      <button
                        onClick={() => refinePrompt(m.text)}
                        className="text-[10px] font-medium text-muted hover:text-white hover:bg-surface-highlight/30 px-2 py-1 rounded border border-transparent hover:border-border transition-all flex items-center gap-1.5"
                      >
                        <Edit2 size={10} />
                        Refine Prompt
                      </button>
                  </div>
              )}
            </div>
          ))}
          {loading && (
             <div className="flex justify-start">
               <div className="bg-surface-highlight text-white p-3 rounded-lg rounded-bl-none text-sm animate-pulse">
                 Analyzing production data...
               </div>
             </div>
          )}
        </div>

        <div className="flex space-x-2">
          <input
            ref={inputRef}
            type="text"
            className="flex-1 bg-surface-highlight border border-border rounded px-4 py-2 text-white text-sm"
            placeholder="Ask about production..."
            value={prompt}
            onChange={e => setPrompt(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && sendPrompt()}
            disabled={loading}
          />
          <button
            onClick={sendPrompt}
            disabled={loading}
            className="bg-primary text-white px-4 py-2 rounded text-sm disabled:opacity-50 hover:bg-primary/90 transition-colors"
          >
            Send
          </button>
        </div>
        <div className="mt-2 text-xs text-muted text-center">
            AI grounded on production stats, anomalies, and forecasts.
        </div>
      </div>
    </DataPanel>
  );
}
