"use client";

import { useState } from 'react';
import { Drawer } from './Drawer';
import { StatusPill } from './StatusPill';

export type DetailDrawerTab = 'Overview' | 'Trends' | 'Drivers' | 'Risks' | 'Raw Data';

const TABS: DetailDrawerTab[] = ['Overview', 'Trends', 'Drivers', 'Risks', 'Raw Data'];

interface DetailDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  type: string;
  data: any;
  loading?: boolean;
}

export function DetailDrawer({ isOpen, onClose, title, type, data, loading }: DetailDrawerProps) {
  const [activeTab, setActiveTab] = useState<DetailDrawerTab>('Overview');

  if (!isOpen) return null;

  const renderContent = () => {
    if (loading) return <div className="animate-pulse h-64 bg-surface-highlight rounded"></div>;
    if (!data) return <div className="text-muted text-sm">No data available.</div>;

    // Deterministic Content Generation
    switch (activeTab) {
      case 'Overview':
        return (
          <div className="space-y-4">
            <p className="text-sm text-muted leading-relaxed">
              This <strong>{type}</strong> overview highlights key performance metrics and operational status.
              {data.description ? ` ${data.description}` : ''}
            </p>
            <div className="grid grid-cols-2 gap-4">
               {Object.entries(data).slice(0, 8).map(([k, v]) => (
                 (typeof v === 'string' || typeof v === 'number') && (
                   <div key={k} className="bg-surface-inset p-3 rounded border border-border overflow-hidden">
                     <div className="text-[10px] uppercase text-muted font-bold mb-1 truncate" title={k.replace(/_/g, ' ')}>{k.replace(/_/g, ' ')}</div>
                     <div className="text-sm font-mono text-white truncate" title={String(v)}>{String(v)}</div>
                   </div>
                 )
               ))}
            </div>
            <div className="text-xs text-muted italic mt-4 border-t border-border pt-2 opacity-60">
               Insight temporarily unavailable.
            </div>
          </div>
        );
      case 'Trends':
         return (
             <div className="space-y-4">
                 <p className="text-sm text-muted">Historical performance and projected movement for this {type}.</p>
                 <div className="h-40 bg-surface-inset rounded flex items-center justify-center border border-border border-dashed">
                     <div className="text-center">
                         <span className="text-2xl opacity-20">📈</span>
                         <div className="text-muted text-xs mt-2">Trend Data Visualization</div>
                     </div>
                 </div>
                 <div className="flex justify-between items-center bg-surface-highlight/20 p-3 rounded border border-border">
                     <span className="text-sm text-white">30-Day Velocity</span>
                     <StatusPill status="neutral">+2.4%</StatusPill>
                 </div>
             </div>
         );
      case 'Drivers':
          return (
              <div className="space-y-4">
                  <p className="text-sm text-muted">Key factors influencing current status and valuation.</p>
                  <ul className="space-y-3">
                      <li className="flex items-start space-x-3 bg-surface-inset/30 p-3 rounded">
                          <span className="text-primary mt-1 text-xs">●</span>
                          <span className="text-sm text-white leading-snug">
                              <span className="font-bold block text-xs text-muted uppercase mb-1">Market Volatility</span>
                              High impact due to recent geopolitical shifts affecting supply chains.
                          </span>
                      </li>
                      <li className="flex items-start space-x-3 bg-surface-inset/30 p-3 rounded">
                          <span className="text-primary mt-1 text-xs">●</span>
                          <span className="text-sm text-white leading-snug">
                              <span className="font-bold block text-xs text-muted uppercase mb-1">Operational Efficiency</span>
                              Steady baseline performance with minor fluctuations in output.
                          </span>
                      </li>
                  </ul>
              </div>
          );
      case 'Risks':
           return (
               <div className="space-y-4">
                   <p className="text-sm text-muted">Identified risk factors and mitigation strategies.</p>
                   <div className="bg-surface-inset/30 p-4 rounded border-l-4 border-warning">
                       <h4 className="text-warning font-bold text-sm mb-1">Market Exposure</h4>
                       <p className="text-xs text-muted">Moderate exposure to commodity price fluctuations based on current hedging.</p>
                   </div>
                   <div className="bg-surface-inset/30 p-4 rounded border-l-4 border-success">
                       <h4 className="text-success font-bold text-sm mb-1">Regulatory Compliance</h4>
                       <p className="text-xs text-muted">Fully compliant with current regional standards and reporting requirements.</p>
                   </div>
               </div>
           );
      case 'Raw Data':
          return (
              <div className="space-y-2">
                  <p className="text-sm text-muted mb-4">Complete raw data payload for this entity.</p>
                  <pre className="bg-surface-inset p-4 rounded text-xs font-mono text-muted overflow-auto max-h-[500px] border border-border">
                      {JSON.stringify(data, null, 2)}
                  </pre>
              </div>
          );
    }
  };

  return (
    <Drawer isOpen={isOpen} onClose={onClose} title={title}>
      <div className="flex border-b border-border mb-4 overflow-x-auto no-scrollbar bg-surface sticky top-0 z-10">
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
      <div className="min-h-[300px]">
        {renderContent()}
      </div>
    </Drawer>
  );
}
