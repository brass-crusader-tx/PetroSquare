"use client";

import React, { useState } from 'react';
import { PageContainer, SectionHeader, DataPanel, Badge, getStandardTabs } from '@petrosquare/ui';
import { useData } from '@/lib/hooks';
import { Anomaly } from '@petrosquare/types';
import { ProductionChart } from '../../components/ProductionChart';
import { DcaPanel } from '../../components/DcaPanel';
import { ScenarioManager } from '../../components/ScenarioManager';
import { MonteCarloPanel } from '../../components/MonteCarloPanel';
import { AnomalyList } from '../../components/AnomalyList';
import { InsightPanel } from '../../components/InsightPanel';
import { ReportingPanel } from '../../components/ReportingPanel';

// Simple tab component since existing UI lib might not expose one easily usable here
function Tabs({ tabs, active, onChange }: { tabs: string[], active: string, onChange: (t: string) => void }) {
    return (
        <div className="flex space-x-1 border-b border-border mb-6">
            {tabs.map(t => (
                <button
                    key={t}
                    onClick={() => onChange(t)}
                    className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                        active === t
                        ? 'border-primary text-white'
                        : 'border-transparent text-muted hover:text-white'
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
    <PageContainer>
      <div className="text-muted p-10">Loading asset data...</div>
    </PageContainer>
  );

  if (error) return (
    <PageContainer>
      <div className="text-critical p-10">Error loading asset: {typeof error === 'string' ? error : JSON.stringify(error)}</div>
    </PageContainer>
  );

  if (!data) return (
    <PageContainer>
      <div className="text-muted p-10">Asset not found.</div>
    </PageContainer>
  );

  // FIXED: data is already the payload, no need for data.data
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
    <PageContainer>
      <SectionHeader
        title={asset?.name || 'Unknown Asset'}
        description={`${asset?.basin || 'Unknown'} Basin • ${asset?.operator || 'Unknown'}`}
      >
        <div className="flex items-center space-x-2">
            <Badge status={asset?.status === 'ACTIVE' ? 'live' : 'offline'}>{asset?.status || 'Active'}</Badge>
            <span className="text-xs text-muted font-mono">{asset?.id}</span>
        </div>
      </SectionHeader>

      <Tabs
        tabs={['Overview', 'Analytics', 'Anomalies', 'Insights', 'Reporting']}
        active={activeTab}
        onChange={setActiveTab}
      />

      {activeTab === 'Overview' && (
          <div className="space-y-6">
              <ProductionChart
                oil={production?.oil || []}
                gas={production?.gas || []}
                water={production?.water || []}
                anomalies={anomalies}
              />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <DataPanel title="Last Rate (Oil)" loading={false}>
                      <div className="text-2xl font-mono text-white">
                          {oilRate.toFixed(0)} <span className="text-sm text-muted">bbl/d</span>
                      </div>
                  </DataPanel>
                  <DataPanel title="Last Rate (Gas)" loading={false}>
                      <div className="text-2xl font-mono text-white">
                          {gasRate.toFixed(0)} <span className="text-sm text-muted">mcf/d</span>
                      </div>
                  </DataPanel>
                  <DataPanel title="Water Cut" loading={false}>
                      <div className="text-2xl font-mono text-white">
                          {waterCut.toFixed(1)} <span className="text-sm text-muted">%</span>
                      </div>
                  </DataPanel>
              </div>
          </div>
      )}

      {activeTab === 'Analytics' && (
          <div className="space-y-6">
              <DcaPanel assetId={assetId} />
              <ScenarioManager assetId={assetId} />
              <MonteCarloPanel assetId={assetId} />
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

    </PageContainer>
  );
}
