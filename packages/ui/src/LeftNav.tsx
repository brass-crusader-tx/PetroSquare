"use client";

import React, { useState, useEffect } from 'react';
import { NavItem } from './NavItem';
import { LayoutDashboard, Activity, LineChart, DollarSign, Map, AlertTriangle, Globe, Layers, Cpu, FileCode, ChevronLeft, ChevronRight, User } from 'lucide-react';

export interface LeftNavProps {
    currentPath?: string;
}

export function LeftNav({ currentPath }: LeftNavProps) {
  const [collapsed, setCollapsed] = useState(true);
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

  const widthClass = collapsed ? 'w-[72px]' : 'w-64';

  return (
    <aside className={`${widthClass} flex flex-col h-full bg-surface border-r border-border/50 transition-all duration-300 z-50`}>
      {/* Header / Logo */}
      <div className={`h-16 flex items-center ${collapsed ? 'justify-center' : 'px-6 justify-between'} border-b border-border/50`}>
        <div className="flex items-center gap-3 overflow-hidden">
             <img
               src="/logo/petrosquare-mark.svg"
               alt="PetroSquare"
               className="w-8 h-8 shrink-0"
             />
             <div className={`transition-opacity duration-300 ${collapsed ? 'opacity-0 w-0 hidden' : 'opacity-100'}`}>
                  <span className="text-sm font-bold tracking-tight text-white font-sans">PetroSquare</span>
             </div>
        </div>
      </div>

      {/* Navigation Items */}
      <div className="flex-1 py-6 px-3 space-y-1 overflow-y-auto scrollbar-none">
        <NavItem href="/modules/control-center" active={isActive('/modules/control-center')} icon={<LayoutDashboard size={20} />} collapsed={collapsed}>Control Center</NavItem>
        <NavItem href="/modules/production" active={isActive('/modules/production')} icon={<Activity size={20} />} collapsed={collapsed}>Production</NavItem>
        <NavItem href="/modules/markets" active={isActive('/modules/markets')} icon={<LineChart size={20} />} collapsed={collapsed}>Markets</NavItem>
        <NavItem href="/modules/economics" active={isActive('/modules/economics')} icon={<DollarSign size={20} />} collapsed={collapsed}>Economics</NavItem>
        <NavItem href="/modules/gis" active={isActive('/modules/gis')} icon={<Map size={20} />} collapsed={collapsed}>GIS & Assets</NavItem>
        <NavItem href="/modules/risk" active={isActive('/modules/risk')} icon={<AlertTriangle size={20} />} collapsed={collapsed}>Risk & Reg</NavItem>
        <NavItem href="/modules/intel" active={isActive('/modules/intel')} icon={<Globe size={20} />} collapsed={collapsed}>Intelligence</NavItem>

        <div className="my-4 border-t border-border/50 mx-2"></div>

        <NavItem href="/capabilities" active={isActive('/capabilities')} icon={<Layers size={20} />} collapsed={collapsed}>Capabilities</NavItem>
        <NavItem href="/architecture" active={isActive('/architecture')} icon={<Cpu size={20} />} collapsed={collapsed}>Architecture</NavItem>
        <NavItem href="/contracts" active={isActive('/contracts')} icon={<FileCode size={20} />} collapsed={collapsed}>Contracts</NavItem>
      </div>

      {/* User / Collapse */}
      <div className="p-3 border-t border-border/50 flex flex-col gap-2">
         <button
            onClick={toggleCollapse}
            className="flex items-center justify-center w-full p-2 text-muted hover:text-white hover:bg-surface-highlight/50 rounded-md transition-colors"
            title={collapsed ? "Expand" : "Collapse"}
         >
            {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
         </button>

         <div className={`flex items-center ${collapsed ? 'justify-center' : 'px-3 space-x-3'} py-2 rounded-md hover:bg-surface-highlight/50 transition-colors cursor-pointer`}>
            <div className="w-8 h-8 rounded-full bg-surface-highlight flex items-center justify-center border border-border shrink-0 text-white text-xs font-bold">
                JS
            </div>
            {!collapsed && (
                <div className="overflow-hidden">
                    <div className="text-xs font-medium text-white truncate">Jules S.</div>
                    <div className="text-[10px] text-muted truncate">Lead Engineer</div>
                </div>
            )}
         </div>
      </div>
    </aside>
  );
}
