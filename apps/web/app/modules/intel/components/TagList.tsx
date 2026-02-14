import React from 'react';
import { IntelTag } from '@petrosquare/types';

export function TagList({ tags }: { tags: IntelTag[] }) {
  if (!tags || tags.length === 0) return null;
  return (
    <div className="flex flex-wrap gap-2">
      {tags.map(tag => (
        <span key={tag.id} className="text-xs px-2 py-0.5 rounded border border-border" style={{ borderColor: tag.color, color: tag.color }}>
          {tag.name}
        </span>
      ))}
    </div>
  );
}
