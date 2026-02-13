"use client";

import { StatusPill } from './StatusPill';
import { IconButton } from './IconButton';
import { useState, useRef, useEffect } from 'react';

export function TopHeader() {
    const [notifOpen, setNotifOpen] = useState(false);
    const [settingsOpen, setSettingsOpen] = useState(false);
    const notifRef = useRef<HTMLDivElement>(null);
    const settingsRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
                setNotifOpen(false);
            }
            if (settingsRef.current && !settingsRef.current.contains(event.target as Node)) {
                setSettingsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleLogout = () => {
        if (typeof window !== 'undefined') {
            localStorage.removeItem('petro_auth');
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

                 <div className="h-4 w-px bg-border mx-2"></div>

                 {/* Notifications */}
                 <div className="relative" ref={notifRef}>
                     <IconButton onClick={() => setNotifOpen(!notifOpen)} title="Notifications">
                         🔔
                     </IconButton>
                     {notifOpen && (
                         <div className="absolute right-0 mt-2 w-64 bg-surface border border-border rounded shadow-xl z-50 p-4">
                             <h4 className="text-sm font-bold text-white mb-2">Notifications</h4>
                             <div className="text-xs text-muted py-4 text-center border-t border-dashed border-border">
                                 No new notifications.
                             </div>
                         </div>
                     )}
                 </div>

                 {/* Settings */}
                 <div className="relative" ref={settingsRef}>
                     <IconButton onClick={() => setSettingsOpen(!settingsOpen)} title="Settings">
                         ⚙️
                     </IconButton>
                     {settingsOpen && (
                         <div className="absolute right-0 mt-2 w-48 bg-surface border border-border rounded shadow-xl z-50 p-2">
                             <button className="w-full text-left px-3 py-2 text-sm text-muted hover:text-white hover:bg-surface-highlight rounded transition-colors">
                                 Theme: Dark
                             </button>
                             <button className="w-full text-left px-3 py-2 text-sm text-muted hover:text-white hover:bg-surface-highlight rounded transition-colors" onClick={() => window.location.reload()}>
                                 Reset Layout
                             </button>
                             <div className="border-t border-border my-1"></div>
                             <button
                                onClick={handleLogout}
                                className="w-full text-left px-3 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-surface-highlight rounded transition-colors"
                             >
                                 Log Out
                             </button>
                         </div>
                     )}
                 </div>
            </div>
        </header>
    )
}
