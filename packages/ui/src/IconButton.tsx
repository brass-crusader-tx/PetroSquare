import React from 'react';

export interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  active?: boolean;
}

export function IconButton({ children, className, active, ...props }: IconButtonProps) {
  return (
    <button
      className={`p-2 rounded-sm transition-colors hover:bg-surface-highlight ${
        active ? 'bg-surface-highlight text-white' : 'text-muted'
      } ${className || ''}`}
      {...props}
    >
      {children}
    </button>
  );
}
