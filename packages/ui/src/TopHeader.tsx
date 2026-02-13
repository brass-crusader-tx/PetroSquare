"use client";

import { useState } from 'react';
import { StatusPill } from './StatusPill';

export function TopHeader() {
    const [openDropdown, setOpenDropdown] = useState<'notifications' | 'settings' | null>(null);

    const handleLogout = () => {
        if (typeof window !== 'undefined') {
            localStorage.removeItem('petrosquare-auth');
            window.location.reload();
        }
    };

    const handleResetLayout = () => {
         if (typeof window !== 'undefined') {
            localStorage.removeItem('petrosquare-nav-collapsed');
            window.location.reload();
        }
    };

    return (
        <header className="h-16 bg-surface border-b border-border sticky top-0 z-30 flex items-center justify-between px-6 shadow-sm shrink-0">
            <div className="flex items-center space-x-4">
                {/* Global Search Stub */}
                <div className="relative hidden md:block w-96">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted">🔍</span>
                    <input
                        type="text"
                        placeholder="Search assets, wells, or reports..."
                        className="w-full bg-surface-inset border border-border rounded pl-10 pr-4 py-1.5 text-sm text-white focus:outline-none focus:border-primary transition-colors"
                        disabled
                    />
                </div>
            </div>

            <div className="flex items-center space-x-4">
                 <StatusPill status="success">System Live</StatusPill>
                 <div className="h-4 w-px bg-border"></div>
                 <span className="text-xs text-muted font-mono bg-surface-highlight/30 px-2 py-1 rounded">PREVIEW ENV</span>

                 <div className="h-4 w-px bg-border"></div>

                 {/* Notifications */}
                 <div className="relative">
                    <button
                        onClick={() => setOpenDropdown(openDropdown === 'notifications' ? null : 'notifications')}
                        className="text-muted hover:text-white p-1 hover:bg-surface-highlight rounded transition-colors"
                    >
                        🔔
                    </button>
                    {openDropdown === 'notifications' && (
                        <>
                            <div className="fixed inset-0 z-40" onClick={() => setOpenDropdown(null)}></div>
                            <div className="absolute right-0 mt-2 w-64 bg-surface border border-border rounded shadow-lg p-4 z-50 animate-in fade-in zoom-in-95 duration-100">
                                <div className="text-sm text-muted text-center italic">No notifications.</div>
                            </div>
                        </>
                    )}
                 </div>

                 {/* Settings */}
                 <div className="relative">
                    <button
                         onClick={() => setOpenDropdown(openDropdown === 'settings' ? null : 'settings')}
                         className="text-muted hover:text-white p-1 hover:bg-surface-highlight rounded transition-colors"
                    >
                        ⚙️
                    </button>
                    {openDropdown === 'settings' && (
                        <>
                            <div className="fixed inset-0 z-40" onClick={() => setOpenDropdown(null)}></div>
                            <div className="absolute right-0 mt-2 w-48 bg-surface border border-border rounded shadow-lg py-2 z-50 animate-in fade-in zoom-in-95 duration-100">
                                <button className="w-full text-left px-4 py-2 text-sm text-white hover:bg-surface-highlight cursor-default flex items-center justify-between">
                                    <span>Theme</span>
                                    <span className="text-xs text-muted">Dark</span>
                                </button>
                                <button
                                    onClick={handleResetLayout}
                                    className="w-full text-left px-4 py-2 text-sm text-white hover:bg-surface-highlight"
                                >
                                    Reset Layout
                                </button>
                                <div className="border-t border-border my-1"></div>
                                <button
                                    onClick={handleLogout}
                                    className="w-full text-left px-4 py-2 text-sm text-error hover:bg-surface-highlight"
                                >
                                    Log out
                                </button>
                            </div>
                        </>
                    )}
                 </div>
            </div>
        </header>
    )
}
