import { create } from 'zustand';
import { ModeId } from '../types';

interface ModeState {
  activeMode: ModeId;
  selection: { type: string; id: string } | null;

  setMode: (mode: ModeId) => void;
  selectEntity: (type: string, id: string) => void;
  clearSelection: () => void;
}

export const useModeStore = create<ModeState>((set) => ({
  activeMode: ModeId.CONTROL_CENTER,
  selection: null,

  setMode: (mode) => set({ activeMode: mode }),
  selectEntity: (type, id) => set({ selection: { type, id } }),
  clearSelection: () => set({ selection: null }),
}));
