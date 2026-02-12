"use client";

import React, { ReactNode, useState, useEffect } from 'react';

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

export function DetailDrawer({ isOpen, onClose, title, subtitle, source, timestamp, tabs = [], children }: DetailDrawerProps) {
  const [activeTab, setActiveTab] = useState(tabs[0]?.id || '');

  useEffect(() => {
    if (tabs.length > 0 && !tabs.find(t => t.id === activeTab)) {
        setActiveTab(tabs[0].id);
    }
  }, [tabs, activeTab]);

  if (!isOpen) return null;

  return (
    <div className="fixed right-0 top-16 bottom-0 w-full max-w-[480px] bg-surface border-l border-border z-40 shadow-2xl flex flex-col transform transition-transform duration-300 ease-in-out">
        {/* Header */}
        <div className="flex flex-col p-6 border-b border-border bg-surface shrink-0">
            <div className="flex justify-between items-start mb-2">
                <div>
                    <h2 className="text-xl font-bold text-white font-sans">{title}</h2>
                    {subtitle && <div className="text-sm text-muted mt-1">{subtitle}</div>}
                </div>
                <button onClick={onClose} className="text-muted hover:text-white p-2 -mr-2">✕</button>
            </div>
            <div className="flex items-center space-x-4 text-xs text-muted font-mono mt-2">
                {source && <span>Source: {source}</span>}
                {timestamp && <span>Updated: {timestamp}</span>}
            </div>
        </div>

        {/* Tabs */}
        {tabs.length > 0 && (
            <div className="flex border-b border-border bg-surface-highlight/5 px-6 shrink-0 overflow-x-auto no-scrollbar">
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`py-3 px-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${activeTab === tab.id ? 'border-primary text-white' : 'border-transparent text-muted hover:text-white'}`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>
        )}

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
            {tabs.length > 0 ? (
                tabs.find(t => t.id === activeTab)?.content || children
            ) : children}
        </div>
    </div>
  );
}
