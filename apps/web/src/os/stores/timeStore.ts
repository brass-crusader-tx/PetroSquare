import { create } from 'zustand';

export type TimeMode = 'RETRO' | 'LIVE' | 'SIM';

interface TimeState {
  mode: TimeMode;
  timestamp: number;
  playbackSpeed: number;
  isPlaying: boolean;

  setMode: (mode: TimeMode) => void;
  setTimestamp: (timestamp: number) => void;
  setPlaybackSpeed: (speed: number) => void;
  togglePlayback: () => void;
}

export const useTimeStore = create<TimeState>((set) => ({
  mode: 'LIVE',
  timestamp: Date.now(),
  playbackSpeed: 1,
  isPlaying: true,

  setMode: (mode) => set({ mode }),
  setTimestamp: (timestamp) => set({ timestamp }),
  setPlaybackSpeed: (speed) => set({ playbackSpeed: speed }),
  togglePlayback: () => set((state) => ({ isPlaying: !state.isPlaying })),
}));
