"use client";

import React, { useState } from 'react';
import { PageContainer, SectionHeader } from '@petrosquare/ui';
import { useData } from '../../../../lib/hooks';
import { IntelSignal, IntelSignalEvent } from '@petrosquare/types';
import Link from 'next/link';

export default function IntelSignalsPage() {
  const { data, loading, error } = useData<{ signals: IntelSignal[]; events: IntelSignalEvent[] }>('/api/intel/signals?include_events=true');
  const [showForm, setShowForm] = useState(false);
  const [newSignal, setNewSignal] = useState({ name: '', field: 'tag', operator: 'equals', value: '' });

  const handleCreate = async () => {
    try {
        const rules = [{ field: newSignal.field, operator: newSignal.operator, value: newSignal.value }];
        // @ts-ignore
        const res = await fetch('/api/intel/signals', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: newSignal.name, rules })
        });
        if (res.ok) {
            window.location.reload();
        }
    } catch (e) {
        alert('Error');
    }
  };

  return (
    <main className="min-h-screen bg-background text-text">
      <PageContainer>
        <SectionHeader title="Intel Signals" description="Manage rule-based signals and view detected events." />

        {/* Create Signal Form */}
        <div className="mb-8">
            <button
                onClick={() => setShowForm(!showForm)}
                className="bg-primary text-white px-4 py-2 rounded text-sm hover:bg-primary-hover transition-colors mb-4"
            >
                {showForm ? 'Cancel' : '+ New Signal'}
            </button>

            {showForm && (
                <div className="bg-surface p-4 rounded border border-border space-y-4 max-w-2xl">
                    <h3 className="text-white font-bold">Define Signal Rules</h3>
                    <div className="space-y-2">
                        <label className="text-sm text-muted">Signal Name</label>
                        <input
                            type="text"
                            className="w-full bg-surface-highlight/10 border border-border rounded px-3 py-2 text-white"
                            value={newSignal.name}
                            onChange={e => setNewSignal({...newSignal, name: e.target.value})}
                        />
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm text-muted">Field</label>
                            <select
                                className="w-full bg-surface-highlight/10 border border-border rounded px-3 py-2 text-white"
                                value={newSignal.field}
                                onChange={e => setNewSignal({...newSignal, field: e.target.value})}
                            >
                                <option value="tag">Tag</option>
                                <option value="entity">Entity</option>
                                <option value="title">Title</option>
                                <option value="content">Content</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm text-muted">Operator</label>
                            <select
                                className="w-full bg-surface-highlight/10 border border-border rounded px-3 py-2 text-white"
                                value={newSignal.operator}
                                onChange={e => setNewSignal({...newSignal, operator: e.target.value})}
                            >
                                <option value="equals">Equals</option>
                                <option value="contains">Contains</option>
                                <option value="starts_with">Starts With</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm text-muted">Value</label>
                            <input
                                type="text"
                                className="w-full bg-surface-highlight/10 border border-border rounded px-3 py-2 text-white"
                                value={newSignal.value}
                                onChange={e => setNewSignal({...newSignal, value: e.target.value})}
                            />
                        </div>
                    </div>
                    <button
                        onClick={handleCreate}
                        className="bg-data-positive text-white px-4 py-2 rounded text-sm hover:bg-data-positive/80 transition-colors"
                    >
                        Create Signal
                    </button>
                </div>
            )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Signals List */}
            <div>
                <h3 className="text-lg font-bold text-white mb-4">Active Signals</h3>
                <div className="space-y-4">
                    {loading ? <div className="text-muted">Loading...</div> : data?.signals.map(signal => (
                        <div key={signal.id} className="bg-surface p-4 rounded border border-border">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-white font-bold">{signal.name}</span>
                                <span className={`text-xs px-2 py-0.5 rounded ${signal.is_enabled ? 'bg-data-positive/20 text-data-positive' : 'bg-muted/20 text-muted'}`}>
                                    {signal.is_enabled ? 'Active' : 'Disabled'}
                                </span>
                            </div>
                            <div className="space-y-1">
                                {signal.rules.map((rule, idx) => (
                                    <div key={idx} className="text-xs text-muted font-mono">
                                        {rule.field} {rule.operator} "{rule.value}"
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Signal Events */}
            <div>
                <h3 className="text-lg font-bold text-white mb-4">Recent Events</h3>
                <div className="space-y-4">
                     {loading ? <div className="text-muted">Loading...</div> : data?.events && data.events.length > 0 ? (
                        data.events.slice().reverse().map(evt => (
                            <div key={evt.id} className="bg-surface p-4 rounded border border-border border-l-4 border-l-data-warning">
                                <div className="flex justify-between items-start mb-1">
                                    <span className="text-xs text-data-warning font-mono">{evt.signal_name}</span>
                                    <span className="text-xs text-muted">{new Date(evt.created_at).toLocaleDateString()}</span>
                                </div>
                                <Link href={`/modules/intel/items/${evt.item_id}`} className="text-white hover:text-primary transition-colors font-medium text-sm block">
                                    {evt.item_title}
                                </Link>
                            </div>
                        ))
                     ) : (
                        <div className="text-muted text-sm">No signal events detected yet.</div>
                     )}
                </div>
            </div>
        </div>

      </PageContainer>
    </main>
  );
}
