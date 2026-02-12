import type { ReactNode } from 'react';
import { LeftNav } from './LeftNav';
import { TopHeader } from './TopHeader';

export function AppLayout({ children }: { children: ReactNode }) {
    return (
        <div className="flex h-screen bg-background text-text font-sans antialiased overflow-hidden">
            <LeftNav />
            <div className="flex-1 flex flex-col min-w-0 h-screen">
                <TopHeader />
                <main className="flex-1 overflow-y-auto overflow-x-hidden relative">
                    {children}
                </main>
            </div>
        </div>
    );
}
