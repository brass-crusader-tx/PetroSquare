import { create } from 'zustand';

export interface Proposal {
  id: string;
  type: 'MAINTENANCE' | 'OPTIMIZATION' | 'SAFETY';
  title: string;
  description: string;
  targetId: string;
  timestamp: number;
  status: 'PENDING' | 'APPROVED' | 'DISMISSED';
  impact: string;
}

interface ProposalState {
  proposals: Proposal[];
  addProposal: (proposal: Omit<Proposal, 'id' | 'timestamp' | 'status'>) => void;
  approveProposal: (id: string) => void;
  dismissProposal: (id: string) => void;
}

export const useProposalStore = create<ProposalState>((set) => ({
  proposals: [],

  addProposal: (proposal) => set((state) => ({
    proposals: [
      ...state.proposals,
      {
        ...proposal,
        id: crypto.randomUUID(),
        timestamp: Date.now(),
        status: 'PENDING',
      },
    ],
  })),

  approveProposal: (id) => set((state) => ({
    proposals: state.proposals.map((p) =>
      p.id === id ? { ...p, status: 'APPROVED' } : p
    ),
  })),

  dismissProposal: (id) => set((state) => ({
    proposals: state.proposals.map((p) =>
      p.id === id ? { ...p, status: 'DISMISSED' } : p
    ),
  })),
}));
