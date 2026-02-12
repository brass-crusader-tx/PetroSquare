import { useState, useEffect } from 'react';
import { DataEnvelope } from '@petrosquare/types';

export function useData<T>(url: string) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [provenance, setProvenance] = useState<any | null>(null);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    fetch(url)
      .then(res => res.json())
      .then((json: DataEnvelope<T>) => {
        if (!mounted) return;
        if (json.status === 'ok' || (json.status === 'degraded' && json.data)) {
          setData(json.data);
          setProvenance(json.provenance);
        } else {
          setError(json.error?.message || 'Unknown error');
        }
        setLoading(false);
      })
      .catch(err => {
        if (!mounted) return;
        setError(err.message);
        setLoading(false);
      });

    return () => { mounted = false; };
  }, [url]);

  return { data, loading, error, provenance };
}
