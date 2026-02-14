"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, Send, Mic, X } from 'lucide-react';

export interface AIQueryBarProps {
  onQuery: (query: string) => void;
  loading?: boolean;
  placeholder?: string;
  context?: string; // e.g. "Production > Permian"
}

export function AIQueryBar({ onQuery, loading = false, placeholder = "Ask PetroAI...", context }: AIQueryBarProps) {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (query.trim() && !loading) {
      onQuery(query);
      // We might keep the query or clear it. Usually keep it so user sees what they asked.
    }
  };

  return (
    <div className={`relative transition-all duration-300 ${isFocused ? 'scale-[1.01]' : ''}`}>
      <div className={`
        relative flex items-center w-full
        bg-surface-highlight/10 border transition-all duration-300 rounded-lg overflow-hidden
        ${isFocused ? 'border-primary shadow-[0_0_15px_rgba(59,130,246,0.15)] bg-surface-highlight/20' : 'border-border hover:border-border/80'}
      `}>
        {/* Icon / Context Badge */}
        <div className="pl-4 pr-3 flex items-center justify-center shrink-0">
            {loading ? (
                <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
            ) : (
                <Sparkles size={18} className={`${isFocused ? 'text-primary' : 'text-muted'} transition-colors`} />
            )}
        </div>

        {/* Input */}
        <form onSubmit={handleSubmit} className="flex-1 flex items-center h-12">
            <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                placeholder={placeholder}
                disabled={loading}
                className="w-full h-full bg-transparent border-none focus:ring-0 text-sm text-white placeholder:text-muted/60"
            />
        </form>

        {/* Actions */}
        <div className="pr-2 flex items-center space-x-1">
             {query && (
                 <button
                    onClick={() => setQuery('')}
                    className="p-2 text-muted hover:text-white transition-colors rounded-full hover:bg-white/5"
                    type="button"
                 >
                     <X size={14} />
                 </button>
             )}
             <div className="h-6 w-px bg-border mx-1"></div>
             <button
                onClick={() => handleSubmit()}
                disabled={!query.trim() || loading}
                className={`p-2 rounded-md transition-all duration-200 ${
                    query.trim() && !loading
                    ? 'bg-primary text-white shadow-lg shadow-blue-500/20 hover:bg-primary/90'
                    : 'text-muted cursor-not-allowed hover:bg-white/5'
                }`}
             >
                 <Send size={16} />
             </button>
        </div>
      </div>

      {/* Context Badge (Optional Overlay) */}
      {context && isFocused && (
          <div className="absolute -top-6 left-0 text-[10px] font-mono text-muted flex items-center animate-fade-in">
              <span className="bg-surface border border-border px-1.5 py-0.5 rounded text-primary border-primary/30 mr-1">CONTEXT</span>
              {context}
          </div>
      )}
    </div>
  );
}
