import { create } from 'zustand';

export type TelemetryStatus = 'RAW' | 'INFERRED' | 'STALE';

export interface TelemetryPoint {
  id: string;
  value: number;
  timestamp: number;
  status: TelemetryStatus;
  unit: string;
}

interface TelemetryState {
  points: Record<string, TelemetryPoint>;
  updatePoint: (id: string, value: number, status: TelemetryStatus) => void;
  getPoint: (id: string) => TelemetryPoint | undefined;
}

export const useTelemetryStore = create<TelemetryState>((set, get) => ({
  points: {},

  updatePoint: (id, value, status) => set((state) => ({
    points: {
      ...state.points,
      [id]: {
        id,
        value,
        timestamp: Date.now(),
        status,
        unit: 'unit', // Placeholder, in real app this would come from metadata
      },
    },
  })),

  getPoint: (id) => get().points[id],
}));
