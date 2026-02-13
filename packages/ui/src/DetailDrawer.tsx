"use client";

import { Drawer } from './Drawer';
import { useState, type ReactNode } from 'react';

export interface DetailDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    subtitle?: string;
    content?: {
        Overview?: ReactNode;
        Trends?: ReactNode;
        Drivers?: ReactNode;
        Risks?: ReactNode;
        RawData?: ReactNode;
    }
}

const TABS = ['Overview', 'Trends', 'Drivers', 'Risks', 'Raw Data'] as const;

export function DetailDrawer({ isOpen, onClose, title, subtitle, content }: DetailDrawerProps) {
    const [activeTab, setActiveTab] = useState<typeof TABS[number]>('Overview');

    return (
        <Drawer isOpen={isOpen} onClose={onClose} title={title}>
            <div className="mb-4">
                {subtitle && <p className="text-sm text-muted mb-4 font-mono">{subtitle}</p>}

                {/* Tabs */}
                <div className="flex space-x-1 border-b border-border pb-1 mb-4 overflow-x-auto no-scrollbar">
                    {TABS.map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-3 py-1.5 text-xs font-medium rounded-t transition-colors whitespace-nowrap ${
                                activeTab === tab
                                    ? 'bg-surface-highlight text-white border-b-2 border-primary'
                                    : 'text-muted hover:text-white hover:bg-surface-highlight/30'
                            }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                {/* Tab Intro */}
                <div className="text-xs text-muted font-mono mb-4 bg-surface-inset/50 p-2 rounded border border-border/50">
                    <span className="text-primary mr-2">ℹ</span>
                    {getTabIntro(activeTab)}
                </div>

                {/* Content */}
                <div className="min-h-[200px] animate-in fade-in duration-300">
                    {content?.[activeTab.replace(' ', '') as keyof typeof content] || (
                        <div className="flex flex-col items-center justify-center h-48 text-muted border border-dashed border-border rounded">
                            <span className="text-2xl mb-2 opacity-30">∅</span>
                            <span className="text-xs">No specific data available for {activeTab}.</span>
                            <span className="text-xs mt-1 opacity-50">Showing fallback metrics.</span>
                        </div>
                    )}
                </div>
            </div>
        </Drawer>
    );
}

function getTabIntro(tab: string): string {
    switch (tab) {
        case 'Overview': return 'Executive summary and high-level KPIs.';
        case 'Trends': return 'Historical time-series analysis and forecasting.';
        case 'Drivers': return 'Key factors influencing current performance.';
        case 'Risks': return 'Compliance status and risk exposure metrics.';
        case 'Raw Data': return 'Underlying dataset records and lineage.';
        default: return 'Detailed analysis.';
    }
}
