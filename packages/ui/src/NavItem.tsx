import type { ReactNode } from 'react';

export interface NavItemProps {
  href: string;
  active?: boolean;
  children: ReactNode;
  icon?: ReactNode;
  className?: string;
}

export function NavItem({ href, active, children, icon, className }: NavItemProps) {
  const baseClass = "flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors font-sans w-full";
  const activeClass = active
    ? "bg-surface-highlight text-white"
    : "text-muted hover:text-white hover:bg-surface-highlight/50";

  return (
    <a href={href} className={`${baseClass} ${activeClass} ${className || ''}`}>
      {icon && <span className="mr-3 w-5 h-5 flex items-center justify-center shrink-0">{icon}</span>}
      <span className="truncate">{children}</span>
    </a>
  );
}
