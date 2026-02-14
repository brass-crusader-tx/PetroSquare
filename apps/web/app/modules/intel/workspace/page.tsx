"use client";

import React, { useState, useEffect } from 'react';
import { PageContainer, SectionHeader } from '@petrosquare/ui';
// @ts-ignore
import { useData } from '../../../../lib/hooks';
import { IntelItem, IntelItemType, IntelTag, IntelEntity } from '@petrosquare/types';
import { useRouter } from 'next/navigation';

export default function IntelWorkspacePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<Partial<IntelItem>>({
    type: 'NOTE',
    title: '',
    content_text: '',
    source_url: '',
    source_name: '',
    tags: [],
    entities: []
  });

  const [availableTags, setAvailableTags] = useState<IntelTag[]>([]);
  const [availableEntities, setAvailableEntities] = useState<IntelEntity[]>([]);

  useEffect(() => {
    fetch('/api/intel/tags').then(res => res.json()).then(json => setAvailableTags(json.data || []));
    fetch('/api/intel/entities').then(res => res.json()).then(json => setAvailableEntities(json.data || []));
  }, []);

  const handleSave = async (submit = false) => {
    setLoading(true);
    try {
      const res = await fetch('/api/intel/items', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const json = await res.json();

      if (json.status === 'ok') {
        if (submit) {
           await fetch(`/api/intel/items/${json.data.id}/submit`, { method: 'POST' });
        }
        router.push('/modules/intel');
      } else {
        alert('Error saving item: ' + json.error?.message);
      }
    } catch (e: any) {
      alert('Error: ' + e.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleTag = (tag: IntelTag) => {
    const current = formData.tags || [];
    const exists = current.find(t => t.id === tag.id);
    if (exists) {
      setFormData({ ...formData, tags: current.filter(t => t.id !== tag.id) });
    } else {
      setFormData({ ...formData, tags: [...current, tag] });
    }
  };

  const toggleEntity = (entity: IntelEntity) => {
    const current = formData.entities || [];
    const exists = current.find(e => e.id === entity.id);
    if (exists) {
      setFormData({ ...formData, entities: current.filter(e => e.id !== entity.id) });
    } else {
      setFormData({ ...formData, entities: [...current, entity] });
    }
  };

  return (
    <main className="min-h-screen bg-background text-text">
      <PageContainer>
        <SectionHeader title="Create Intel Item" description="Draft a new intelligence brief, note, or link." />

        <div className="max-w-3xl mx-auto mt-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label className="text-sm text-muted">Type</label>
                    <select
                        className="w-full bg-surface border border-border rounded px-3 py-2 text-white focus:outline-none focus:border-primary"
                        value={formData.type}
                        onChange={e => setFormData({...formData, type: e.target.value as IntelItemType})}
                    >
                        <option value="NOTE">Note</option>
                        <option value="LINK">Link</option>
                        <option value="REPORT">Report</option>
                    </select>
                </div>
                <div className="space-y-2">
                    <label className="text-sm text-muted">Title</label>
                    <input
                        type="text"
                        className="w-full bg-surface border border-border rounded px-3 py-2 text-white focus:outline-none focus:border-primary"
                        value={formData.title}
                        onChange={e => setFormData({...formData, title: e.target.value})}
                        placeholder="e.g. Q3 Earnings Analysis"
                    />
                </div>
            </div>

            <div className="space-y-2">
                <label className="text-sm text-muted">Content</label>
                <textarea
                    className="w-full h-40 bg-surface border border-border rounded px-3 py-2 text-white focus:outline-none focus:border-primary font-mono text-sm"
                    value={formData.content_text}
                    onChange={e => setFormData({...formData, content_text: e.target.value})}
                    placeholder="Enter observations..."
                />
            </div>

            {formData.type === 'LINK' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-sm text-muted">Source URL</label>
                        <input
                            type="text"
                            className="w-full bg-surface border border-border rounded px-3 py-2 text-white focus:outline-none focus:border-primary"
                            value={formData.source_url || ''}
                            onChange={e => setFormData({...formData, source_url: e.target.value})}
                            placeholder="https://..."
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm text-muted">Source Name</label>
                        <input
                            type="text"
                            className="w-full bg-surface border border-border rounded px-3 py-2 text-white focus:outline-none focus:border-primary"
                            value={formData.source_name || ''}
                            onChange={e => setFormData({...formData, source_name: e.target.value})}
                            placeholder="e.g. Reuters"
                        />
                    </div>
                </div>
            )}

            {/* Tags */}
            <div className="space-y-2">
                <label className="text-sm text-muted">Tags</label>
                <div className="flex flex-wrap gap-2 p-3 bg-surface border border-border rounded min-h-[50px]">
                    {availableTags.map(tag => {
                        const isSelected = formData.tags?.some(t => t.id === tag.id);
                        return (
                            <button
                                key={tag.id}
                                onClick={() => toggleTag(tag)}
                                className={`px-2 py-1 rounded text-xs border transition-colors ${isSelected ? 'bg-primary border-primary text-white' : 'bg-transparent border-border text-muted hover:border-primary'}`}
                            >
                                {tag.name}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Entities */}
            <div className="space-y-2">
                <label className="text-sm text-muted">Related Entities</label>
                <div className="flex flex-wrap gap-2 p-3 bg-surface border border-border rounded min-h-[50px]">
                    {availableEntities.map(ent => {
                        const isSelected = formData.entities?.some(e => e.id === ent.id);
                        return (
                            <button
                                key={ent.id}
                                onClick={() => toggleEntity(ent)}
                                className={`px-2 py-1 rounded text-xs border transition-colors ${isSelected ? 'bg-surface-highlight border-white text-white' : 'bg-transparent border-border text-muted hover:border-white'}`}
                            >
                                {ent.name} ({ent.type})
                            </button>
                        );
                    })}
                </div>
            </div>

            <div className="flex gap-4 pt-6">
                <button
                    onClick={() => handleSave(false)}
                    disabled={loading}
                    className="flex-1 py-2 rounded border border-border text-white hover:bg-surface-highlight transition-colors"
                >
                    Save as Draft
                </button>
                <button
                    onClick={() => handleSave(true)}
                    disabled={loading}
                    className="flex-1 py-2 rounded bg-primary text-white hover:bg-primary-hover transition-colors"
                >
                    {loading ? 'Submitting...' : 'Submit for Review'}
                </button>
            </div>
        </div>
      </PageContainer>
    </main>
  );
}
