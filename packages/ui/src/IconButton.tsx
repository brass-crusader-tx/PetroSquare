"use client";

import type { ReactNode } from 'react';

export interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'ghost' | 'surface' | 'primary';
  size?: 'sm' | 'md' | 'lg';
}

export function IconButton({ children, variant = 'ghost', size = 'md', className, ...props }: IconButtonProps) {
  const baseStyles = "inline-flex items-center justify-center rounded transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background";

  const variants = {
    ghost: "text-muted hover:text-white hover:bg-surface-highlight",
    surface: "bg-surface text-white border border-border hover:bg-surface-highlight",
    primary: "bg-primary text-white hover:bg-blue-600",
  };

  const sizes = {
    sm: "p-1 h-8 w-8 text-sm",
    md: "p-2 h-10 w-10 text-base",
    lg: "p-3 h-12 w-12 text-lg",
  };

  // Ensure size key exists, default to 'md'
  const sizeClass = sizes[size] || sizes['md'];

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizeClass} ${className || ''}`}
      {...props}
    >
      {children}
    </button>
  );
}
