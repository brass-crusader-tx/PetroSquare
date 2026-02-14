"use client";

import React, { useState } from 'react';
import { PageContainer, SectionHeader } from '@petrosquare/ui';
import { useData } from '../../../lib/hooks';
import { IntelItem, IntelItemType } from '@petrosquare/types';
import { IntelItemCard } from './components/IntelItemCard';
import Link from 'next/link';

export default function IntelFeedPage() {
  const [query, setQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<IntelItemType | 'ALL'>('ALL');

  const { data: items, loading, error } = useData<IntelItem[]>('/api/intel/feed');

  const filteredItems = items?.filter(item => {
    if (typeFilter !== 'ALL' && item.type !== typeFilter) return false;
    if (query) {
      const q = query.toLowerCase();
      return (
        item.title.toLowerCase().includes(q) ||
        item.content_text.toLowerCase().includes(q) ||
        item.tags.some(t => t.name.toLowerCase().includes(q)) ||
        item.entities.some(e => e.name.toLowerCase().includes(q))
      );
    }
    return true;
  });

  return (
    <main className="min-h-screen bg-background text-text">
      <PageContainer>
        <SectionHeader
          title="Intel Workspace"
          description="Manage market, competitive, and operational intelligence."
        />

        {/* Action Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
          <div className="flex gap-4 flex-wrap">
            <Link href="/modules/intel/workspace" className="bg-primary text-white px-4 py-2 rounded text-sm hover:bg-primary-hover transition-colors">
              + New Item
            </Link>
            <Link href="/modules/intel/review" className="bg-surface text-white px-4 py-2 rounded text-sm hover:bg-surface-highlight transition-colors border border-border">
              Review Queue
            </Link>
            <Link href="/modules/intel/signals" className="bg-surface text-white px-4 py-2 rounded text-sm hover:bg-surface-highlight transition-colors border border-border">
              Signals
            </Link>
            <Link href="/modules/intel/dashboard" className="bg-surface text-white px-4 py-2 rounded text-sm hover:bg-surface-highlight transition-colors border border-border">
              Legacy Dashboard
            </Link>
          </div>

          <div className="flex gap-2 w-full md:w-auto">
             <input
                type="text"
                placeholder="Search..."
                value={query}
                onChange={e => setQuery(e.target.value)}
                className="bg-surface/50 border border-border/50 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-primary/50 focus:bg-surface w-full md:w-64 placeholder:text-muted transition-colors"
             />
             <select
                value={typeFilter}
                onChange={e => setTypeFilter(e.target.value as any)}
                className="bg-surface/50 border border-border/50 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-primary/50 focus:bg-surface transition-colors"
             >
                <option value="ALL">All Types</option>
                <option value="NOTE">Note</option>
                <option value="LINK">Link</option>
                <option value="REPORT">Report</option>
             </select>
          </div>
        </div>

        {error && <div className="text-data-critical mb-4">Error loading feed: {error}</div>}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
             <div className="col-span-full text-center py-10 text-muted">Loading feed...</div>
          ) : filteredItems && filteredItems.length > 0 ? (
             filteredItems.map(item => (
                <IntelItemCard key={item.id} item={item} />
             ))
          ) : (
             <div className="col-span-full text-center py-10 text-muted">No items found. Create your first intel item!</div>
          )}
        </div>

      </PageContainer>
    </main>
  );
}
