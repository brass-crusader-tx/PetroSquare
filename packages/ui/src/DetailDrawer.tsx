"use client";

import React, { ReactNode, useState, useEffect, useCallback, useRef } from 'react';
import { PanelLeftClose, MoveHorizontal, Maximize2, Minimize2 } from 'lucide-react';
import { IconButton } from './IconButton';

export interface DetailDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  source?: string;
  timestamp?: string;
  children?: ReactNode;
  tabs?: {
    id: string;
    label: string;
    content: ReactNode;
  }[];
}

const DEFAULT_WIDTH = 480;
const MIN_WIDTH = 320;

export function DetailDrawer({ isOpen, onClose, title, subtitle, source, timestamp, tabs = [], children }: DetailDrawerProps) {
  const [activeTab, setActiveTab] = useState(tabs[0]?.id || '');
  const [width, setWidth] = useState(DEFAULT_WIDTH);
  const [isResizing, setIsResizing] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);

  // Use ref to access latest width in callbacks without triggering re-binds
  const widthRef = useRef(width);

  // Load width
  useEffect(() => {
    const stored = localStorage.getItem('petrosquare-drawer-width');
    if (stored) {
        const parsed = parseInt(stored, 10);
        if (!isNaN(parsed)) {
            const w = Math.max(MIN_WIDTH, parsed);
            setWidth(w);
            widthRef.current = w;
        }
    }
  }, []);

  // Update ref when width changes
  useEffect(() => {
      widthRef.current = width;
  }, [width]);

  useEffect(() => {
    if (tabs.length > 0 && !tabs.find(t => t.id === activeTab)) {
        setActiveTab(tabs[0].id);
    }
  }, [tabs, activeTab]);

  const startResizing = useCallback((e: React.MouseEvent) => {
      e.preventDefault();
      setIsResizing(true);
  }, []);

  const stopResizing = useCallback(() => {
      setIsResizing(false);
      localStorage.setItem('petrosquare-drawer-width', String(widthRef.current));
  }, []);

  const resize = useCallback((e: MouseEvent) => {
      if (isResizing) {
          const newWidth = document.body.clientWidth - e.clientX;
          const maxWidth = document.body.clientWidth * 0.9; // 90vw max
          if (newWidth >= MIN_WIDTH && newWidth <= maxWidth) {
              setWidth(newWidth);
          }
      }
  }, [isResizing]);

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
      setWidth(DEFAULT_WIDTH);
      widthRef.current = DEFAULT_WIDTH;
      localStorage.setItem('petrosquare-drawer-width', String(DEFAULT_WIDTH));
  };

  if (!isOpen) return null;

  return (
    <>
        {/* Backdrop for mobile or explicit click-out */}
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden transition-opacity" onClick={onClose}></div>

        <div
            ref={sidebarRef}
            className={`fixed right-0 top-0 bottom-0 bg-surface border-l border-white/5 z-50 shadow-2xl flex flex-col ${isResizing ? 'transition-none' : 'transition-[width,transform] duration-300'} ease-in-out`}
            style={{ width: width }}
        >
            {/* Resize Handle */}
            <div
                className="absolute left-0 top-0 bottom-0 w-1.5 -ml-0.5 cursor-col-resize hover:bg-primary/50 transition-colors z-[60] flex items-center justify-center group"
                onMouseDown={startResizing}
            >
                {/* Visual handle indicator */}
                <div className="h-12 w-1 bg-white/10 group-hover:bg-primary rounded-full transition-colors"></div>
            </div>

            {/* Header */}
            <div className="flex flex-col p-6 border-b border-white/5 bg-surface/95 backdrop-blur-sm shrink-0">
                <div className="flex justify-between items-start mb-2 gap-4">
                    <div className="flex-1 min-w-0">
                        <h2 className="text-xl font-bold text-white tracking-tight truncate" title={title}>{title}</h2>
                        {subtitle && <div className="text-sm text-muted mt-1 truncate leading-relaxed">{subtitle}</div>}
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                        <IconButton
                            onClick={resetWidth}
                            variant="ghost"
                            size="sm"
                            title="Reset Width"
                        >
                            <MoveHorizontal size={16} />
                        </IconButton>
                        <IconButton
                            onClick={onClose}
                            variant="ghost"
                            size="sm"
                            title="Close"
                        >
                            <PanelLeftClose size={18} />
                        </IconButton>
                    </div>
                </div>
                <div className="flex items-center gap-4 text-xs text-muted/60 font-mono mt-3 truncate">
                    {source && <span className="flex items-center gap-1.5"><span className="w-1 h-1 rounded-full bg-primary/50"></span>Source: {source}</span>}
                    {timestamp && <span>Updated: {timestamp}</span>}
                </div>
            </div>

            {/* Tabs */}
            {tabs.length > 0 && (
                <div className="flex border-b border-white/5 bg-surface-highlight/5 px-6 shrink-0 overflow-x-auto no-scrollbar">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`relative py-3 px-4 text-sm font-medium transition-colors whitespace-nowrap ${
                                activeTab === tab.id
                                ? 'text-white'
                                : 'text-muted hover:text-white'
                            }`}
                        >
                            {tab.label}
                            {activeTab === tab.id && (
                                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-t-full shadow-[0_-1px_4px_rgba(45,212,191,0.5)]"></span>
                            )}
                        </button>
                    ))}
                </div>
            )}

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 scroll-smooth">
                {tabs.length > 0 ? (
                    tabs.find(t => t.id === activeTab)?.content || children
                ) : children}
            </div>
        </div>
    </>
  );
}
