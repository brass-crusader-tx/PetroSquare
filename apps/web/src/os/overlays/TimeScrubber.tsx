'use client';

import { useTimeStore } from '../stores/timeStore';
import { Play, Pause, FastForward, Rewind, Clock } from 'lucide-react';

export const TimeScrubber = () => {
  const { mode, timestamp, isPlaying, setMode, togglePlayback } = useTimeStore();

  const formatDate = (ts: number) => {
    return new Date(ts).toLocaleString('en-US', {
      month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit', second: '2-digit'
    });
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 h-16 bg-[#0B1120]/90 backdrop-blur border-t border-white/10 flex items-center px-4 z-40">
      {/* Mode Switcher */}
      <div className="flex bg-[#1E293B] rounded-lg p-1 mr-4">
        {['RETRO', 'LIVE', 'SIM'].map((m) => (
          <button
            key={m}
            onClick={() => setMode(m as any)}
            className={`px-3 py-1 text-xs font-mono rounded transition-colors ${
              mode === m
                ? 'bg-blue-600 text-white shadow'
                : 'text-white/50 hover:text-white'
            }`}
          >
            {m}
          </button>
        ))}
      </div>

      {/* Controls */}
      <div className="flex items-center space-x-2 mr-4 text-white/70">
        <button className="p-2 hover:bg-white/10 rounded-full"><Rewind className="w-4 h-4" /></button>
        <button
          onClick={togglePlayback}
          className="p-2 hover:bg-white/10 rounded-full bg-white/5 border border-white/10"
        >
          {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
        </button>
        <button className="p-2 hover:bg-white/10 rounded-full"><FastForward className="w-4 h-4" /></button>
      </div>

      {/* Scrubber Track */}
      <div className="flex-1 mx-4 relative group cursor-pointer">
        <div className="h-1 bg-white/10 rounded-full overflow-hidden">
          <div className="h-full bg-blue-500 w-3/4 relative">
             <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 bg-white rounded-full shadow opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        </div>
        {/* Mock events on timeline */}
        <div className="absolute top-1/2 -translate-y-1/2 left-[20%] w-1 h-2 bg-yellow-500/50" />
        <div className="absolute top-1/2 -translate-y-1/2 left-[50%] w-1 h-2 bg-red-500/50" />
      </div>

      {/* Timestamp */}
      <div className="font-mono text-blue-400 text-sm w-48 text-right flex items-center justify-end">
        <Clock className="w-3 h-3 mr-2 text-white/30" />
        {formatDate(timestamp)}
      </div>
    </div>
  );
};
