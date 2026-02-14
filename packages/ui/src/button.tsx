import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

export function Button({ variant = 'primary', size = 'md', className, ...props }: ButtonProps) {
  const baseStyles = "inline-flex items-center justify-center rounded-xl font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background disabled:opacity-50 disabled:pointer-events-none";

  const variantStyles = {
    primary: "bg-primary hover:bg-primary-hover text-surface shadow-md shadow-primary/10",
    secondary: "bg-surface-highlight hover:bg-white/10 text-white border border-white/5",
    danger: "bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 border border-rose-500/20",
    ghost: "text-muted hover:text-white hover:bg-white/5",
  };

  const sizeStyles = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base",
  };

  const combinedClassName = `${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className || ''}`;

  return (
    <button className={combinedClassName} {...props} />
  );
}
