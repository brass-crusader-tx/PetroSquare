import { create } from 'zustand';

export interface UserPresence {
  id: string;
  name: string;
  color: string;
  position: [number, number, number];
  focusedEntityId?: string;
  lastActive: number;
}

interface PresenceState {
  users: UserPresence[];
  currentUser: UserPresence;
  updateUserPosition: (position: [number, number, number]) => void;
  setUserFocus: (entityId?: string) => void;
}

export const usePresenceStore = create<PresenceState>((set) => ({
  users: [],
  currentUser: {
    id: 'me',
    name: 'Operator',
    color: '#10B981',
    position: [0, 0, 0],
    lastActive: Date.now(),
  },

  updateUserPosition: (position) => set((state) => ({
    currentUser: { ...state.currentUser, position, lastActive: Date.now() },
  })),

  setUserFocus: (entityId) => set((state) => ({
    currentUser: { ...state.currentUser, focusedEntityId: entityId, lastActive: Date.now() },
  })),
}));
