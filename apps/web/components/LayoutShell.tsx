"use client";

import React, { createContext, useContext, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { NavItem, IconButton, Inspector } from '@petrosquare/ui';

// Context for global UI state
interface UIState {
  density: 'compact' | 'comfortable';
  inspectMode: boolean;
  toggleDensity: () => void;
  toggleInspectMode: () => void;
}

const UIContext = createContext<UIState>({
  density: 'comfortable',
  inspectMode: false,
  toggleDensity: () => {},
  toggleInspectMode: () => {},
});

export const useUI = () => useContext(UIContext);

export function LayoutShell({ children }: { children: React.ReactNode }) {
  const [density, setDensity] = useState<'compact' | 'comfortable'>('comfortable');
  const [inspectMode, setInspectMode] = useState(false);
  const [isInspectorOpen, setIsInspectorOpen] = useState(false);
  const pathname = usePathname();

  const toggleDensity = () => setDensity(d => d === 'compact' ? 'comfortable' : 'compact');
  const toggleInspectMode = () => setInspectMode(m => !m);

  return (
    <UIContext.Provider value={{ density, inspectMode, toggleDensity, toggleInspectMode }}>
      <div className={`min-h-screen bg-background text-text flex flex-col ${density === 'compact' ? 'text-sm' : ''}`}>

        {/* Top Navigation */}
        <header className="h-14 border-b border-border bg-surface flex items-center justify-between px-4 sticky top-0 z-30">
          <div className="flex items-center space-x-6">
            <Link href="/" className="font-sans font-bold text-lg text-white tracking-tight flex items-center gap-2">
              <div className="w-6 h-6 bg-primary rounded-sm" />
              PetroSquare
            </Link>

            <nav className="flex items-center space-x-1">
              <NavItem href="/capabilities" active={pathname === '/capabilities'}>Capabilities</NavItem>
              <NavItem href="/architecture" active={pathname === '/architecture'}>Architecture</NavItem>
              <NavItem href="/contracts" active={pathname === '/contracts'}>Contracts</NavItem>
              <NavItem href="/modules" active={pathname.startsWith('/modules')}>Modules</NavItem>
            </nav>
          </div>

          <div className="flex items-center space-x-2">
             <div className="h-4 w-[1px] bg-border mx-2" />

             <IconButton onClick={toggleDensity} active={density === 'compact'} title="Toggle Density">
               {density === 'compact' ? 'Condensed' : 'Comfortable'}
             </IconButton>

             <IconButton onClick={toggleInspectMode} active={inspectMode} title="Toggle Inspect Mode">
               Inspect
             </IconButton>

             <div className="h-4 w-[1px] bg-border mx-2" />

             <button
               onClick={() => setIsInspectorOpen(true)}
               className="text-xs font-mono text-muted hover:text-white transition-colors border border-border rounded-sm px-2 py-1 flex items-center gap-2"
             >
               <span className="w-2 h-2 rounded-full bg-data-positive animate-pulse" />
               SYSTEM
             </button>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1">
          {children}
        </main>

        {/* Global Inspector */}
        <Inspector
          isOpen={isInspectorOpen}
          onClose={() => setIsInspectorOpen(false)}
          pathName={pathname}
        />
      </div>
    </UIContext.Provider>
  );
}
