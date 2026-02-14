"use client";

import React, { useState } from 'react';
import { DataPanel } from '@petrosquare/ui';

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
        <div className="flex-1 overflow-y-auto space-y-4 p-4 border border-border rounded bg-surface-highlight/5 mb-4">
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`max-w-[80%] p-3 rounded-lg text-sm ${
                  m.role === 'user'
                  ? 'bg-primary text-white rounded-br-none'
                  : (m.role === 'system' ? 'bg-surface-highlight text-muted italic text-xs' : 'bg-surface-highlight text-white rounded-bl-none')
                }`}
              >
                {m.text}
              </div>
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
