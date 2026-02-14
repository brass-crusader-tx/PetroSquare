'use client';

import { useState, useEffect } from 'react';
import { useModeStore } from '../stores/modeStore';
import { ModeId } from '../types';
import { Search, Command, X } from 'lucide-react';

export const CommandPalette = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const setMode = useModeStore((state) => state.setMode);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleAction = (action: string) => {
    // Mock Action Router
    console.log('Executing action:', action);
    if (action.includes('Control Center')) setMode(ModeId.CONTROL_CENTER);
    if (action.includes('GIS')) setMode(ModeId.GIS_INTELLIGENCE);
    if (action.includes('Production')) setMode(ModeId.PRODUCTION_RESERVES);

    setIsOpen(false);
    setQuery('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh] bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-2xl bg-[#1E293B] rounded-xl shadow-2xl border border-white/10 overflow-hidden">
        <div className="flex items-center px-4 py-3 border-b border-white/5">
          <Search className="w-5 h-5 text-white/50 mr-3" />
          <input
            type="text"
            className="flex-1 bg-transparent border-none outline-none text-white placeholder-white/30 text-lg font-light"
            placeholder="Ask PetroSquare (e.g., 'Show me low-performing wells in Permian')..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
          />
          <button onClick={() => setIsOpen(false)} className="text-white/50 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="max-h-[60vh] overflow-y-auto py-2">
          {query && (
            <div className="px-4 py-2">
              <div className="text-xs font-mono text-emerald-400 mb-2">AI INTERPRETATION</div>
              <div
                className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-emerald-100 text-sm cursor-pointer hover:bg-emerald-500/20 transition-colors"
                onClick={() => handleAction('Switch to Production Mode & Filter Wells')}
              >
                <div className="flex items-center">
                  <Command className="w-4 h-4 mr-2" />
                  <span>Switch to Production Mode & highlight underperforming assets</span>
                </div>
              </div>
            </div>
          )}

          <div className="px-4 py-2">
            <div className="text-xs font-mono text-white/30 mb-2">SUGGESTED MODES</div>
            {[
              { label: 'Control Center', mode: ModeId.CONTROL_CENTER },
              { label: 'GIS Intelligence', mode: ModeId.GIS_INTELLIGENCE },
              { label: 'Production & Reserves', mode: ModeId.PRODUCTION_RESERVES },
              { label: 'Market Trading', mode: ModeId.MARKETS_TRADING },
            ].map((item) => (
              <div
                key={item.mode}
                className="flex items-center px-3 py-2 text-white/70 hover:bg-white/5 hover:text-white rounded cursor-pointer transition-colors"
                onClick={() => handleAction(item.label)}
              >
                <span className="w-2 h-2 rounded-full bg-blue-500 mr-3" />
                {item.label}
              </div>
            ))}
          </div>
        </div>

        <div className="px-4 py-2 bg-black/20 text-xs text-white/30 flex justify-between border-t border-white/5">
          <span>Press ↵ to select</span>
          <span>ESC to close</span>
        </div>
      </div>
    </div>
  );
};
