"use client";

import React, { useState, useEffect } from 'react';
import { NavItem } from './NavItem';
import { LayoutDashboard, Activity, LineChart, DollarSign, Map, AlertTriangle, Globe, Layers, Cpu, FileCode, ChevronLeft, ChevronRight } from 'lucide-react';

export interface LeftNavProps {
    currentPath?: string;
}

export function LeftNav({ currentPath }: LeftNavProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem('petrosquare-nav-collapsed');
    if (stored) setCollapsed(stored === 'true');
  }, []);

  const toggleCollapse = () => {
    const newVal = !collapsed;
    setCollapsed(newVal);
    localStorage.setItem('petrosquare-nav-collapsed', String(newVal));
  };

  const isActive = (path: string) => currentPath === path || (path !== '/' && currentPath?.startsWith(path));

  // Determine width based on state
  // Using fixed width classes for transition
  const widthClass = collapsed ? 'w-20' : 'w-64';

  // Prevent hydration mismatch by rendering default (expanded) until mounted,
  // but if we want to avoid flash of expanded content, we might accept a flash or use layout effect (not SSR safe).
  // Given standard Next.js constraints without cookies, initial render is expanded.

  return (
    <aside className={`${widthClass} bg-surface border-r border-border flex flex-col h-screen sticky top-0 shrink-0 z-40 transition-all duration-300 hidden lg:flex`}>
      <div className={`p-4 flex items-center ${collapsed ? 'justify-center' : 'justify-between'} relative`}>
        <div className="flex items-center space-x-3 overflow-hidden">
             <img
               src="/logo/petrosquare-mark.svg"
               alt="PetroSquare"
               width={48}
               height={48}
               style={{ verticalAlign: 'middle' }}
               className="shrink-0"
             />
             <div className={`min-w-0 transition-opacity duration-300 ${collapsed ? 'opacity-0 w-0 hidden' : 'opacity-100'}`}>
                  <div className="text-lg font-bold tracking-tight text-white font-sans leading-none truncate">PetroSquare</div>
                  <div className="text-[10px] text-muted font-mono mt-1 truncate">OPERATING SYSTEM</div>
             </div>
        </div>
      </div>

      {/* Toggle Button */}
      <button
        onClick={toggleCollapse}
        className="absolute -right-3 top-10 bg-surface border border-border rounded-full p-1 text-muted hover:text-white z-50 shadow-sm"
        title={collapsed ? "Expand" : "Collapse"}
      >
        {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
      </button>

      <div className="flex-1 px-3 space-y-1 overflow-y-auto overflow-x-hidden no-scrollbar">
        {/* Modules */}
        <div className={`text-xs font-bold text-muted uppercase tracking-wider mb-2 mt-4 px-2 truncate transition-opacity ${collapsed ? 'opacity-0 h-0 hidden' : 'opacity-100'}`}>
          Modules
        </div>
        {collapsed && <div className="h-4"></div>}

        <NavItem href="/" active={currentPath === '/'} icon={<LayoutDashboard size={18} />} collapsed={collapsed}>Control Center</NavItem>
        <NavItem href="/modules/production" active={isActive('/modules/production')} icon={<Activity size={18} />} collapsed={collapsed}>Production</NavItem>
        <NavItem href="/modules/markets" active={isActive('/modules/markets')} icon={<LineChart size={18} />} collapsed={collapsed}>Markets</NavItem>
        <NavItem href="/modules/economics" active={isActive('/modules/economics')} icon={<DollarSign size={18} />} collapsed={collapsed}>Economics</NavItem>
        <NavItem href="/modules/gis" active={isActive('/modules/gis')} icon={<Map size={18} />} collapsed={collapsed}>GIS & Assets</NavItem>
        <NavItem href="/modules/risk" active={isActive('/modules/risk')} icon={<AlertTriangle size={18} />} collapsed={collapsed}>Risk & Reg</NavItem>
        <NavItem href="/modules/intel" active={isActive('/modules/intel')} icon={<Globe size={18} />} collapsed={collapsed}>Intelligence</NavItem>

        {/* Platform */}
        <div className={`text-xs font-bold text-muted uppercase tracking-wider mb-2 mt-8 px-2 truncate transition-opacity ${collapsed ? 'opacity-0 h-0 hidden' : 'opacity-100'}`}>
          Platform
        </div>
        {collapsed && <div className="h-4 border-t border-border mt-4 pt-4"></div>}

        <NavItem href="/capabilities" active={isActive('/capabilities')} icon={<Layers size={18} />} collapsed={collapsed}>Capabilities</NavItem>
        <NavItem href="/architecture" active={isActive('/architecture')} icon={<Cpu size={18} />} collapsed={collapsed}>Architecture</NavItem>
        <NavItem href="/contracts" active={isActive('/contracts')} icon={<FileCode size={18} />} collapsed={collapsed}>Contracts</NavItem>
      </div>

      <div className="p-4 border-t border-border mt-auto">
        <div className={`flex items-center ${collapsed ? 'justify-center' : 'space-x-3'} bg-surface-highlight/10 p-2 rounded-lg border border-transparent hover:border-border transition-colors cursor-pointer overflow-hidden`}>
            <div className="w-8 h-8 rounded-full bg-surface-highlight flex items-center justify-center text-xs font-bold text-white border border-border shrink-0">
                JS
            </div>
            <div className={`overflow-hidden min-w-0 transition-opacity ${collapsed ? 'opacity-0 w-0 hidden' : 'opacity-100'}`}>
                  <div className="text-sm font-medium text-white truncate">Jules S.</div>
                  <div className="text-xs text-muted truncate">Lead Engineer</div>
            </div>
        </div>
      </div>
    </aside>
  );
}
