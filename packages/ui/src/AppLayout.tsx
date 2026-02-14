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
    <div className="grid grid-cols-[auto_1fr] h-screen w-full bg-background text-text overflow-hidden isolate selection:bg-primary/20 selection:text-primary">
      {/* Sidebar Rail */}
      <div className="sticky top-0 h-screen z-40 bg-surface border-r border-border/50">
        <LeftNav currentPath={currentPath} />
      </div>

      {/* Main Content Area */}
      <div className="flex flex-col min-w-0 relative">
        <div className="sticky top-0 z-30 bg-background/80 backdrop-blur-md border-b border-border/50">
           <TopHeader />
        </div>

        <main className="flex-1 overflow-y-auto overflow-x-hidden scroll-smooth relative">
           <div className="min-h-full flex flex-col">
              <div className="flex-1">
                {children}
              </div>
              <div className="mt-auto pt-12">
                 <Footer />
              </div>
           </div>
        </main>
      </div>
    </div>
  );
}
