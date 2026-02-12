import React from 'react';
import { NavItem } from './NavItem';
import { LayoutDashboard, Activity, LineChart, DollarSign, Map, AlertTriangle, Globe, Layers, Cpu, FileCode } from 'lucide-react';

export interface LeftNavProps {
    currentPath?: string;
}

export function LeftNav({ currentPath }: LeftNavProps) {
  const isActive = (path: string) => currentPath === path || (path !== '/' && currentPath?.startsWith(path));

  return (
    <aside className="w-64 bg-surface border-r border-border flex flex-col h-screen sticky top-0 shrink-0 z-40 overflow-y-auto hidden lg:flex">
      <div className="p-6">
        <div className="flex items-center space-x-3">
             <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M16 2L2 9V23L16 30L30 23V9L16 2Z" fill="#0F172A" stroke="#3B82F6" strokeWidth="2"/>
                <path d="M16 8L8 12V20L16 24L24 20V12L16 8Z" fill="#1E293B" stroke="#3B82F6" strokeWidth="1"/>
                <path d="M16 14V18" stroke="#3B82F6" strokeWidth="2"/>
                <path d="M14 16H18" stroke="#3B82F6" strokeWidth="2"/>
             </svg>
             <div>
                <div className="text-lg font-bold tracking-tight text-white font-sans leading-none">PetroSquare</div>
                <div className="text-[10px] text-muted font-mono mt-1">OPERATING SYSTEM</div>
             </div>
        </div>
      </div>

      <div className="flex-1 px-4 space-y-1">
        <div className="text-xs font-bold text-muted uppercase tracking-wider mb-2 mt-4 px-2">
          Modules
        </div>
        <NavItem href="/" active={currentPath === '/'} icon={<LayoutDashboard size={18} />}>Control Center</NavItem>
        <NavItem href="/modules/production" active={isActive('/modules/production')} icon={<Activity size={18} />}>Production</NavItem>
        <NavItem href="/modules/markets" active={isActive('/modules/markets')} icon={<LineChart size={18} />}>Markets</NavItem>
        <NavItem href="/modules/economics" active={isActive('/modules/economics')} icon={<DollarSign size={18} />}>Economics</NavItem>
        <NavItem href="/modules/gis" active={isActive('/modules/gis')} icon={<Map size={18} />}>GIS & Assets</NavItem>
        <NavItem href="/modules/risk" active={isActive('/modules/risk')} icon={<AlertTriangle size={18} />}>Risk & Reg</NavItem>
        <NavItem href="/modules/intel" active={isActive('/modules/intel')} icon={<Globe size={18} />}>Intelligence</NavItem>

        <div className="text-xs font-bold text-muted uppercase tracking-wider mb-2 mt-8 px-2">
          Platform
        </div>
        <NavItem href="/capabilities" active={isActive('/capabilities')} icon={<Layers size={18} />}>Capabilities</NavItem>
        <NavItem href="/architecture" active={isActive('/architecture')} icon={<Cpu size={18} />}>Architecture</NavItem>
        <NavItem href="/contracts" active={isActive('/contracts')} icon={<FileCode size={18} />}>Contracts</NavItem>
      </div>

      <div className="p-4 border-t border-border mt-auto">
        <div className="flex items-center space-x-3 bg-surface-highlight/10 p-2 rounded-lg border border-transparent hover:border-border transition-colors cursor-pointer">
            <div className="w-8 h-8 rounded-full bg-surface-highlight flex items-center justify-center text-xs font-bold text-white border border-border">
                JS
            </div>
            <div className="overflow-hidden">
                <div className="text-sm font-medium text-white truncate">Jules S.</div>
                <div className="text-xs text-muted truncate">Lead Engineer</div>
            </div>
        </div>
      </div>
    </aside>
  );
}
