import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

export const buttonBaseStyles = "inline-flex items-center justify-center rounded-xl font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background disabled:opacity-50 disabled:pointer-events-none";

export const buttonVariants = {
  primary: "bg-primary hover:bg-primary-hover text-surface shadow-md shadow-primary/10",
  secondary: "bg-surface-highlight hover:bg-white/10 text-white border border-white/5",
  danger: "bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 border border-rose-500/20",
  ghost: "text-muted hover:text-white hover:bg-white/5",
};

export const buttonSizes = {
  sm: "px-3 py-1.5 text-xs",
  md: "px-4 py-2 text-sm",
  lg: "px-6 py-3 text-base",
};

export function getButtonClassName(variant: keyof typeof buttonVariants = 'primary', size: keyof typeof buttonSizes = 'md', className = '') {
  return `${buttonBaseStyles} ${buttonVariants[variant]} ${buttonSizes[size]} ${className}`;
}

export function Button({ variant = 'primary', size = 'md', className, ...props }: ButtonProps) {
  const combinedClassName = getButtonClassName(variant, size, className);

  return (
    <button className={combinedClassName} {...props} />
  );
}
