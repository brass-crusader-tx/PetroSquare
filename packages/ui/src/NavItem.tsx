import type { ReactNode } from 'react';

export interface NavItemProps {
  href: string;
  active?: boolean;
  children: ReactNode;
  icon?: ReactNode;
  className?: string;
  collapsed?: boolean;
}

export function NavItem({ href, active, children, icon, className, collapsed }: NavItemProps) {
  const baseClass = "flex items-center rounded-lg text-sm font-medium transition-all duration-200 group relative";

  // Active state: White text, subtle background glow
  // Inactive state: Muted text, hover white
  const activeClass = active
    ? "bg-surface-highlight text-white shadow-sm shadow-white/5"
    : "text-muted hover:text-white hover:bg-white/5";

  const spacingClass = collapsed
    ? "justify-center px-2 py-2.5 mx-auto w-10 h-10"
    : "px-3 py-2.5 w-full mx-0";

  return (
    <a
      href={href}
      className={`${baseClass} ${activeClass} ${spacingClass} ${className || ''}`}
      title={collapsed ? String(children) : undefined}
    >
      {icon && (
        <span className={`flex items-center justify-center shrink-0 ${active ? 'text-primary' : 'text-muted group-hover:text-white'} transition-colors duration-200`}>
          {icon}
        </span>
      )}

      {!collapsed && (
        <span className="ml-3 truncate tracking-wide">{children}</span>
      )}

      {/* Active Indicator Line (Left) - Optional, mimicking some modern dashboards */}
      {active && !collapsed && (
        <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-4 bg-primary rounded-r-full"></span>
      )}
    </a>
  );
}
