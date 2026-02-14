import { useState, useEffect, useCallback } from 'react';
import { DataEnvelope } from '@petrosquare/types';

export function useData<T>(url: string | null) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [provenance, setProvenance] = useState<any | null>(null);
  const [version, setVersion] = useState(0);

  const refresh = () => setVersion(v => v + 1);

  useEffect(() => {
    if (!url) return;
    let mounted = true;
    setLoading(true);

    // Check if URL is API route or external.
    // If it's internal API, it might return T directly or DataEnvelope<T>.
    // My new economics APIs return T directly (arrays or objects).
    // But existing hooks seem to expect DataEnvelope.
    // Let's check my API implementation.

    fetch(url)
      .then(res => res.json())
      .then((json: any) => {
        if (!mounted) return;

        // Handle DataEnvelope structure
        if (json && typeof json === 'object' && 'status' in json && 'data' in json) {
            if (json.status === 'ok' || (json.status === 'degraded' && json.data)) {
                setData(json.data);
                setProvenance(json.provenance);
            } else {
                setError(json.error?.message || 'Unknown error');
            }
        } else {
            // Assume direct data return (which my new APIs do)
            setData(json);
        }
        setLoading(false);
      })
      .catch(err => {
        if (!mounted) return;
        setError(err.message);
        setLoading(false);
      });

    return () => { mounted = false; };
  }, [url, version]);

  return { data, loading, error, provenance, refresh };
}
