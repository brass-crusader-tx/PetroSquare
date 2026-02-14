"use client";

import React, { useState } from 'react';
import { StandardPage, DataPanel, Badge } from '@petrosquare/ui';
import { useData } from '@/lib/hooks';
import { Anomaly } from '@petrosquare/types';
import { ProductionChart } from '../../components/ProductionChart';
import { DcaPanel } from '../../components/DcaPanel';
import { ScenarioManager } from '../../components/ScenarioManager';
import { MonteCarloPanel } from '../../components/MonteCarloPanel';
import { AnomalyList } from '../../components/AnomalyList';
import { InsightPanel } from '../../components/InsightPanel';
import { ReportingPanel } from '../../components/ReportingPanel';

// Modern Tab Component
function TabGroup({ tabs, active, onChange }: { tabs: string[], active: string, onChange: (t: string) => void }) {
    return (
        <div className="flex border-b border-border mb-6 overflow-x-auto no-scrollbar">
            {tabs.map(t => (
                <button
                    key={t}
                    onClick={() => onChange(t)}
                    className={`px-6 py-3 text-sm font-medium border-b-2 transition-all whitespace-nowrap ${
                        active === t
                        ? 'border-primary text-white bg-surface-highlight/5'
                        : 'border-transparent text-muted hover:text-white hover:bg-surface-highlight/5'
                    }`}
                >
                    {t}
                </button>
            ))}
        </div>
    );
}

export default function AssetPage({ params }: { params: { id: string } }) {
  const assetId = params.id;
  const { data, loading, error } = useData<any>(`/api/production/assets/${assetId}`);
  const { data: anomaliesData } = useData<Anomaly[]>(`/api/production/anomalies?asset_id=${assetId}`);
  const anomalies = anomaliesData || [];
  const [activeTab, setActiveTab] = useState('Overview');

  if (loading) return (
    <StandardPage loading={true}>
      <div className="h-96 flex items-center justify-center">
         <span className="animate-pulse text-muted">Loading asset context...</span>
      </div>
    </StandardPage>
  );

  if (error) return (
    <StandardPage>
      <div className="p-10 text-center border border-border rounded bg-surface-highlight/5">
        <div className="text-data-critical font-bold mb-2">Error Loading Asset</div>
        <div className="text-sm text-muted">{typeof error === 'string' ? error : JSON.stringify(error)}</div>
      </div>
    </StandardPage>
  );

  if (!data) return (
    <StandardPage>
       <div className="p-10 text-center text-muted">Asset not found.</div>
    </StandardPage>
  );

  const { asset, production } = data;

  // Helper to safely get the last value
  const getLastVal = (arr: any[]) => {
      if (!arr || arr.length === 0) return 0;
      return arr[arr.length - 1].value;
  };

  const oilRate = getLastVal(production?.oil);
  const gasRate = getLastVal(production?.gas);
  const waterRate = getLastVal(production?.water);
  const waterCut = (oilRate + waterRate) > 0 ? (waterRate / (oilRate + waterRate)) * 100 : 0;

  return (
    <StandardPage
      header={{
        title: asset?.name || 'Unknown Asset',
        subtitle: `${asset?.basin || 'Unknown'} Basin`,
        status: asset?.status?.toLowerCase() === 'active' ? 'active' : 'inactive',
        operator: asset?.operator,
        tags: [asset?.id, asset?.type || 'Well'],
        lastUpdated: new Date().toLocaleTimeString(), // Mocked for now, implies live feed
        actions: (
            <div className="flex items-center gap-2">
                 <button className="px-3 py-1.5 text-xs font-bold text-white bg-primary rounded shadow-sm hover:bg-primary/90 transition-colors">
                    Edit Asset
                 </button>
            </div>
        )
      }}
      aiContext={`${asset?.name} (${asset?.basin})`}
    >
      <TabGroup
        tabs={['Overview', 'Analytics', 'Anomalies', 'Insights', 'Reporting']}
        active={activeTab}
        onChange={setActiveTab}
      />

      <div className="animate-fade-in">
          {activeTab === 'Overview' && (
              <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <DataPanel title="Last Rate (Oil)" loading={false}>
                          <div className="flex items-baseline gap-2">
                              <div className="text-3xl font-mono text-white tracking-tighter">
                                  {oilRate.toFixed(0)}
                              </div>
                              <span className="text-xs text-muted uppercase font-bold">bbl/d</span>
                          </div>
                      </DataPanel>
                      <DataPanel title="Last Rate (Gas)" loading={false}>
                          <div className="flex items-baseline gap-2">
                              <div className="text-3xl font-mono text-white tracking-tighter">
                                  {gasRate.toFixed(0)}
                              </div>
                              <span className="text-xs text-muted uppercase font-bold">mcf/d</span>
                          </div>
                      </DataPanel>
                      <DataPanel title="Water Cut" loading={false}>
                          <div className="flex items-baseline gap-2">
                              <div className="text-3xl font-mono text-white tracking-tighter">
                                  {waterCut.toFixed(1)}
                              </div>
                              <span className="text-xs text-muted uppercase font-bold">%</span>
                          </div>
                      </DataPanel>
                  </div>

                  <ProductionChart
                    oil={production?.oil || []}
                    gas={production?.gas || []}
                    water={production?.water || []}
                    anomalies={anomalies}
                  />
              </div>
          )}

          {activeTab === 'Analytics' && (
              <div className="space-y-6">
                  <DcaPanel assetId={assetId} />
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <ScenarioManager assetId={assetId} />
                      <MonteCarloPanel assetId={assetId} />
                  </div>
              </div>
          )}

          {activeTab === 'Anomalies' && (
              <AnomalyList assetId={assetId} />
          )}

          {activeTab === 'Insights' && (
              <InsightPanel assetId={assetId} />
          )}

          {activeTab === 'Reporting' && (
              <ReportingPanel assetId={assetId} />
          )}
      </div>
    </StandardPage>
  );
}
