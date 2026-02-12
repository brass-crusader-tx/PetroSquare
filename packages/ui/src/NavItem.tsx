import type { ReactNode } from 'react';

// We accept an 'as' prop to support Next.js Link or regular a tag
export interface NavItemProps {
  href: string;
  active?: boolean;
  children: ReactNode;
  className?: string;
}

export function NavItem({ href, active, children, className }: NavItemProps) {
  const baseClass = "px-3 py-2 rounded-md text-sm font-medium transition-colors font-sans";
  const activeClass = active
    ? "bg-surface-highlight text-white"
    : "text-muted hover:text-white hover:bg-surface-highlight/50";

  return (
    <a href={href} className={`${baseClass} ${activeClass} ${className || ''}`}>
      {children}
    </a>
  );
}
