"use client";

import React, { useState } from 'react';
import { PageContainer, SectionHeader } from '@petrosquare/ui';
import { useData } from '../../../../lib/hooks';
import { IntelItem } from '@petrosquare/types';
import { IntelItemCard } from '../components/IntelItemCard';
import { useRouter } from 'next/navigation';

export default function IntelReviewPage() {
  const router = useRouter();
  const { data: items, loading, error } = useData<IntelItem[]>('/api/intel/items?status=IN_REVIEW');
  const [processing, setProcessing] = useState<string | null>(null);
  const [comment, setComment] = useState('');

  const handleAction = async (id: string, action: 'approve' | 'reject') => {
    setProcessing(id);
    try {
      const res = await fetch(`/api/intel/items/${id}/${action}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ comments: comment })
      });
      if (res.ok) {
        // Refresh items or just reload
        window.location.reload();
      } else {
        alert('Action failed');
      }
    } catch (e) {
      alert('Error');
    } finally {
      setProcessing(null);
    }
  };

  return (
    <main className="min-h-screen bg-background text-text">
      <PageContainer>
        <SectionHeader title="Review Queue" description="Approve or reject pending intelligence items." />

        {error && <div className="text-data-critical mb-4">Error loading review queue: {error}</div>}

        <div className="space-y-6 mt-6">
          {loading ? (
             <div className="text-center py-10 text-muted">Loading queue...</div>
          ) : items && items.length > 0 ? (
             items.map(item => (
                <div key={item.id} className="grid grid-cols-1 lg:grid-cols-3 gap-6 bg-surface p-4 rounded border border-border">
                    <div className="lg:col-span-2">
                         <IntelItemCard item={item} />
                    </div>
                    <div className="flex flex-col gap-4 justify-center">
                        <textarea
                            placeholder="Review comments..."
                            className="bg-surface-highlight/10 border border-border rounded p-2 text-sm text-white focus:outline-none focus:border-primary h-24"
                            value={comment}
                            onChange={e => setComment(e.target.value)}
                        />
                        <div className="flex gap-2">
                             <button
                                onClick={() => handleAction(item.id, 'approve')}
                                disabled={!!processing}
                                className="flex-1 bg-data-positive/20 text-data-positive border border-data-positive/50 py-2 rounded hover:bg-data-positive/30 transition-colors"
                             >
                                {processing === item.id ? '...' : 'Approve'}
                             </button>
                             <button
                                onClick={() => handleAction(item.id, 'reject')}
                                disabled={!!processing}
                                className="flex-1 bg-data-critical/20 text-data-critical border border-data-critical/50 py-2 rounded hover:bg-data-critical/30 transition-colors"
                             >
                                {processing === item.id ? '...' : 'Reject'}
                             </button>
                        </div>
                    </div>
                </div>
             ))
          ) : (
             <div className="text-center py-10 text-muted">No items pending review.</div>
          )}
        </div>
      </PageContainer>
    </main>
  );
}
