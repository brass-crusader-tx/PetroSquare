"use client";

import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';

interface DrawerState {
  isOpen: boolean;
  content: ReactNode | null;
  title: string;
  subtitle?: string;
  width?: number;
}

interface DrawerContextType {
  drawerState: DrawerState;
  openDrawer: (content: ReactNode, options?: { title?: string, subtitle?: string, width?: number }) => void;
  closeDrawer: () => void;
  setDrawerWidth: (width: number) => void;
}

const DrawerContext = createContext<DrawerContextType | undefined>(undefined);

export function DrawerProvider({ children }: { children: ReactNode }) {
  const [drawerState, setDrawerState] = useState<DrawerState>({
    isOpen: false,
    content: null,
    title: '',
    subtitle: '',
    width: 480,
  });

  const openDrawer = useCallback((content: ReactNode, options?: { title?: string, subtitle?: string, width?: number }) => {
    setDrawerState(prev => ({
      ...prev,
      isOpen: true,
      content,
      title: options?.title || 'Details',
      subtitle: options?.subtitle || '',
      width: options?.width || prev.width || 480,
    }));
  }, []);

  const closeDrawer = useCallback(() => {
    setDrawerState(prev => ({ ...prev, isOpen: false }));
  }, []);

  const setDrawerWidth = useCallback((width: number) => {
    setDrawerState(prev => ({ ...prev, width }));
  }, []);

  return (
    <DrawerContext.Provider value={{ drawerState, openDrawer, closeDrawer, setDrawerWidth }}>
      {children}
    </DrawerContext.Provider>
  );
}

export function useDrawer() {
  const context = useContext(DrawerContext);
  if (context === undefined) {
    throw new Error('useDrawer must be used within a DrawerProvider');
  }
  return context;
}
