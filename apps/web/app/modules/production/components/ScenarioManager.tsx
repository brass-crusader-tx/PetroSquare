"use client";

import React, { useState, useEffect } from 'react';
import { DataPanel } from '@petrosquare/ui';

export function ScenarioManager({ assetId }: { assetId: string }) {
  const [scenarios, setScenarios] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState('');

  useEffect(() => {
    fetchScenarios();
  }, [assetId]);

  const fetchScenarios = async () => {
    setLoading(true);
    try {
        const res = await fetch(`/api/production/scenarios?asset_id=${assetId}`);
        const json = await res.json();
        if (json.status === 'ok') {
            setScenarios(json.data);
        }
    } catch(e) { console.error(e); } finally { setLoading(false); }
  };

  const createScenario = async () => {
      if (!name) return;
      try {
          const res = await fetch('/api/production/scenarios', {
              method: 'POST',
              body: JSON.stringify({ asset_id: assetId, name })
          });
          if (res.ok) {
              setName('');
              fetchScenarios();
          }
      } catch(e) { console.error(e); }
  };

  return (
    <DataPanel title="Scenario Planning">
      <div className="flex space-x-2 mb-4">
          <input
            type="text"
            placeholder="New Scenario Name..."
            className="flex-1 bg-surface-highlight border border-border rounded px-3 py-1 text-sm text-white"
            value={name}
            onChange={e => setName(e.target.value)}
          />
          <button
            onClick={createScenario}
            className="bg-primary text-white px-4 py-1 rounded text-sm disabled:opacity-50 hover:bg-primary/90 transition-colors"
          >
            Create
          </button>
      </div>

      <div className="space-y-2">
          {loading && <div className="text-muted text-sm">Loading scenarios...</div>}
          {scenarios.map(s => (
              <div key={s.id} className="flex items-center justify-between p-2 bg-surface-highlight/5 rounded border border-border">
                  <div>
                      <div className="font-medium text-white text-sm">{s.name}</div>
                      <div className="text-xs text-muted">{s.is_committed ? 'Committed' : 'Draft'} • {new Date(s.created_at).toLocaleDateString()}</div>
                  </div>
                  <div className="flex space-x-2">
                      <button className="text-xs text-primary hover:underline">Edit</button>
                      <button className="text-xs text-muted hover:text-critical">Delete</button>
                  </div>
              </div>
          ))}
          {!loading && scenarios.length === 0 && (
              <div className="text-muted text-sm italic">No scenarios created yet.</div>
          )}
      </div>
    </DataPanel>
  );
}
