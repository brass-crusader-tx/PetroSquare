import React from 'react';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'outline' | 'ghost' | 'success' | 'warning' | 'critical';
  className?: string;
}

export function Badge({ children, variant = 'default', className = '' }: BadgeProps) {
  const baseStyles = "inline-flex items-center rounded-sm px-2.5 py-0.5 text-xs font-medium font-mono uppercase tracking-wide transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2";

  const variants = {
    default: "bg-surface-highlight text-text border border-border",
    outline: "text-text border border-border",
    ghost: "bg-transparent text-muted hover:bg-surface-highlight",
    success: "bg-data-positive/10 text-data-positive border border-data-positive/20",
    warning: "bg-data-warning/10 text-data-warning border border-data-warning/20",
    critical: "bg-data-critical/10 text-data-critical border border-data-critical/20",
  };

  return (
    <div className={`${baseStyles} ${variants[variant]} ${className}`}>
      {children}
    </div>
  );
}
