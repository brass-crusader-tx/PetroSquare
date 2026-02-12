import React from 'react';
import { Search, Bell, Settings, Menu } from 'lucide-react';
import { IconButton } from './IconButton';

export function TopHeader() {
  return (
    <header className="h-16 bg-surface border-b border-border flex items-center justify-between px-6 sticky top-0 z-30 shrink-0">
        <div className="flex items-center lg:hidden mr-4">
             <button className="text-white p-2">
                 <Menu size={20} />
             </button>
        </div>

        <div className="flex-1 max-w-xl hidden md:block">
            <div className="relative group">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted group-focus-within:text-primary transition-colors">
                    <Search size={16} />
                </span>
                <input
                    type="text"
                    placeholder="Search assets, wells, or reports..."
                    className="w-full bg-surface-highlight/20 border border-border rounded-full py-2 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-primary transition-all placeholder:text-muted/50"
                />
            </div>
        </div>

        <div className="flex items-center space-x-4 ml-auto">
            <div className="hidden md:flex items-center space-x-2">
                 <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                 <span className="text-xs font-mono text-muted">SYSTEM ONLINE</span>
            </div>
            <div className="h-6 w-px bg-border mx-2 hidden md:block"></div>
            <IconButton variant="ghost" size="sm">
                <Bell size={18} />
            </IconButton>
            <IconButton variant="ghost" size="sm">
                <Settings size={18} />
            </IconButton>
        </div>
    </header>
  );
}
