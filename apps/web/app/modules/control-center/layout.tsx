"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ControlCenterAssist } from './components/ControlCenterAssist';

const TABS = [
  { name: 'Overview', href: '/modules/control-center' },
  { name: 'Assets', href: '/modules/control-center/assets' },
  { name: 'Alerts', href: '/modules/control-center/alerts' },
  { name: 'Workflows', href: '/modules/control-center/workflows' }, // This might be a drawer manager, but maybe a page too? I'll keep it as page for now or remove if it's just a drawer.
  { name: 'Audit', href: '/modules/control-center/audit' },
];

export default function ControlCenterLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="flex flex-col h-full">
      <div className="border-b border-slate-700 bg-slate-900 px-6 py-2">
        <div className="flex space-x-6">
          {TABS.map((tab) => {
            const isActive = pathname === tab.href || (tab.href !== '/modules/control-center' && pathname.startsWith(tab.href));
            return (
              <Link
                key={tab.name}
                href={tab.href}
                className={`text-sm font-medium py-2 border-b-2 transition-colors ${
                  isActive
                    ? 'border-emerald-500 text-white'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                {tab.name}
              </Link>
            );
          })}
        </div>
      </div>
      <div className="flex-1 overflow-auto bg-slate-950">
        {children}
      </div>
      <ControlCenterAssist />
    </div>
  );
}
