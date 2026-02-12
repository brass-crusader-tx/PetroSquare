import React, { ReactNode } from 'react';
import { LeftNav } from './LeftNav';
import { TopHeader } from './TopHeader';
import { Footer } from './Footer';

export interface AppLayoutProps {
  children: ReactNode;
  currentPath?: string;
}

export function AppLayout({ children, currentPath }: AppLayoutProps) {
  return (
    <div className="flex h-screen bg-background text-text font-sans antialiased overflow-hidden">
      <LeftNav currentPath={currentPath} />
      <div className="flex-1 flex flex-col min-w-0 h-full relative">
        <TopHeader />
        <main className="flex-1 overflow-y-auto overflow-x-hidden relative flex flex-col">
             <div className="flex-1 flex flex-col">
                {children}
             </div>
             <Footer />
        </main>
      </div>
    </div>
  );
}
