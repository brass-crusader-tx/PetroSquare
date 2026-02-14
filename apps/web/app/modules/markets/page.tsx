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
                <div className="flex items-center gap-2 bg-slate-800 p-1 rounded-lg border border-slate-700 mt-4 md:mt-0">
                    {(['TRADER', 'RISK', 'EXECUTIVE'] as Role[]).map(r => (
                        <button
                            key={r}
                            onClick={() => setRole(r)}
                            className={`px-3 py-1.5 text-xs font-medium rounded transition-colors ${
                                role === r
                                ? 'bg-emerald-600 text-white shadow-sm'
                                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/50'
                            }`}
                        >
                            {r} VIEW
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
