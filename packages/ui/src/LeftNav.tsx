"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

const modules = [
    { name: 'Markets', path: '/modules/markets', icon: 'M' },
    { name: 'Production', path: '/modules/production', icon: 'P' },
    { name: 'Economics', path: '/modules/economics', icon: 'E' },
    { name: 'GIS & Assets', path: '/modules/gis', icon: 'G' },
    { name: 'Risk', path: '/modules/risk', icon: 'R' },
    { name: 'Intel', path: '/modules/intel', icon: 'I' },
];

export function LeftNav() {
    const pathname = usePathname();
    const [collapsed, setCollapsed] = useState(false);

    return (
        <nav className={`bg-surface border-r border-border flex flex-col transition-all duration-300 ${collapsed ? 'w-16' : 'w-64'} h-screen sticky top-0 left-0 z-40 shrink-0`}>
            {/* Brand */}
            <div className="h-16 flex items-center justify-center border-b border-border shrink-0">
                <Link href="/" className="font-bold text-white tracking-tight flex items-center">
                    <img src="/logo/petrosquare-mark.svg" alt="PetroSquare" className="w-6 h-6" />
                    {!collapsed && <span className="ml-3 font-sans text-lg">PetroSquare</span>}
                </Link>
            </div>

            {/* Modules */}
            <div className="flex-1 overflow-y-auto py-4 space-y-1 px-2">
                {modules.map((mod) => {
                    const isActive = pathname?.startsWith(mod.path);
                    return (
                        <Link
                            key={mod.path}
                            href={mod.path}
                            className={`flex items-center px-3 py-2 rounded-md transition-colors group ${
                                isActive
                                    ? 'bg-primary/10 text-primary'
                                    : 'text-muted hover:text-white hover:bg-surface-highlight/30'
                            }`}
                        >
                            <span className={`w-6 h-6 flex items-center justify-center rounded border font-mono text-xs ${
                                isActive ? 'border-primary bg-primary text-white' : 'border-border bg-surface-highlight/20'
                            }`}>
                                {mod.icon}
                            </span>
                            {!collapsed && (
                                <span className={`ml-3 text-sm font-medium ${isActive ? 'font-bold' : ''}`}>
                                    {mod.name}
                                </span>
                            )}
                        </Link>
                    );
                })}
            </div>

            {/* Footer / User */}
            <div className="p-4 border-t border-border shrink-0">
                 <button
                    onClick={() => setCollapsed(!collapsed)}
                    className="w-full flex items-center justify-center text-muted hover:text-white mb-4 text-xs uppercase font-mono"
                >
                    {collapsed ? '→' : '← Collapse'}
                </button>
                <div className={`flex items-center ${collapsed ? 'justify-center' : ''}`}>
                    <div className="w-8 h-8 rounded-full bg-surface-highlight border border-border flex items-center justify-center text-xs text-white">
                        US
                    </div>
                    {!collapsed && (
                        <div className="ml-3 overflow-hidden">
                            <div className="text-sm text-white font-medium truncate">User</div>
                            <div className="text-xs text-muted truncate">Admin</div>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
}
