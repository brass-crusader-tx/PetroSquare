"use client";

import React, { useState } from 'react';
import { PageContainer, SectionHeader } from '@petrosquare/ui';
import { TraderDashboard } from '../../../components/markets/TraderDashboard';
import { RiskDashboard } from '../../../components/markets/RiskDashboard';
import { ExecutiveDashboard } from '../../../components/markets/ExecutiveDashboard';

type Role = 'TRADER' | 'RISK' | 'EXECUTIVE';

export default function MarketsPage() {
    const [role, setRole] = useState<Role>('TRADER');

    return (
        <PageContainer>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
                <SectionHeader
                    title="Markets & Trading Analytics"
                    description="Real-time market data, risk analytics, and strategic insights. (Blueprint v2)"
                />
                <div className="flex items-center gap-1 bg-surface/50 p-1 rounded-xl border border-border/50 backdrop-blur mt-4 md:mt-0 shadow-sm">
                    {(['TRADER', 'RISK', 'EXECUTIVE'] as Role[]).map(r => (
                        <button
                            key={r}
                            onClick={() => setRole(r)}
                            className={`px-3 py-1.5 text-[10px] uppercase tracking-wider font-bold rounded-lg transition-all ${
                                role === r
                                ? 'bg-primary text-surface shadow-md shadow-primary/10'
                                : 'text-muted hover:text-white hover:bg-surface-highlight/50'
                            }`}
                        >
                            {r}
                        </button>
                    ))}
                </div>
            </div>

            <div className="mt-6">
                {role === 'TRADER' && <TraderDashboard />}
                {role === 'RISK' && <RiskDashboard />}
                {role === 'EXECUTIVE' && <ExecutiveDashboard />}
            </div>
        </PageContainer>
    );
}
