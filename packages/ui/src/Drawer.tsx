"use client";

import type { ReactNode } from 'react';
import { X } from 'lucide-react';
import { IconButton } from './IconButton';

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
        className="fixed inset-0 bg-black/60 z-40 transition-opacity backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />
      <div className={`fixed right-0 top-0 bottom-0 w-96 bg-surface border-l border-white/5 z-50 shadow-2xl overflow-y-auto transform transition-transform duration-300 ease-out ${className || ''}`}>
        <div className="flex items-center justify-between p-5 border-b border-white/5 bg-surface-highlight/5 backdrop-blur-md sticky top-0 z-10">
          <h2 className="text-lg font-semibold text-white tracking-tight">{title || 'Inspector'}</h2>
          <IconButton
            onClick={onClose}
            variant="ghost"
            size="sm"
          >
            <X size={18} />
          </IconButton>
        </div>
        <div className="p-5 space-y-5">
          {children}
        </div>
      </div>
    </>
  );
}
