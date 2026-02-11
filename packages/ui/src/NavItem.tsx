import React from 'react';
import Link from 'next/link';

export interface NavItemProps {
  href: string;
  children: React.ReactNode;
  active?: boolean;
}

export function NavItem({ href, children, active }: NavItemProps) {
  return (
    <Link
      href={href}
      className={`px-3 py-2 text-sm font-medium transition-colors hover:text-white ${
        active ? 'text-white border-b-2 border-primary' : 'text-muted'
      }`}
    >
      {children}
    </Link>
  );
}
