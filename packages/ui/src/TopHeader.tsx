import { StatusPill } from './StatusPill';

export function TopHeader() {
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
            </div>
        </header>
    )
}
