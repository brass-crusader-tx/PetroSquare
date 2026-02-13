import { useState, useEffect, useCallback } from 'react';
import { AISummary } from '@petrosquare/types';

interface UseAISummaryResult {
  data: AISummary | null;
  loading: boolean;
  error: Error | null;
  refresh: () => void;
}

const CACHE_PREFIX = 'petrosquare-ai-summary-';
const CACHE_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

export function useAISummary(
  module: string,
  contextId: string,
  params?: Record<string, any>
): UseAISummaryResult {
  const [data, setData] = useState<AISummary | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  // Stable string for params dependency
  const paramsStr = params ? JSON.stringify(params) : '{}';

  const fetchSummary = useCallback(async (force = false) => {
    if (!contextId) {
        setLoading(false);
        return;
    }

    const currentParams = JSON.parse(paramsStr);
    const cacheKey = `${CACHE_PREFIX}${module}-${contextId}-${paramsStr}`;

    // 1. Check Cache (if not forced)
    if (!force) {
        const cached = localStorage.getItem(cacheKey);
        if (cached) {
            try {
                const parsed = JSON.parse(cached);
                const age = Date.now() - new Date(parsed.timestamp).getTime();
                if (age < CACHE_TTL_MS && parsed.data) {
                    setData(parsed.data);
                    setLoading(false);
                    return; // Cache hit
                } else {
                    localStorage.removeItem(cacheKey);
                }
            } catch (e) {
                localStorage.removeItem(cacheKey);
            }
        }
    }

    // 2. Fetch Fresh
    setLoading(true);
    setError(null);

    try {
        // Construct query params
        const queryParams = new URLSearchParams();
        queryParams.set('context_id', contextId);
        Object.entries(currentParams).forEach(([k, v]) => {
            queryParams.set(k, String(v));
        });

        const res = await fetch(`/api/${module}/ai-summary?${queryParams.toString()}`);

        if (!res.ok) {
            // Check for 404
             if (res.status === 404) {
                 setData(null); // No summary exists
                 setLoading(false);
                 return;
             }
             throw new Error(`API Error: ${res.status}`);
        }

        const json = await res.json();

        if (json.status === 'ok' && json.data) {
            setData(json.data);
            localStorage.setItem(cacheKey, JSON.stringify({
                timestamp: new Date().toISOString(),
                data: json.data
            }));
        } else {
             if (json.status === 'error') {
                 throw new Error(json.error?.message || 'Failed to generate summary');
             }
             setData(null);
        }

    } catch (err) {
        console.error("Failed to load AI summary:", err);
        setError(err instanceof Error ? err : new Error('Unknown error'));
        // Keep stale data if force refresh?
        // Logic: if manual refresh fails, we might still show old data if available?
        // But here we rely on state. If we had data, we keep it unless we set it to null.
        // We set loading=true but didn't clear data at start of fetchFresh section.
        // So stale data is visible while loading.
        // If error, we might want to keep showing stale data + error message.
    } finally {
        setLoading(false);
    }

  }, [module, contextId, paramsStr]);

  // Initial load
  useEffect(() => {
    fetchSummary(false);
  }, [fetchSummary]);

  return {
    data,
    loading,
    error,
    refresh: () => fetchSummary(true)
  };
}
