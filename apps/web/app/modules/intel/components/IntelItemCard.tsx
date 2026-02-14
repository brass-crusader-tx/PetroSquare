import React from 'react';
import { IntelItem } from '@petrosquare/types';
import { IntelStatusBadge } from './IntelStatusBadge';
import { TagList } from './TagList';
import Link from 'next/link';

export function IntelItemCard({ item }: { item: IntelItem }) {
  return (
    <div className="p-4 rounded border border-border bg-surface hover:bg-surface-highlight/10 transition-colors">
      <div className="flex justify-between items-start mb-2">
        <div className="flex gap-2 items-center">
            <span className="text-xs font-mono text-muted">{item.type}</span>
            <IntelStatusBadge status={item.status} />
        </div>
        <span className="text-xs text-muted">{new Date(item.created_at).toLocaleDateString()}</span>
      </div>
      <Link href={`/modules/intel/items/${item.id}`} className="block group">
        <h3 className="text-lg font-bold text-white mb-2 group-hover:text-primary transition-colors">{item.title}</h3>
      </Link>
      <p className="text-sm text-muted mb-4 line-clamp-3">{item.content_text}</p>

      <div className="flex flex-wrap gap-2 items-center justify-between">
        <TagList tags={item.tags} />
        {item.entities.length > 0 && (
            <div className="flex gap-1 ml-auto flex-wrap justify-end">
                {item.entities.map(e => (
                    <span key={e.id} className="text-xs text-muted bg-surface-highlight px-1.5 py-0.5 rounded">@{e.name}</span>
                ))}
            </div>
        )}
      </div>
    </div>
  );
}
