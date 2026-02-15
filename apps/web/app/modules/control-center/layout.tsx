"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ControlCenterAssist } from './components/ControlCenterAssist';

const TABS = [
  { name: 'Overview', href: '/modules/control-center' },
  { name: 'Assets', href: '/modules/control-center/assets' },
  { name: 'Alerts', href: '/modules/control-center/alerts' },
  { name: 'Workflows', href: '/modules/control-center/workflows' },
  { name: 'Audit', href: '/modules/control-center/audit' },
];

export default function ControlCenterLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="flex flex-col h-full relative">
      {/* Tab Navigation Bar */}
      <div className="sticky top-0 z-20 bg-background/80 backdrop-blur-md border-b border-white/5 px-6">
        <div className="flex space-x-1">
          {TABS.map((tab) => {
            const isActive = pathname === tab.href || (tab.href !== '/modules/control-center' && pathname.startsWith(tab.href));
            return (
              <Link
                key={tab.name}
                href={tab.href}
                className={`relative px-4 py-3 text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'text-white'
                    : 'text-muted hover:text-white hover:bg-white/5'
                }`}
              >
                {tab.name}
                {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-t-full shadow-[0_-1px_6px_rgba(45,212,191,0.5)]"></span>
                )}
              </Link>
            );
          })}
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 relative">
        {children}
      </div>

      {/* Floating Assist Button/Panel */}
      <ControlCenterAssist />
    </div>
  );
}
