"use client";

import React, { useState } from 'react';
import { PageContainer, SectionHeader } from '@petrosquare/ui';
import { RiskDashboard } from './components/RiskDashboard';
import { WatchlistManager } from './components/WatchlistManager';
import { RegulationsList } from './components/RegulationsList';
import { AssessmentFlow } from './components/AssessmentFlow';
import { IssueTracker } from './components/IssueTracker';

export default function RiskPage() {
    const [activeTab, setActiveTab] = useState<'dashboard' | 'regulations' | 'assessments' | 'issues' | 'watchlists'>('dashboard');

    const tabs = [
        { id: 'dashboard', label: 'Dashboard' },
        { id: 'regulations', label: 'Regulations' },
        { id: 'assessments', label: 'Assessments' },
        { id: 'issues', label: 'Issues' },
        { id: 'watchlists', label: 'Watchlists' },
    ] as const;

    return (
        <PageContainer>
            <SectionHeader
                title="Risk & Regulatory"
                description="Monitor geopolitical events, regulatory changes, and operational alerts."
            />

            {/* Tabs */}
            <div className="flex border-b border-border mb-6 overflow-x-auto">
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                            activeTab === tab.id
                                ? 'border-primary text-primary'
                                : 'border-transparent text-muted hover:text-white hover:border-surface-highlight'
                        }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Content */}
            <div className="min-h-[500px]">
                {activeTab === 'dashboard' && <RiskDashboard />}
                {activeTab === 'regulations' && <RegulationsList />}
                {activeTab === 'assessments' && <AssessmentFlow />}
                {activeTab === 'issues' && <IssueTracker />}
                {activeTab === 'watchlists' && <WatchlistManager />}
            </div>
        </PageContainer>
    );
}
