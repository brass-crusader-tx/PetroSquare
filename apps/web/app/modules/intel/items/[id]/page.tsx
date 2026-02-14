"use client";

import React from 'react';
import { PageContainer, SectionHeader } from '@petrosquare/ui';
import { useData } from '../../../../../lib/hooks';
import { IntelItem } from '@petrosquare/types';
import { IntelStatusBadge } from '../../components/IntelStatusBadge';
import { TagList } from '../../components/TagList';
import Link from 'next/link';
import { useParams } from 'next/navigation';

export default function IntelItemDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const { data: item, loading, error } = useData<IntelItem>(`/api/intel/items/${id}`);

  if (loading) return <div className="text-center py-20 text-muted">Loading item...</div>;
  if (error || !item) return <div className="text-center py-20 text-data-critical">Error: {error || 'Item not found'}</div>;

  return (
    <main className="min-h-screen bg-background text-text">
      <PageContainer>
        <div className="mb-6">
            <Link href="/modules/intel" className="text-sm text-muted hover:text-white transition-colors">
                ← Back to Feed
            </Link>
        </div>

        <div className="bg-surface border border-border rounded-lg overflow-hidden">
            <div className="p-6 border-b border-border bg-surface-highlight/5">
                <div className="flex justify-between items-start mb-4">
                    <div className="space-y-2">
                        <div className="flex gap-2 items-center">
                             <span className="text-sm font-mono text-muted uppercase tracking-wider">{item.type}</span>
                             <IntelStatusBadge status={item.status} />
                        </div>
                        <h1 className="text-3xl font-bold text-white">{item.title}</h1>
                    </div>
                    <div className="text-right text-sm text-muted">
                        <div>Created: {new Date(item.created_at).toLocaleDateString()}</div>
                        {item.published_at && <div>Published: {new Date(item.published_at).toLocaleDateString()}</div>}
                    </div>
                </div>

                <div className="flex flex-wrap gap-4 items-center">
                    <TagList tags={item.tags} />
                    {item.entities.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                            {item.entities.map(e => (
                                <span key={e.id} className="text-xs text-white bg-surface-highlight px-2 py-1 rounded border border-border">
                                    @{e.name} ({e.type})
                                </span>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <div className="p-8">
                {item.source_url && (
                    <div className="mb-6 p-4 bg-surface-highlight/10 rounded border border-border flex justify-between items-center">
                        <div className="flex flex-col">
                            <span className="text-xs text-muted uppercase">Source</span>
                            <span className="font-medium text-white">{item.source_name || 'External Link'}</span>
                        </div>
                        <a href={item.source_url} target="_blank" rel="noreferrer" className="text-primary hover:underline text-sm truncate max-w-md">
                            {item.source_url} ↗
                        </a>
                    </div>
                )}

                <div className="prose prose-invert max-w-none">
                    <p className="whitespace-pre-wrap leading-relaxed text-lg text-gray-300">{item.content_text}</p>
                </div>
            </div>

            {/* Review History */}
            {item.reviews && item.reviews.length > 0 && (
                <div className="p-6 border-t border-border bg-surface-highlight/5">
                    <h3 className="text-lg font-bold text-white mb-4">Review History</h3>
                    <div className="space-y-4">
                        {item.reviews.map(rev => (
                            <div key={rev.id} className="flex gap-4 items-start">
                                <div className={`px-2 py-1 rounded text-xs font-bold ${rev.status === 'APPROVED' ? 'bg-data-positive/20 text-data-positive' : 'bg-data-critical/20 text-data-critical'}`}>
                                    {rev.status}
                                </div>
                                <div>
                                    <div className="text-sm text-white mb-1">{rev.comments || 'No comments'}</div>
                                    <div className="text-xs text-muted">{new Date(rev.created_at).toLocaleString()} by {rev.reviewer_id}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
      </PageContainer>
    </main>
  );
}
