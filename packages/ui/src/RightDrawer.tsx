"use client";

import React, { ReactNode, useState, useEffect, useRef, useCallback } from 'react';
import { X, MoveHorizontal, Maximize2, Minimize2 } from 'lucide-react';
import { useDrawer } from './context/DrawerContext';

const MIN_WIDTH = 320;

export function RightDrawer() {
  const { drawerState, closeDrawer, setDrawerWidth } = useDrawer();
  const { isOpen, content, title, subtitle, width = 480 } = drawerState;

  const [isResizing, setIsResizing] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);

  // Persist width locally for UX continuity
  useEffect(() => {
    const stored = localStorage.getItem('petrosquare-drawer-width');
    if (stored) {
        const parsed = parseInt(stored, 10);
        if (!isNaN(parsed) && parsed >= MIN_WIDTH) {
            setDrawerWidth(parsed);
        }
    }
  }, [setDrawerWidth]);

  const startResizing = useCallback((e: React.MouseEvent) => {
      e.preventDefault();
      setIsResizing(true);
  }, []);

  const stopResizing = useCallback(() => {
      setIsResizing(false);
      localStorage.setItem('petrosquare-drawer-width', String(width));
  }, [width]);

  const resize = useCallback((e: MouseEvent) => {
      if (isResizing) {
          const newWidth = document.body.clientWidth - e.clientX;
          const maxWidth = document.body.clientWidth * 0.9; // 90vw max
          if (newWidth >= MIN_WIDTH && newWidth <= maxWidth) {
              setDrawerWidth(newWidth);
          }
      }
  }, [isResizing, setDrawerWidth]);

  // Add/remove listeners
  useEffect(() => {
      if (isResizing) {
          window.addEventListener("mousemove", resize);
          window.addEventListener("mouseup", stopResizing);
      }
      return () => {
          window.removeEventListener("mousemove", resize);
          window.removeEventListener("mouseup", stopResizing);
      };
  }, [isResizing, resize, stopResizing]);

  const resetWidth = () => {
      const def = 480;
      setDrawerWidth(def);
      localStorage.setItem('petrosquare-drawer-width', String(def));
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop for mobile */}
      <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={closeDrawer}></div>

      <div
          ref={sidebarRef}
          className={`fixed right-0 top-16 bottom-0 bg-surface border-l border-border z-50 shadow-2xl flex flex-col ${isResizing ? 'transition-none' : 'transition-[width,transform] duration-300'} ease-in-out`}
          style={{ width: width }}
      >
          {/* Resize Handle */}
          <div
              className="absolute left-0 top-0 bottom-0 w-1.5 -ml-0.5 cursor-col-resize hover:bg-primary/50 transition-colors z-[60] flex items-center justify-center group"
              onMouseDown={startResizing}
          >
              <div className="h-8 w-1 bg-border group-hover:bg-primary rounded-full transition-colors"></div>
          </div>

          {/* Header */}
          <div className="flex flex-col p-6 border-b border-border bg-surface shrink-0">
              <div className="flex justify-between items-start">
                  <div className="flex-1 min-w-0 pr-4">
                      <h2 className="text-xl font-bold text-white font-sans truncate" title={title}>{title}</h2>
                      {subtitle && <div className="text-sm text-muted mt-1 truncate">{subtitle}</div>}
                  </div>
                  <div className="flex items-center space-x-2 shrink-0">
                      <button
                          onClick={resetWidth}
                          className="text-muted hover:text-white p-1.5 rounded hover:bg-surface-highlight transition-colors"
                          title="Reset Width"
                      >
                          <MoveHorizontal size={16} />
                      </button>
                      <button
                          onClick={closeDrawer}
                          className="text-muted hover:text-white p-1.5 rounded hover:bg-surface-highlight transition-colors"
                          title="Close (Esc)"
                      >
                          <X size={20} />
                      </button>
                  </div>
              </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6 bg-background/50">
              {content}
          </div>
      </div>
    </>
  );
}
