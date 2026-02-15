"use client";

import React, { ReactNode } from 'react';

export interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'ghost' | 'surface' | 'primary';
  size?: 'sm' | 'md' | 'lg';
}

export function IconButton({ children, variant = 'ghost', size = 'md', className, ...props }: IconButtonProps) {
  const baseStyles = "inline-flex items-center justify-center rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background";

  const variants = {
    ghost: "text-muted hover:text-white hover:bg-white/5",
    surface: "bg-surface-highlight/50 text-white border border-white/5 hover:bg-surface-highlight hover:border-white/10",
    primary: "bg-primary text-surface hover:bg-primary-hover shadow-lg shadow-primary/20",
  };

  const sizes = {
    sm: "p-1.5 h-8 w-8 text-sm",
    md: "p-2 h-10 w-10 text-base",
    lg: "p-3 h-12 w-12 text-lg",
  };

  const combinedClassName = `${baseStyles} ${variants[variant]} ${sizes[size]} ${className || ''}`;

  return (
    <button
      className={combinedClassName}
      {...props}
    >
      {children}
    </button>
  );
}
