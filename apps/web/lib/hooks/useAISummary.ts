import { useState, useEffect, useCallback } from 'react';
import { AISummary, DataEnvelope } from '@petrosquare/types';

export function useAISummary(module: string, contextId: string | null, params: Record<string, string> = {}) {
  const [summary, setSummary] = useState<AISummary | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Stable params string for dependency array and cache key
  const paramsKey = JSON.stringify(params);

  const fetchSummary = useCallback(async (forceRefresh = false) => {
    if (!contextId) {
        setSummary(null);
        return;
    }

    const cacheKey = `petrosquare-ai-summary-${module}-${contextId}-${paramsKey}`;

    if (!forceRefresh) {
        const cached = localStorage.getItem(cacheKey);
        if (cached) {
            try {
                const parsed = JSON.parse(cached);
                // Simple validity check
                if (parsed && parsed.context_id === contextId) {
                    setSummary(parsed);
                    return; // Cache hit, skip fetch
                }
            } catch (e) {
                console.warn("Invalid cache for AI summary", e);
                localStorage.removeItem(cacheKey);
            }
        }
    }

    setLoading(true);
    setError(null);

    try {
        const searchParams = new URLSearchParams({ context_id: contextId, ...params });
        const res = await fetch(`/api/${module}/ai-summary?${searchParams.toString()}`);
        const json: DataEnvelope<AISummary> = await res.json();

        if (json.status === 'ok' && json.data) {
            setSummary(json.data);
            try {
                localStorage.setItem(cacheKey, JSON.stringify(json.data));
            } catch (e) {
                console.warn("Failed to cache summary", e);
            }
        } else {
            setError(json.error?.message || 'Failed to generate summary');
            // If refresh failed, keep showing old data if available? Or clear it?
            // Usually showing old data with error is better, but here let's assume if it fails, we show error.
        }
    } catch (err: any) {
        setError(err.message || 'Network error');
    } finally {
        setLoading(false);
    }
  }, [module, contextId, paramsKey]);

  useEffect(() => {
      fetchSummary();
  }, [fetchSummary]);

  return { summary, loading, error, refresh: () => fetchSummary(true) };
}
