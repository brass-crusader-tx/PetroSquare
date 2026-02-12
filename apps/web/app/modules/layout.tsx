"use client";

import { usePathname } from 'next/navigation';
import { AppLayout } from '@petrosquare/ui';

export default function ModulesLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <AppLayout currentPath={pathname}>
      {children}
    </AppLayout>
  );
}
