"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Search, Bell, Settings, Menu, X, ArrowRight, MapPin, BarChart2, FileText, Layers, Zap } from 'lucide-react';
import { IconButton } from './IconButton';
import { SEARCH_INDEX, SearchItem } from './searchIndex';

export function TopHeader() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Command Palette Shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
        if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
            e.preventDefault();
            inputRef.current?.focus();
            setIsOpen(true);
        }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
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
      if (item.type === 'ACTION') {
          // Mock action handling
          if (item.href === '#toggle-theme') {
             // In a real app, this would use a context.
             // But for now, just mock.
             alert("Theme toggled (Mock)");
          } else if (item.href === '#logout') {
             alert("Logged out (Mock)");
          } else {
             window.location.href = item.href;
          }
      } else {
          window.location.href = item.href;
      }
      setIsOpen(false);
      setQuery('');
  };

  const getIcon = (type: string) => {
      switch(type) {
          case 'MODULE': return <Layers size={14} className="text-primary" />;
          case 'METRIC': return <BarChart2 size={14} className="text-data-positive" />;
          case 'BASIN': return <MapPin size={14} className="text-data-warning" />;
          case 'PAGE': return <FileText size={14} className="text-muted" />;
          case 'ACTION': return <Zap size={14} className="text-yellow-400" />;
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
            <div className="relative group">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted group-focus-within:text-primary transition-colors pointer-events-none">
                    <Search size={16} />
                </span>
                <input
                    ref={inputRef}
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={handleKeyDown}
                    onFocus={() => { if(query.length > 1) setIsOpen(true); }}
                    placeholder="Search or type command..."
                    className="w-full bg-surface-highlight/20 border border-border rounded-full py-2 pl-10 pr-20 text-sm text-white focus:outline-none focus:border-primary transition-all placeholder:text-muted/50"
                />
                {!query && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center space-x-1 pointer-events-none">
                        <kbd className="hidden sm:inline-flex h-5 items-center gap-1 rounded border border-border bg-surface px-1.5 font-mono text-[10px] font-medium text-muted opacity-100">
                            <span className="text-xs">⌘</span>K
                        </kbd>
                    </div>
                )}
                {query && (
                    <button
                        onClick={() => { setQuery(''); setIsOpen(false); }}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-white"
                    >
                        <X size={14} />
                    </button>
                )}
            </div>

            {/* Dropdown Results */}
            {isOpen && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-surface border border-border rounded-lg shadow-xl overflow-hidden z-50">
                    {results.length > 0 ? (
                        <ul className="py-2">
                            {results.map((item, index) => (
                                <li key={item.id}>
                                    <a
                                        href={item.href}
                                        className={`flex items-center px-4 py-3 hover:bg-surface-highlight/50 transition-colors ${index === selectedIndex ? 'bg-surface-highlight/50' : ''}`}
                                        onClick={(e) => { e.preventDefault(); handleSelect(item); }}
                                    >
                                        <div className="w-8 h-8 rounded bg-surface-highlight/30 flex items-center justify-center mr-3 shrink-0 border border-border/50">
                                            {getIcon(item.type)}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="text-sm font-bold text-white truncate flex items-center">
                                                {item.title}
                                                <span className="ml-2 text-[10px] text-muted border border-border px-1 rounded bg-surface-highlight/20">{item.type}</span>
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
                        <div className="p-4 text-center text-sm text-muted">
                            No results found for "<span className="text-white">{query}</span>".
                            <br/>
                            <span className="text-xs mt-1 block opacity-70">Try "Permian", "Price", or "Production".</span>
                        </div>
                    )}
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
