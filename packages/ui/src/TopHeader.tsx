"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Search, Bell, Settings, Menu, X, ArrowRight, MapPin, BarChart2, FileText, Layers, Command } from 'lucide-react';
import { IconButton } from './IconButton';
import { SEARCH_INDEX, SearchItem } from './searchIndex';

export function TopHeader() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Global Cmd+K
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
        if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
            e.preventDefault();
            setIsOpen(true);
            setTimeout(() => inputRef.current?.focus(), 50);
        }
    };
    document.addEventListener('keydown', handleGlobalKeyDown);
    return () => document.removeEventListener('keydown', handleGlobalKeyDown);
  }, []);

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
            setSelectedIndex(-1);
        } else {
            setResults([]);
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
          case 'MODULE': return <Layers size={14} className="text-primary" />;
          case 'METRIC': return <BarChart2 size={14} className="text-data-positive" />;
          case 'BASIN': return <MapPin size={14} className="text-data-warning" />;
          case 'PAGE': return <FileText size={14} className="text-muted" />;
          default: return <Search size={14} className="text-muted" />;
      }
  };

  return (
    <header className="h-16 bg-surface border-b border-border flex items-center justify-between px-6 sticky top-0 z-30 shrink-0">
        <div className="flex items-center lg:hidden mr-4">
             <button className="text-white p-2">
                 <Menu size={20} />
             </button>
        </div>

        <div className="flex-1 max-w-xl relative" ref={wrapperRef}>
            {/* Trigger Button (Visible when closed) */}
            <div
                className="relative group cursor-text"
                onClick={() => { setIsOpen(true); setTimeout(() => inputRef.current?.focus(), 50); }}
            >
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted group-focus-within:text-primary transition-colors pointer-events-none">
                    <Search size={16} />
                </span>
                <div className="w-full bg-surface-highlight/20 border border-border rounded-lg py-2 pl-10 pr-12 text-sm text-muted/50 transition-all hover:bg-surface-highlight/30 hover:border-border/80 flex items-center justify-between">
                   <span className={query ? "text-white" : ""}>{query || "Search assets, commands, or data..."}</span>
                   <kbd className="hidden md:inline-flex h-5 items-center gap-1 rounded border border-border bg-surface font-mono text-[10px] font-medium text-muted opacity-100 px-1.5">
                      <span className="text-xs">⌘</span>K
                    </kbd>
                </div>
            </div>

            {/* Modal / Dropdown - Only visible when isOpen */}
            {isOpen && (
                <div className="absolute top-0 left-0 right-0 bg-surface border border-border rounded-lg shadow-2xl overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-100">
                    <div className="flex items-center border-b border-border px-3">
                        <Search size={16} className="mr-2 text-muted" />
                        <input
                            ref={inputRef}
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Type a command or search..."
                            className="flex-1 h-12 bg-transparent text-sm text-white placeholder:text-muted focus:outline-none"
                            autoComplete="off"
                        />
                         <button
                            onClick={() => { setQuery(''); setIsOpen(false); }}
                            className="text-muted hover:text-white ml-2"
                        >
                            <X size={14} />
                        </button>
                    </div>

                    <div className="max-h-[60vh] overflow-y-auto p-2">
                         {results.length > 0 ? (
                            <ul className="space-y-1">
                                {results.map((item, index) => (
                                    <li key={item.id}>
                                        <a
                                            href={item.href}
                                            className={`flex items-center px-3 py-2.5 rounded-md hover:bg-surface-highlight/50 transition-colors cursor-pointer ${index === selectedIndex ? 'bg-surface-highlight/50 text-white' : 'text-muted-foreground'}`}
                                            onClick={(e) => { e.preventDefault(); handleSelect(item); }}
                                        >
                                            <div className="w-6 h-6 rounded bg-surface-highlight/30 flex items-center justify-center mr-3 shrink-0 border border-border/50">
                                                {getIcon(item.type)}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="text-sm font-medium text-white flex items-center">
                                                    {item.title}
                                                </div>
                                                {item.subtitle && <div className="text-xs text-muted truncate">{item.subtitle}</div>}
                                            </div>
                                            <div className="text-muted/50">
                                                <ArrowRight size={14} />
                                            </div>
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <div className="py-12 text-center text-sm text-muted">
                                {query ? (
                                    <>No results found for "<span className="text-white">{query}</span>".</>
                                ) : (
                                    <>
                                        <p className="mb-2 font-medium text-white">Suggested Commands</p>
                                        <div className="grid grid-cols-2 gap-2 text-xs">
                                            <div className="p-2 bg-surface-highlight/10 rounded border border-border/50 hover:bg-surface-highlight/20 cursor-pointer" onClick={() => handleSelect({ id:'home', title:'Go Home', href:'/', type:'PAGE', keywords:[] })}>Go to Dashboard</div>
                                            <div className="p-2 bg-surface-highlight/10 rounded border border-border/50 hover:bg-surface-highlight/20 cursor-pointer" onClick={() => handleSelect({ id:'prod', title:'Production', href:'/modules/production', type:'MODULE', keywords:[] })}>Open Production</div>
                                        </div>
                                    </>
                                )}
                            </div>
                        )}
                    </div>
                     <div className="px-3 py-2 border-t border-border bg-surface-highlight/5 text-[10px] text-muted flex justify-between">
                        <span><kbd className="font-sans">↑↓</kbd> to navigate</span>
                        <span><kbd className="font-sans">↵</kbd> to select</span>
                        <span><kbd className="font-sans">esc</kbd> to close</span>
                    </div>
                </div>
            )}
        </div>

        <div className="flex items-center space-x-4 ml-auto">
            <div className="hidden md:flex items-center space-x-2">
                 <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                 <span className="text-xs font-mono text-muted">SYSTEM ONLINE</span>
            </div>
            <div className="h-6 w-px bg-border mx-2 hidden md:block"></div>
            <IconButton variant="ghost" size="sm" onClick={() => alert("No new notifications.")}>
                <Bell size={18} />
            </IconButton>
            <IconButton variant="ghost" size="sm" onClick={() => alert("Settings are restricted.")}>
                <Settings size={18} />
            </IconButton>
        </div>
    </header>
  );
}
