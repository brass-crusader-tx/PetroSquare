"use client";

import React, { useState } from 'react';
import { DataPanel, Button } from '@petrosquare/ui';
import { Send, Sparkles, AlertTriangle } from 'lucide-react';

export function InsightPanel({ assetId }: { assetId: string }) {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<any[]>([
    { role: 'system', text: 'Hello! I am your Production Assistant. Ask me about decline rates, anomalies, or future scenarios.' }
  ]);

  const sendPrompt = async () => {
    if (!prompt.trim()) return;

    const userMsg = { role: 'user', text: prompt };
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
        setMessages(prev => [...prev, { role: 'assistant', text: json.data.text }]);
      } else {
        setMessages(prev => [...prev, { role: 'system', text: `Error: ${json.error.message}` }]);
      }
    } catch(e: any) {
      setMessages(prev => [...prev, { role: 'system', text: `Network Error: ${e.message}` }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DataPanel title="Production Insights">
      <div className="flex flex-col h-[500px]">
        <div className="flex-1 overflow-y-auto space-y-4 p-4 border border-white/5 rounded-xl bg-surface-highlight/5 mb-4 scroll-smooth">
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`max-w-[85%] p-3.5 rounded-2xl text-sm leading-relaxed shadow-sm ${
                  m.role === 'user'
                  ? 'bg-surface-highlight text-white rounded-br-sm border border-white/5'
                  : (m.role === 'system'
                      ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20 italic text-xs rounded-bl-sm flex items-center gap-2'
                      : 'bg-surface-highlight/5 text-muted-foreground rounded-bl-sm border border-white/5')
                }`}
              >
                {m.role === 'system' && <AlertTriangle size={12} />}
                {m.text}
              </div>
            </div>
          ))}
          {loading && (
             <div className="flex justify-start">
               <div className="bg-surface-highlight/5 text-muted p-4 rounded-2xl rounded-bl-sm text-sm flex items-center gap-3 border border-white/5">
                 <div className="flex gap-1">
                    <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce"></span>
                    <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce delay-75"></span>
                    <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce delay-150"></span>
                 </div>
                 <span className="text-xs font-medium">Analyzing production data...</span>
               </div>
             </div>
          )}
        </div>

        <div className="relative">
          <div className="flex items-center bg-surface-highlight/10 border border-white/10 rounded-xl focus-within:border-primary/50 focus-within:ring-1 focus-within:ring-primary/20 transition-all p-1">
            <div className="pl-3 text-primary">
                <Sparkles size={16} />
            </div>
            <input
                type="text"
                className="flex-1 bg-transparent px-3 py-2.5 text-white text-sm focus:outline-none placeholder:text-muted/40"
                placeholder="Ask about production trends..."
                value={prompt}
                onChange={e => setPrompt(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && sendPrompt()}
                disabled={loading}
            />
            <Button
                onClick={sendPrompt}
                disabled={loading || !prompt.trim()}
                variant="primary"
                size="sm"
                className="rounded-lg h-8 w-8 p-0"
            >
                <Send size={14} />
            </Button>
          </div>
        </div>

      </div>
    </DataPanel>
  );
}
