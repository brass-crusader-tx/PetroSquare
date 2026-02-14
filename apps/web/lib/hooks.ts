import { useState, useEffect } from 'react';
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
  }, [url, version]);

  return { data, loading, error, provenance, refresh };
}
