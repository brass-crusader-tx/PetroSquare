"use client";

import React, { useState } from 'react';
import { PageContainer, SectionHeader, DataPanel, Badge } from '@petrosquare/ui';
import { useData } from '@/lib/hooks';
import { EconomicsScenario } from '@petrosquare/types';
import Link from 'next/link';
import { Plus, Search } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function EconomicsPage() {
  const { data: scenarios, loading, mutate } = useData<EconomicsScenario[]>('/api/economics/scenarios');
  const [search, setSearch] = useState('');
  const router = useRouter();

  const handleCreate = async () => {
    const name = prompt('Scenario Name:');
    if (!name) return;

    try {
      const res = await fetch('/api/economics/scenarios', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, description: 'New scenario' })
      });
      if (res.ok) {
        mutate();
        const created = await res.json();
        router.push(`/modules/economics/${created.id}`);
      }
    } catch (e) {
      console.error(e);
      alert('Failed to create scenario');
    }
  };

  const filtered = scenarios?.filter(s => s.name.toLowerCase().includes(search.toLowerCase())) || [];

  return (
    <PageContainer>
      <SectionHeader
        title="Economics & Valuation"
        description="Deterministic economic modeling, scenario planning, and version control."
      >
        <button
          onClick={handleCreate}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded hover:bg-primary/90 transition-colors"
        >
          <Plus size={16} />
          New Scenario
        </button>
      </SectionHeader>

      <div className="mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" size={16} />
          <input
            type="text"
            placeholder="Search scenarios..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-surface-highlight/10 border border-border rounded focus:border-primary focus:outline-none text-white"
          />
        </div>
      </div>

      <DataPanel title="Scenario Library" loading={loading}>
        {filtered.length === 0 && !loading ? (
          <div className="text-center py-12 text-muted">
            No scenarios found. Create one to get started.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map(scenario => (
              <Link key={scenario.id} href={`/modules/economics/${scenario.id}`} className="block group">
                <div className="h-full p-4 bg-surface-highlight/5 border border-border rounded hover:border-primary/50 transition-all">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-white group-hover:text-primary transition-colors">{scenario.name}</h3>
                    <Badge status={scenario.status === 'LOCKED' ? 'neutral' : 'live'}>{scenario.status}</Badge>
                  </div>
                  <p className="text-sm text-muted line-clamp-2 mb-4">{scenario.description || 'No description'}</p>
                  <div className="flex justify-between items-center text-xs text-muted font-mono">
                    <span>{new Date(scenario.updated_at).toLocaleDateString()}</span>
                    <span>{scenario.created_by}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </DataPanel>
    </PageContainer>
  );
}
