"use client";

import type { ReactNode } from 'react';

export interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  title?: string;
  className?: string;
}

export function Drawer({ isOpen, onClose, children, title, className }: DrawerProps) {
  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-black/50 z-40 transition-opacity backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />
      <div className={`fixed right-0 top-0 bottom-0 w-96 bg-surface border-l border-border z-50 shadow-xl overflow-y-auto transform transition-transform duration-300 ${className || ''}`}>
        <div className="flex items-center justify-between p-4 border-b border-border bg-surface-highlight/10">
          <h2 className="text-lg font-semibold font-sans text-white tracking-tight">{title || 'Inspector'}</h2>
          <button
            onClick={onClose}
            className="text-muted hover:text-white p-2 rounded hover:bg-surface-highlight transition-colors"
          >
            ✕
          </button>
        </div>
        <div className="p-4 space-y-4">
          {children}
        </div>
      </div>
    </>
  );
}
