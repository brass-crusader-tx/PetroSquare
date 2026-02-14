"use client";

import { useState, useRef, useEffect } from 'react';
import { Button } from '@petrosquare/ui';
import { ControlCenterAssistResponse } from '@petrosquare/types';
import { MessageSquare, X, Send, AlertTriangle } from 'lucide-react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  sources?: { title: string; url: string; snippet: string }[];
  confidence?: number;
}

export function ControlCenterAssist() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: 'Hello. I am the Control Center Assistant. Ask me about asset health, alerts, or workflows.' }
  ]);
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!query.trim()) return;

    const userMsg: Message = { role: 'user', content: query };
    setMessages(prev => [...prev, userMsg]);
    setQuery('');
    setLoading(true);

    try {
      const res = await fetch('/api/control-center/assist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: userMsg.content })
      });
      const data: ControlCenterAssistResponse = await res.json();

      const assistantMsg: Message = {
        role: 'assistant',
        content: data.answer,
        sources: data.sources,
        confidence: data.confidence
      };
      setMessages(prev => [...prev, assistantMsg]);
    } catch (e) {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Error connecting to assist service.' }]);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 bg-emerald-600 hover:bg-emerald-500 text-white p-4 rounded-full shadow-lg transition-colors z-50 flex items-center gap-2"
      >
        <MessageSquare size={24} />
        <span className="font-bold">Assist</span>
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 w-96 h-[600px] bg-slate-900 border border-slate-700 rounded-lg shadow-2xl flex flex-col z-50 overflow-hidden">
      {/* Header */}
      <div className="bg-slate-800 p-4 border-b border-slate-700 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
          <h3 className="font-bold text-white">Control Center Assist</h3>
        </div>
        <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-white">
          <X size={20} />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-950" ref={scrollRef}>
        {messages.map((msg, i) => (
          <div key={i} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
            <div className={`max-w-[85%] p-3 rounded-lg text-sm ${
              msg.role === 'user'
                ? 'bg-blue-600 text-white rounded-br-none'
                : 'bg-slate-800 text-slate-200 rounded-bl-none border border-slate-700'
            }`}>
              {msg.content}
            </div>
            {msg.confidence !== undefined && (
              <div className="mt-1 flex items-center gap-2 text-xs">
                <span className={`px-1.5 py-0.5 rounded border ${
                  msg.confidence > 0.8 ? 'bg-emerald-900/30 text-emerald-400 border-emerald-900' :
                  msg.confidence > 0.5 ? 'bg-amber-900/30 text-amber-400 border-amber-900' :
                  'bg-red-900/30 text-red-400 border-red-900'
                }`}>
                  {Math.round(msg.confidence * 100)}% Confidence
                </span>
              </div>
            )}
            {msg.sources && msg.sources.length > 0 && (
              <div className="mt-2 text-xs w-full max-w-[85%] bg-slate-900 border border-slate-800 rounded p-2">
                <div className="text-slate-500 uppercase font-bold mb-1">Sources</div>
                <ul className="space-y-1">
                  {msg.sources.map((source, idx) => (
                    <li key={idx}>
                      <a href={source.url} className="text-emerald-400 hover:underline truncate block" title={source.snippet}>
                        {source.title}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-slate-800 p-3 rounded-lg rounded-bl-none border border-slate-700 text-slate-400 text-sm animate-pulse">
              Analyzing...
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="p-4 bg-slate-800 border-t border-slate-700 flex gap-2">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Ask a question..."
          className="flex-1 bg-slate-900 border border-slate-600 rounded px-3 py-2 text-white focus:outline-none focus:border-emerald-500 text-sm"
          disabled={loading}
        />
        <button
          onClick={handleSend}
          disabled={loading || !query.trim()}
          className="bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white p-2 rounded transition-colors"
        >
          <Send size={18} />
        </button>
      </div>
    </div>
  );
}
