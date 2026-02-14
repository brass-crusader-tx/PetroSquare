"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Search, Bell, Settings, X, ArrowRight, MapPin, BarChart2, FileText, Layers, Command } from 'lucide-react';
import { IconButton } from './IconButton';
import { SEARCH_INDEX, SearchItem } from './searchIndex';

export function TopHeader() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Debounce Search
  useEffect(() => {
    const timer = setTimeout(() => {
        if (query.trim().length > 1) {
            const q = query.toLowerCase();
            const hits = SEARCH_INDEX.filter(item =>
                item.title.toLowerCase().includes(q) ||
                (item.subtitle && item.subtitle.toLowerCase().includes(q)) ||
                item.keywords.some(k => k.includes(q))
            ).slice(0, 8); // Limit to 8
            setResults(hits);
            setIsOpen(true);
            setSelectedIndex(-1);
        } else {
            setResults([]);
            setIsOpen(false);
        }
    }, 200);
    return () => clearTimeout(timer);
  }, [query]);

  // Click outside
  useEffect(() => {
      function handleClickOutside(event: MouseEvent) {
          if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
              setIsOpen(false);
          }
      }
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [wrapperRef]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
          e.preventDefault();
          setSelectedIndex(prev => (prev < results.length - 1 ? prev + 1 : prev));
      } else if (e.key === 'ArrowUp') {
          e.preventDefault();
          setSelectedIndex(prev => (prev > 0 ? prev - 1 : -1));
      } else if (e.key === 'Enter') {
          e.preventDefault();
          if (selectedIndex >= 0 && results[selectedIndex]) {
              handleSelect(results[selectedIndex]);
          } else if (results.length > 0) {
              handleSelect(results[0]);
          }
      } else if (e.key === 'Escape') {
          setIsOpen(false);
          setQuery('');
      }
  };

  const handleSelect = (item: SearchItem) => {
      window.location.href = item.href;
      setIsOpen(false);
      setQuery('');
  };

  const getIcon = (type: string) => {
      switch(type) {
          case 'MODULE': return <Layers size={16} className="text-primary" />;
          case 'METRIC': return <BarChart2 size={16} className="text-data-positive" />;
          case 'BASIN': return <MapPin size={16} className="text-data-warning" />;
          case 'PAGE': return <FileText size={16} className="text-muted" />;
          default: return <Search size={16} className="text-muted" />;
      }
  };

  return (
    <header className="h-16 flex items-center justify-between px-6 max-w-7xl mx-auto w-full">
        {/* Central Command Bar */}
        <div className="flex-1 max-w-2xl relative mx-auto" ref={wrapperRef}>
            <div className="relative group">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted group-focus-within:text-primary transition-colors pointer-events-none">
                    <Search size={18} />
                </span>
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={handleKeyDown}
                    onFocus={() => { if(query.length > 1) setIsOpen(true); }}
                    placeholder="Ask anything or search..."
                    className="w-full bg-surface-highlight/40 hover:bg-surface-highlight/60 focus:bg-surface-highlight border border-border/50 focus:border-primary/50 rounded-2xl py-2.5 pl-12 pr-12 text-sm text-white focus:outline-none transition-all placeholder:text-muted/60 shadow-sm"
                />
                {query ? (
                    <button
                        onClick={() => { setQuery(''); setIsOpen(false); }}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-muted hover:text-white"
                    >
                        <X size={16} />
                    </button>
                ) : (
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-1 pointer-events-none opacity-50">
                        <Command size={12} className="text-muted" />
                        <span className="text-[10px] text-muted font-mono">K</span>
                    </div>
                )}
            </div>

            {/* Dropdown Results */}
            {isOpen && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-surface border border-border/50 rounded-xl shadow-2xl overflow-hidden z-50 backdrop-blur-xl">
                    {results.length > 0 ? (
                        <ul className="py-2">
                            {results.map((item, index) => (
                                <li key={item.id}>
                                    <a
                                        href={item.href}
                                        className={`flex items-center px-4 py-3 hover:bg-surface-highlight/50 transition-colors cursor-pointer ${index === selectedIndex ? 'bg-surface-highlight/50' : ''}`}
                                        onClick={(e) => { e.preventDefault(); handleSelect(item); }}
                                    >
                                        <div className="w-8 h-8 rounded-lg bg-surface-highlight/30 flex items-center justify-center mr-3 shrink-0 border border-border/50">
                                            {getIcon(item.type)}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="text-sm font-medium text-white truncate flex items-center">
                                                {item.title}
                                                <span className="ml-2 text-[10px] text-muted border border-border/50 px-1.5 py-0.5 rounded bg-surface-highlight/20 font-mono uppercase tracking-wider">{item.type}</span>
                                            </div>
                                            {item.subtitle && <div className="text-xs text-muted truncate mt-0.5">{item.subtitle}</div>}
                                        </div>
                                        <div className="text-muted/30">
                                            <ArrowRight size={16} />
                                        </div>
                                    </a>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <div className="p-8 text-center text-sm text-muted">
                            <p>No results found for "<span className="text-white font-medium">{query}</span>".</p>
                            <p className="text-xs mt-2 opacity-60">Try searching for assets, reports, or metrics.</p>
                        </div>
                    )}
                </div>
            )}
        </div>

        {/* Right Actions */}
        <div className="flex items-center space-x-2 ml-4">
            <IconButton variant="ghost" size="sm" className="text-muted hover:text-white" disabled>
                <Bell size={20} />
            </IconButton>
            <IconButton
                variant="ghost"
                size="sm"
                onClick={() => window.dispatchEvent(new Event('petrosquare-open-inspector'))}
                className="text-muted hover:text-white"
                title="System Inspector"
            >
                <Settings size={20} />
            </IconButton>
        </div>
    </header>
  );
}
