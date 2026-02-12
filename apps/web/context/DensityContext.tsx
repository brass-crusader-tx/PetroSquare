"use client";

import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

type Density = 'compact' | 'comfortable';

interface DensityContextType {
  density: Density;
  setDensity: (density: Density) => void;
  inspectMode: boolean;
  setInspectMode: (inspect: boolean) => void;
  toggleDensity: () => void;
  toggleInspectMode: () => void;
}

const DensityContext = createContext<DensityContextType | undefined>(undefined);

export function DensityProvider({ children }: { children: ReactNode }) {
  const [density, setDensity] = useState<Density>('comfortable');
  const [inspectMode, setInspectMode] = useState(false);

  // Optional: Persist to localStorage
  useEffect(() => {
    const savedDensity = localStorage.getItem('petrosquare-density') as Density;
    if (savedDensity) setDensity(savedDensity);

    const savedInspect = localStorage.getItem('petrosquare-inspect') === 'true';
    setInspectMode(savedInspect);
  }, []);

  useEffect(() => {
    localStorage.setItem('petrosquare-density', density);
  }, [density]);

  useEffect(() => {
    localStorage.setItem('petrosquare-inspect', String(inspectMode));
  }, [inspectMode]);

  const toggleDensity = () => setDensity(d => d === 'comfortable' ? 'compact' : 'comfortable');
  const toggleInspectMode = () => setInspectMode(m => !m);

  return (
    <DensityContext.Provider value={{ density, setDensity, inspectMode, setInspectMode, toggleDensity, toggleInspectMode }}>
      {children}
    </DensityContext.Provider>
  );
}

export function useDensity() {
  const context = useContext(DensityContext);
  if (!context) {
    throw new Error('useDensity must be used within a DensityProvider');
  }
  return context;
}
