"use client";

import { useState, useRef, useEffect } from 'react';
import { ControlCenterAssistResponse } from '@petrosquare/types';
import { MessageSquare, X, Send, Sparkles } from 'lucide-react';

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
      const data: ControlCenterAssistResponse = await res.json(); // Assumes API returns correct shape

      const assistantMsg: Message = {
        role: 'assistant',
        content: data.answer || "I couldn't find an answer.",
        sources: data.sources || [],
        confidence: data.confidence || 0
      };
      setMessages(prev => [...prev, assistantMsg]);
    } catch (e) {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Error connecting to assist service.' }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 bg-primary hover:bg-primary-hover text-surface font-bold p-4 rounded-full shadow-lg shadow-primary/20 transition-all hover:scale-105 z-50 flex items-center gap-2"
      >
        <MessageSquare size={24} />
        <span className="hidden md:inline font-bold text-sm tracking-wide">Assist</span>
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 w-[400px] h-[600px] bg-surface/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl flex flex-col z-50 overflow-hidden ring-1 ring-white/5">
      {/* Header */}
      <div className="bg-surface-highlight/30 p-4 border-b border-white/5 flex justify-between items-center backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="p-1.5 bg-primary/10 rounded-lg text-primary">
            <Sparkles size={16} />
          </div>
          <div>
            <h3 className="font-bold text-white text-sm tracking-wide">Control Center Assist</h3>
            <div className="flex items-center gap-1.5 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="text-[10px] text-muted font-mono uppercase">Online</span>
            </div>
          </div>
        </div>
        <button
            onClick={() => setIsOpen(false)}
            className="text-muted hover:text-white p-1 hover:bg-white/5 rounded-lg transition-colors"
        >
          <X size={18} />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6 scroll-smooth" ref={scrollRef}>
        {messages.map((msg, i) => (
          <div key={i} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
            <div className={`max-w-[85%] text-sm leading-relaxed shadow-sm ${
              msg.role === 'user'
                ? 'bg-surface-highlight text-white rounded-2xl rounded-br-none px-4 py-3 border border-white/5'
                : 'text-muted-foreground'
            }`}>
              <div className={msg.role === 'assistant' ? 'text-white' : ''}>{msg.content}</div>
            </div>

            {msg.role === 'assistant' && (
                <div className="mt-2 space-y-2 w-full max-w-[90%]">
                    {msg.confidence !== undefined && (
                        <div className="flex items-center gap-2 text-xs">
                            <span className={`px-2 py-0.5 rounded-md border text-[10px] font-mono uppercase ${
                            msg.confidence > 0.8 ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                            msg.confidence > 0.5 ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                            'bg-red-500/10 text-red-400 border-red-500/20'
                            }`}>
                            {Math.round(msg.confidence * 100)}% Confidence
                            </span>
                        </div>
                    )}

                    {msg.sources && msg.sources.length > 0 && (
                    <div className="bg-surface-highlight/20 border border-white/5 rounded-xl p-3">
                        <div className="text-[10px] text-muted uppercase font-bold mb-2 tracking-wider">Sources</div>
                        <ul className="space-y-2">
                        {msg.sources.map((source, idx) => (
                            <li key={idx}>
                            <a
                                href={source.url}
                                className="group flex items-center justify-between text-xs text-primary hover:text-primary-hover transition-colors"
                                title={source.snippet}
                            >
                                <span className="truncate underline decoration-dotted underline-offset-4">{source.title}</span>
                                <span className="opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                            </a>
                            </li>
                        ))}
                        </ul>
                    </div>
                    )}
                </div>
            )}
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
             <div className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-surface-highlight/10 border border-white/5">
                <div className="w-1.5 h-1.5 bg-muted rounded-full animate-bounce"></div>
                <div className="w-1.5 h-1.5 bg-muted rounded-full animate-bounce delay-75"></div>
                <div className="w-1.5 h-1.5 bg-muted rounded-full animate-bounce delay-150"></div>
             </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="p-4 bg-surface border-t border-white/5">
        <div className="relative flex items-center bg-surface-highlight/30 border border-white/10 rounded-xl focus-within:border-primary/50 focus-within:ring-1 focus-within:ring-primary/20 transition-all">
            <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask a question..."
            className="flex-1 bg-transparent px-4 py-3 text-white focus:outline-none text-sm placeholder:text-muted/40"
            disabled={loading}
            autoFocus
            />
            <button
            onClick={handleSend}
            disabled={loading || !query.trim()}
            className="p-2 mr-1 text-muted hover:text-primary disabled:opacity-30 transition-colors"
            >
            <Send size={18} />
            </button>
        </div>
      </div>
    </div>
  );
}
