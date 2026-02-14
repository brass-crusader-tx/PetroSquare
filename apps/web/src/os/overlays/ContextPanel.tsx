'use client';

import { useModeStore } from '../stores/modeStore';
import { X, ChevronRight, BarChart3, List, Activity, Settings } from 'lucide-react';

export const ContextPanel = () => {
  const { selection, clearSelection } = useModeStore();

  if (!selection) return null;

  return (
    <div className="fixed top-0 right-0 h-full w-[400px] bg-[#0F172A]/95 border-l border-white/10 backdrop-blur-xl z-30 shadow-2xl animate-in slide-in-from-right duration-300">
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/5 bg-[#1E293B]">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-mono text-white/40 uppercase tracking-widest">{selection.type}</div>
              <div className="text-lg font-bold text-white leading-none">{selection.id}</div>
            </div>
          </div>
          <button
            onClick={clearSelection}
            className="p-2 hover:bg-white/10 rounded-full transition-colors text-white/50 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-white/5 bg-[#1E293B]/50">
          {['Overview', 'Telemetry', 'Intelligence', 'History'].map((tab, i) => (
            <button
              key={tab}
              className={`flex-1 py-3 text-xs font-medium uppercase tracking-wide border-b-2 transition-colors ${
                i === 0
                  ? 'border-blue-500 text-blue-400 bg-blue-500/5'
                  : 'border-transparent text-white/40 hover:text-white hover:bg-white/5'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {/* KPI Cards */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-white/5 rounded-lg border border-white/5 hover:border-white/10 transition-colors">
              <div className="text-xs text-white/40 mb-1">Current Output</div>
              <div className="text-xl font-mono text-emerald-400">2,450 <span className="text-xs text-white/30">bbl/d</span></div>
            </div>
            <div className="p-3 bg-white/5 rounded-lg border border-white/5 hover:border-white/10 transition-colors">
              <div className="text-xs text-white/40 mb-1">Pressure</div>
              <div className="text-xl font-mono text-blue-400">1,204 <span className="text-xs text-white/30">psi</span></div>
            </div>
          </div>

          {/* AI Insight */}
          <div className="p-4 bg-gradient-to-br from-indigo-900/20 to-purple-900/20 rounded-xl border border-indigo-500/20">
            <div className="flex items-center text-xs font-bold text-indigo-400 mb-2">
              <span className="w-2 h-2 rounded-full bg-indigo-500 mr-2 animate-pulse" />
              AI FORECAST
            </div>
            <p className="text-sm text-indigo-100/80 leading-relaxed">
              Decline curve analysis suggests a <span className="text-white font-medium">12% drop</span> in production over the next quarter due to reservoir pressure depletion. Recommend water injection strategy review.
            </p>
          </div>

          {/* Properties List */}
          <div>
            <div className="text-xs font-mono text-white/30 mb-3 uppercase tracking-widest">Metadata</div>
            <div className="space-y-2">
              {[
                ['Status', 'Active'],
                ['Commissioned', 'Jan 2019'],
                ['Operator', 'PetroSquare Ops'],
                ['Region', 'Permian Basin'],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between py-2 border-b border-white/5 text-sm">
                  <span className="text-white/40">{k}</span>
                  <span className="text-white font-mono">{v}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Action Bar */}
        <div className="p-4 bg-[#1E293B] border-t border-white/10 grid grid-cols-2 gap-3">
          <button className="flex items-center justify-center py-2 px-4 rounded bg-white/5 hover:bg-white/10 text-white text-sm font-medium transition-colors border border-white/10">
            <Settings className="w-4 h-4 mr-2" />
            Configure
          </button>
          <button className="flex items-center justify-center py-2 px-4 rounded bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium transition-colors shadow-lg shadow-blue-500/20">
            View Details <ChevronRight className="w-4 h-4 ml-1" />
          </button>
        </div>
      </div>
    </div>
  );
};
