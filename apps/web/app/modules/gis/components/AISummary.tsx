"use client";

import OperationalInsight from '@/components/OperationalInsight';

interface AISummaryPanelProps {
  contextId: string;
  title?: string;
  className?: string;
}

export default function AISummaryPanel({ contextId, title, className }: AISummaryPanelProps) {
  return (
    <OperationalInsight
      module="gis"
      contextId={contextId}
      title={title}
      className={className}
    />
  );
}
