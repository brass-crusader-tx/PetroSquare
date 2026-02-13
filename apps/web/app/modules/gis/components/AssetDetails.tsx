"use client";

import { useState } from 'react';
import { GISAsset } from '@petrosquare/types';
import { DataPanel, Badge, Button, StatusPill } from '@petrosquare/ui';

interface AssetDetailsProps {
  asset: GISAsset;
  onClose: () => void;
}

type Tab = 'Overview' | 'Trends' | 'Drivers' | 'Risks' | 'Raw Data';
const TABS: Tab[] = ['Overview', 'Trends', 'Drivers', 'Risks', 'Raw Data'];

export default function AssetDetails({ asset, onClose }: AssetDetailsProps) {
  const [activeTab, setActiveTab] = useState<Tab>('Overview');

  const renderContent = () => {
    switch (activeTab) {
      case 'Overview':
        return (
          <div className="space-y-6">
            <p className="text-sm text-muted">Operational snapshot for {asset.name}.</p>
             <div className="flex items-center space-x-2">
                <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${asset.status === 'ACTIVE' ? 'bg-emerald-900 text-emerald-300' : 'bg-slate-700 text-slate-300'}`}>
                    {asset.status}
                </span>
                <span className="text-xs text-muted">{asset.type}</span>
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div className="bg-surface-highlight p-3 rounded border border-border">
                    <div className="text-[10px] uppercase text-muted mb-1">Current Rate</div>
                    <div className="text-lg font-mono text-white leading-none">{asset.current_production?.toLocaleString() || '-'}</div>
                    <div className="text-[10px] text-muted mt-1">bbl/d</div>
                </div>
                 <div className="bg-surface-highlight p-3 rounded border border-border">
                    <div className="text-[10px] uppercase text-muted mb-1">Breakeven</div>
                    <div className="text-lg font-mono text-white leading-none">${asset.breakeven_price || '-'}</div>
                    <div className="text-[10px] text-muted mt-1">USD/bbl</div>
                </div>
            </div>
            <div className="pt-4">
                 <Button variant="secondary" className="w-full text-xs" onClick={() => {}}>View Full Report</Button>
            </div>
          </div>
        );
      case 'Trends':
        return (
           <div className="space-y-4">
              <p className="text-sm text-muted">Production forecast and decline curve analysis.</p>
              {/* Production Chart */}
                <div className="border border-border rounded bg-surface-highlight p-3">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-[10px] uppercase text-muted font-bold">Production Profile</span>
                        <span className="text-[10px] text-data-positive font-mono">Forecast</span>
                    </div>
                    {/* SVG Chart */}
                    <div className="h-24 w-full relative">
                        <svg viewBox="0 0 100 40" className="w-full h-full overflow-visible">
                            <line x1="0" y1="0" x2="100" y2="0" stroke="#334155" strokeWidth="0.5" />
                            <line x1="0" y1="40" x2="100" y2="40" stroke="#334155" strokeWidth="0.5" />
                            <path d="M 0,10 Q 20,5 30,15 T 60,25 T 100,35" fill="none" stroke="#10B981" strokeWidth="2" />
                            <path d="M 0,10 Q 20,5 30,15 T 60,25 T 100,35 L 100,40 L 0,40 Z" fill="#10B981" fillOpacity="0.1" />
                            <circle cx="30" cy="15" r="2" fill="white" />
                        </svg>
                    </div>
                    <div className="flex justify-between text-[10px] text-muted mt-1">
                        <span>2020</span>
                        <span>2025</span>
                    </div>
                </div>
           </div>
        );
      case 'Drivers': // Infrastructure
         return (
             <div className="space-y-4">
                <p className="text-sm text-muted">Infrastructure and logistical factors.</p>
                 <DataPanel title="Infrastructure" className="p-3">
                    <div className="space-y-3 pt-2">
                        <div className="flex justify-between text-sm">
                            <span className="text-muted text-xs uppercase">Nearest Pipeline</span>
                            <span className="text-white font-mono">{asset.infra_distance_pipeline} km</span>
                        </div>
                         <div className="flex justify-between text-sm border-t border-border pt-2">
                            <span className="text-muted text-xs uppercase">Nearest Refinery</span>
                            <span className="text-white font-mono">{asset.infra_distance_refinery} km</span>
                        </div>
                    </div>
                </DataPanel>
             </div>
         );
      case 'Risks':
         return (
             <div className="space-y-4">
                 <p className="text-sm text-muted">Risk assessment and compliance status.</p>
                 <DataPanel title="Risk & Compliance" className="p-3">
                    <div className="space-y-3 pt-2">
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-muted text-xs uppercase">Regulatory Status</span>
                            <Badge status={asset.regulatory_status === 'COMPLIANT' ? 'live' : 'declared'}>
                                {asset.regulatory_status}
                            </Badge>
                        </div>
                        <div className="flex justify-between items-center text-sm border-t border-border pt-2">
                            <span className="text-muted text-xs uppercase">Risk Score</span>
                            <span className={`font-mono ${asset.risk_score && asset.risk_score > 50 ? 'text-data-critical' : 'text-data-positive'}`}>{asset.risk_score}/100</span>
                        </div>
                        <div className="flex justify-between items-center text-sm border-t border-border pt-2">
                            <span className="text-muted text-xs uppercase">Carbon Intensity</span>
                            <span className="text-white font-mono">{asset.carbon_intensity} kg/bbl</span>
                        </div>
                    </div>
                </DataPanel>
             </div>
         );
      case 'Raw Data':
         return (
             <div className="space-y-2">
                 <p className="text-sm text-muted mb-4">Complete raw data payload.</p>
                 <pre className="bg-surface-inset p-4 rounded text-xs font-mono text-muted overflow-auto max-h-96 border border-border">
                      {JSON.stringify(asset, null, 2)}
                  </pre>
             </div>
         );
    }
  };

  return (
    <div className="bg-surface border-l border-border flex flex-col w-96 shadow-xl z-20 absolute right-0 top-0 bottom-0 pointer-events-auto h-full">
      <div className="p-4 border-b border-border flex items-center justify-between bg-surface shrink-0">
        <div>
          <h3 className="font-bold text-white text-lg">{asset.name}</h3>
          <span className="text-xs text-muted font-mono">{asset.id}</span>
        </div>
        <button onClick={onClose} className="text-muted hover:text-white p-2">✕</button>
      </div>

      <div className="flex border-b border-border mb-4 overflow-x-auto no-scrollbar bg-surface shrink-0">
        {TABS.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors whitespace-nowrap flex-shrink-0 ${
              activeTab === tab
                ? 'border-primary text-primary'
                : 'border-transparent text-muted hover:text-white'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="p-4 overflow-y-auto flex-1">
        {renderContent()}
      </div>
    </div>
  );
}
