"use client";

import React, { useState } from 'react';
import { PageContainer, SectionHeader, DataPanel, Badge, getStandardTabs } from '@petrosquare/ui';
import { useData } from '../../../../../lib/hooks';
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
  const [activeTab, setActiveTab] = useState('Overview');

  if (loading) return <PageContainer><div className="text-muted p-10">Loading asset data...</div></PageContainer>;
  if (error) return <PageContainer><div className="text-critical p-10">Error loading asset: {error.message}</div></PageContainer>;
  if (!data) return <PageContainer><div className="text-muted p-10">Asset not found.</div></PageContainer>;

  const { asset, production } = data.data;

  return (
    <PageContainer>
      <SectionHeader
        title={asset.name}
        description={`${asset.basin} Basin • ${asset.operator}`}
      >
        <div className="flex items-center space-x-2">
            <Badge variant="success">{asset.status}</Badge>
            <span className="text-xs text-muted font-mono">{asset.id}</span>
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
                oil={production.oil}
                gas={production.gas}
                water={production.water}
              />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <DataPanel title="Last Rate (Oil)" loading={false}>
                      <div className="text-2xl font-mono text-white">
                          {production.oil[production.oil.length - 1]?.value.toFixed(0) || '-'} <span className="text-sm text-muted">bbl/d</span>
                      </div>
                  </DataPanel>
                  <DataPanel title="Last Rate (Gas)" loading={false}>
                      <div className="text-2xl font-mono text-white">
                          {production.gas[production.gas.length - 1]?.value.toFixed(0) || '-'} <span className="text-sm text-muted">mcf/d</span>
                      </div>
                  </DataPanel>
                  <DataPanel title="Water Cut" loading={false}>
                      <div className="text-2xl font-mono text-white">
                          {(() => {
                              const o = production.oil[production.oil.length - 1]?.value || 0;
                              const w = production.water[production.water.length - 1]?.value || 0;
                              if (o+w === 0) return '-';
                              return ((w / (o+w)) * 100).toFixed(1);
                          })()} <span className="text-sm text-muted">%</span>
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
