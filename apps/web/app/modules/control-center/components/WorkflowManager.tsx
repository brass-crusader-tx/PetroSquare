"use client";

import { useState } from 'react';
import { DetailDrawer, Button } from '@petrosquare/ui';
import { Alert, Workflow } from '@petrosquare/types';

interface WorkflowManagerProps {
  isOpen: boolean;
  onClose: () => void;
  contextAlert: Alert | null;
  onCommit: () => void;
}

export function WorkflowManager({ isOpen, onClose, contextAlert, onCommit }: WorkflowManagerProps) {
  const [step, setStep] = useState<'DRAFT' | 'SIMULATING' | 'REVIEW' | 'COMMITTED'>('DRAFT');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [workflow, setWorkflow] = useState<Workflow | null>(null);
  const [loading, setLoading] = useState(false);

  const reset = () => {
    setStep('DRAFT');
    setTitle(contextAlert ? `Fix: ${contextAlert.title}` : '');
    setDescription(contextAlert ? `Address alert ${contextAlert.id}` : '');
    setWorkflow(null);
    setLoading(false);
  };

  // Reset on open
  const [lastOpenAlert, setLastOpenAlert] = useState<string | null>(null);

  if (isOpen && contextAlert && contextAlert.id !== lastOpenAlert) {
    setLastOpenAlert(contextAlert.id);
    setTitle(`Fix: ${contextAlert.title}`);
    setDescription(`Address alert ${contextAlert.id}`);
    setStep('DRAFT');
    setWorkflow(null);
  }

  const handleSimulate = async () => {
    setLoading(true);
    try {
      // 1. Create Draft
      const draftRes = await fetch('/api/control-center/workflows/drafts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          description,
          sourceAlertId: contextAlert?.id,
          sourceAssetId: contextAlert?.assetId
        })
      });
      const draft = await draftRes.json();

      // 2. Simulate
      const simRes = await fetch(`/api/control-center/workflows/${draft.id}/simulate`, {
        method: 'POST'
      });
      const simulated = await simRes.json();

      setWorkflow(simulated);
      setStep('REVIEW');
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleCommit = async () => {
    if (!workflow) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/control-center/workflows/${workflow.id}/commit`, {
        method: 'POST'
      });
      const committed = await res.json();
      setWorkflow(committed);
      setStep('COMMITTED');
      onCommit();
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const renderContent = () => {
    if (step === 'DRAFT') {
      return (
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300">Workflow Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white focus:ring-2 focus:ring-emerald-500 outline-none"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white focus:ring-2 focus:ring-emerald-500 outline-none"
            />
          </div>
          <div className="bg-slate-900 border border-slate-800 rounded p-4 text-xs text-slate-400">
            This workflow will be linked to Alert: <span className="text-emerald-400 font-mono">{contextAlert?.id}</span>
          </div>
          <div className="flex justify-end">
             <Button variant="primary" onClick={handleSimulate} disabled={loading || !title}>
               {loading ? 'Simulating...' : 'Simulate Workflow'}
             </Button>
          </div>
        </div>
      );
    }

    if (step === 'REVIEW' && workflow) {
      return (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded p-4">
            <h3 className="text-sm font-semibold text-white mb-4">Impact Analysis</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-xs text-slate-500 uppercase">Risk Score Change</div>
                <div className="text-lg font-mono text-emerald-400 font-bold">
                  {workflow.simulatedImpact?.riskScoreChange} pts
                </div>
              </div>
              <div>
                <div className="text-xs text-slate-500 uppercase">Est. Cost</div>
                <div className="text-lg font-mono text-white font-bold">
                  ${workflow.simulatedImpact?.costEstimate}
                </div>
              </div>
              <div className="col-span-2">
                <div className="text-xs text-slate-500 uppercase">Timeline</div>
                <div className="text-sm text-slate-300">
                  {workflow.simulatedImpact?.timeline}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-amber-900/10 border border-amber-900/30 rounded p-4 text-xs text-amber-400">
            <strong>Note:</strong> Committing this workflow will generate an immutable audit log entry and update the asset state.
          </div>

          <div className="flex justify-end space-x-3">
             <Button variant="secondary" onClick={() => setStep('DRAFT')}>Back</Button>
             <Button variant="primary" onClick={handleCommit} disabled={loading}>
               {loading ? 'Committing...' : 'Commit Workflow'}
             </Button>
          </div>
        </div>
      );
    }

    if (step === 'COMMITTED') {
      return (
        <div className="flex flex-col items-center justify-center space-y-4 py-12">
          <div className="w-16 h-16 bg-emerald-900/30 rounded-full flex items-center justify-center border border-emerald-500 text-emerald-500">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
          </div>
          <h3 className="text-xl font-bold text-white">Workflow Committed</h3>
          <p className="text-slate-400 text-center max-w-xs">
            Workflow <span className="font-mono text-emerald-400">{workflow?.id}</span> has been activated and logged.
          </p>
          <Button variant="secondary" onClick={() => { reset(); onClose(); }}>Close</Button>
        </div>
      );
    }

    return null;
  };

  if (!isOpen) return null;

  return (
    <DetailDrawer
      isOpen={isOpen}
      onClose={() => { reset(); onClose(); }}
      title={step === 'DRAFT' ? 'New Workflow' : step === 'REVIEW' ? 'Review Workflow' : 'Workflow Status'}
      subtitle={contextAlert ? `Context: ${contextAlert.title}` : undefined}
      source="Control Center"
      timestamp={new Date().toISOString()}
    >
      <div className="p-1">
        {renderContent()}
      </div>
    </DetailDrawer>
  );
}
