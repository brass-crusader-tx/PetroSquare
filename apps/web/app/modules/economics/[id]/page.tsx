"use client";

import React, { useState, useEffect } from 'react';
import { PageContainer, SectionHeader, getStandardTabs, DataPanel, Badge } from '@petrosquare/ui';
import { useData } from '@/lib/hooks';
import { EconomicsScenario, EconomicsScenarioVersion, EconomicsRun, EconomicsScenarioInput } from '@petrosquare/types';
import { useRouter } from 'next/navigation';
import { ScenarioInputs } from '../components/ScenarioInputs';
import { RunResults } from '../components/RunResults';
import { CashflowTable } from '../components/CashflowTable';
import { ScenarioCompare } from '../components/ScenarioCompare';
import { Play, Save, Download, RotateCcw } from 'lucide-react';

export default function ScenarioDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { data: scenario, loading: loadingScenario } = useData<EconomicsScenario>(`/api/economics/scenarios/${params.id}`);
  const { data: versions, mutate: mutateVersions } = useData<EconomicsScenarioVersion[]>(`/api/economics/scenarios/${params.id}/versions`);

  const [selectedVersionId, setSelectedVersionId] = useState<string | null>(null);
  const [input, setInput] = useState<EconomicsScenarioInput | null>(null);
  const [activeTab, setActiveTab] = useState('inputs');
  const [running, setRunning] = useState(false);
  const [runResult, setRunResult] = useState<EconomicsRun | null>(null);

  // Load initial version
  useEffect(() => {
    if (versions && versions.length > 0 && !selectedVersionId) {
      const latest = versions[0];
      setSelectedVersionId(latest.id);
      setInput(latest.input_payload_json);
      fetchRun(latest.id);
    }
  }, [versions]);

  // Load input when version changes
  useEffect(() => {
    if (versions && selectedVersionId) {
      const v = versions.find(v => v.id === selectedVersionId);
      if (v) setInput(v.input_payload_json);
      fetchRun(selectedVersionId);
    }
  }, [selectedVersionId, versions]);

  const fetchRun = async (versionId: string) => {
    const res = await fetch(`/api/economics/versions/${versionId}/run`);
    if (res.ok) {
        const runs: EconomicsRun[] = await res.json();
        const completed = runs.find(r => r.status === 'COMPLETED');
        setRunResult(completed || null);
    }
  };

  const handleRun = async () => {
    if (!selectedVersionId) return;
    setRunning(true);
    try {
        const res = await fetch(`/api/economics/versions/${selectedVersionId}/run`, { method: 'POST' });
        if (res.ok) {
            const run = await res.json();
            // Poll
            let attempts = 0;
            while (attempts < 20) {
                await new Promise(r => setTimeout(r, 500));
                const statusRes = await fetch(`/api/economics/runs/${run.id}`);
                const status = await statusRes.json();
                if (status.status === 'COMPLETED' || status.status === 'FAILED') {
                    setRunResult(status);
                    setActiveTab('results');
                    break;
                }
                attempts++;
            }
        }
    } catch (e) {
        console.error(e);
        alert('Run failed');
    } finally {
        setRunning(false);
    }
  };

  const handleSaveVersion = async () => {
    const name = prompt('Version Name:');
    if (!name || !input) return;

    try {
        const res = await fetch(`/api/economics/scenarios/${params.id}/versions`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, input })
        });
        if (res.ok) {
            mutateVersions();
            alert('Version saved');
        }
    } catch (e) {
        console.error(e);
    }
  };

  if (loadingScenario || !scenario) return <PageContainer>Loading...</PageContainer>;

  return (
    <PageContainer>
      <SectionHeader
        title={scenario.name}
        description={scenario.description}
        breadcrumbs={[
            { label: 'Economics', href: '/modules/economics' },
            { label: scenario.name, href: `/modules/economics/${scenario.id}` }
        ]}
      >
        <div className="flex gap-2">
            <select
                value={selectedVersionId || ''}
                onChange={e => setSelectedVersionId(e.target.value)}
                className="bg-surface-highlight/20 border border-border rounded px-3 py-2 text-white text-sm"
            >
                {versions?.map(v => (
                    <option key={v.id} value={v.id}>{v.name} (v{v.version})</option>
                ))}
            </select>
            <button onClick={handleSaveVersion} className="px-3 py-2 bg-surface-highlight hover:bg-surface-highlight/80 text-white rounded flex items-center gap-2">
                <Save size={16} /> Save Version
            </button>
            <button onClick={handleRun} disabled={running} className="px-3 py-2 bg-primary hover:bg-primary/90 text-white rounded flex items-center gap-2 disabled:opacity-50">
                {running ? <RotateCcw className="animate-spin" size={16} /> : <Play size={16} />}
                Run Model
            </button>
        </div>
      </SectionHeader>

      <div className="flex border-b border-border mb-6">
        {['Inputs', 'Results', 'Cashflows', 'Compare'].map(tab => (
            <button
                key={tab}
                onClick={() => setActiveTab(tab.toLowerCase())}
                className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${activeTab === tab.toLowerCase() ? 'border-primary text-primary' : 'border-transparent text-muted hover:text-white'}`}
            >
                {tab}
            </button>
        ))}
      </div>

      {activeTab === 'inputs' && input && (
        <ScenarioInputs input={input} onChange={setInput} />
      )}

      {activeTab === 'results' && (
          runResult?.result_payload_json ? (
            <RunResults result={runResult.result_payload_json} />
          ) : (
            <div className="text-center py-12 text-muted">No results found. Run the model to generate results.</div>
          )
      )}

      {activeTab === 'cashflows' && (
          runResult?.result_payload_json ? (
            <CashflowTable result={runResult.result_payload_json} />
          ) : (
            <div className="text-center py-12 text-muted">No results found. Run the model to generate results.</div>
          )
      )}

      {activeTab === 'compare' && selectedVersionId && (
        <ScenarioCompare scenarioId={params.id} currentVersionId={selectedVersionId} />
      )}

    </PageContainer>
  );
}
