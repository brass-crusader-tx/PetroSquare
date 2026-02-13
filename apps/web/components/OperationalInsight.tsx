"use client";

import { useState, useEffect } from 'react';
import { DataPanel, DataMeta } from '@petrosquare/ui';

interface OperationalInsightProps {
  module: string;
  context?: string;
  className?: string;
}

export function OperationalInsight({ module, context = 'global', className }: OperationalInsightProps) {
  const [loading, setLoading] = useState(false);
  const [insight, setInsight] = useState<string | null>(null);
  const [error, setError] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);

  const cacheKey = `petrosquare-insight-${module}-${context}`;

  useEffect(() => {
    // Check local cache
    const cached = localStorage.getItem(cacheKey);
    if (cached) {
      try {
        const { text, timestamp } = JSON.parse(cached);
        if (Date.now() - timestamp < 1000 * 60 * 60) { // 1 hour TTL
            setInsight(text);
            setLastUpdated(new Date(timestamp).toLocaleTimeString());
            return;
        }
      } catch (e) {
          localStorage.removeItem(cacheKey);
      }
    }

    // Fetch if no cache or expired
    fetchInsight();
  }, [module, context]);

  const fetchInsight = async () => {
    setLoading(true);
    setError(false);
    try {
      let url = '';
      if (module === 'production') url = `/api/production/insight?context=${context}`;
      else if (module === 'gis') url = `/api/gis/ai-summary?context_id=${context}`;
      // Fallback for others using production endpoint as generic for now or mock
      else url = `/api/production/insight?context=${module}`;

      const res = await fetch(url);
      const json = await res.json();

      let text = '';
      if (json.status === 'ok') {
          if (json.data?.summary) text = json.data.summary;
          else if (json.data?.summary_markdown) text = json.data.summary_markdown;
          else if (typeof json.data === 'string') text = json.data;
      }

      if (text) {
        setInsight(text);
        const now = Date.now();
        localStorage.setItem(cacheKey, JSON.stringify({ text, timestamp: now }));
        setLastUpdated(new Date(now).toLocaleTimeString());
      }
    } catch (e) {
      console.error("Insight fetch failed", e);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  // If loading initially
  if (loading && !insight) {
      return (
          <DataPanel title="Operational Insight" subtitle="Analyzing data..." loading={true}>
              <div className="h-24"></div>
          </DataPanel>
      );
  }

  if (error && !insight) {
      return (
          <DataPanel title="Operational Insight" subtitle="Unavailable">
              <div className="text-sm text-muted italic">Insight temporarily unavailable.</div>
          </DataPanel>
      );
  }

  if (!insight) return null;

  return (
    <DataPanel
      title="Operational Insight"
      subtitle="AI-generated situational analysis"
      loading={loading}
      footer={
        <div className="flex justify-between items-center w-full">
            <DataMeta source="PetroSquare AI" lastUpdated={lastUpdated || 'Just now'} />
            <button
                onClick={fetchInsight}
                className="text-[10px] text-primary hover:underline uppercase tracking-wide font-bold"
                disabled={loading}
            >
                Refresh
            </button>
        </div>
      }
      className={className}
    >
      <div className="prose prose-invert prose-sm max-w-none">
         <div className="text-sm text-slate-300 whitespace-pre-wrap leading-relaxed font-sans">
            {insight.replace(/\*\*/g, '')}
         </div>
      </div>
    </DataPanel>
  );
}
