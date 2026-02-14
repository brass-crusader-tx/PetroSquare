import { create } from 'zustand';

export interface Annotation {
  id: string;
  type: 'POINT' | 'AREA' | 'NOTE';
  position: [number, number, number];
  content: string;
  authorId: string;
  timestamp: number;
}

interface AnnotationState {
  annotations: Annotation[];
  addAnnotation: (annotation: Omit<Annotation, 'id' | 'timestamp'>) => void;
  removeAnnotation: (id: string) => void;
}

export const useAnnotationStore = create<AnnotationState>((set) => ({
  annotations: [],

  addAnnotation: (annotation) => set((state) => ({
    annotations: [
      ...state.annotations,
      {
        ...annotation,
        id: crypto.randomUUID(),
        timestamp: Date.now(),
      },
    ],
  })),

  removeAnnotation: (id) => set((state) => ({
    annotations: state.annotations.filter((a) => a.id !== id),
  })),
}));
