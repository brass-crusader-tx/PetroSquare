"use client";

import React, { useState, useEffect } from 'react';
import { DataPanel } from '@petrosquare/ui';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

export function MonteCarloPanel({ assetId }: { assetId: string }) {
  const [iterations, setIterations] = useState(100);
  const [jobId, setJobId] = useState<string | null>(null);
  const [status, setStatus] = useState<any>(null);
  const [result, setResult] = useState<any>(null);

  useEffect(() => {
      let interval: any;
      if (jobId && status !== 'COMPLETED' && status !== 'FAILED') {
          interval = setInterval(checkStatus, 1000);
      }
      return () => clearInterval(interval);
  }, [jobId, status]);

  const checkStatus = async () => {
      if (!jobId) return;
      try {
          const res = await fetch(`/api/production/jobs/monte-carlo?id=${jobId}`);
          const json = await res.json();
          if (json.status === 'ok') {
              setStatus(json.data.status);
              if (json.data.status === 'COMPLETED') {
                  setResult(json.data.result);
              }
          }
      } catch(e) { console.error(e); }
  };

  const runSimulation = async () => {
      // First get a model (hacky: just fit one then run MC)
      // Ideally we select a model.
      // For demo, we fit one on fly.
      const dcaRes = await fetch('/api/production/dca', {
          method: 'POST',
          body: JSON.stringify({ asset_id: assetId, type: 'EXPONENTIAL', horizon_months: 24 })
      });
      const dcaJson = await dcaRes.json();
      const model = dcaJson.data.model;

      const res = await fetch('/api/production/jobs/monte-carlo', {
          method: 'POST',
          body: JSON.stringify({ model, iterations, horizon_months: 24 })
      });
      const json = await res.json();
      if (json.status === 'ok') {
          setJobId(json.data.id);
          setStatus('QUEUED');
      }
  };

  return (
    <DataPanel title="Monte Carlo Simulation">
      <div className="flex space-x-4 mb-4 items-center">
          <label className="text-sm text-muted">Iterations:</label>
          <input
            type="number"
            value={iterations}
            onChange={e => setIterations(Number(e.target.value))}
            className="w-20 bg-surface-highlight border border-border rounded px-2 py-1 text-sm text-white"
          />
          <button
            onClick={runSimulation}
            disabled={status === 'RUNNING' || status === 'QUEUED'}
            className="bg-primary text-white px-4 py-1 rounded text-sm disabled:opacity-50 hover:bg-primary/90 transition-colors"
          >
            {status === 'RUNNING' ? 'Simulating...' : 'Run Simulation'}
          </button>
      </div>

      {status && (
          <div className="mb-4 p-2 bg-surface-highlight/10 rounded border border-border text-sm">
              Status: <span className={status === 'COMPLETED' ? 'text-data-positive' : 'text-data-warning'}>{status}</span>
              {status === 'RUNNING' && <span className="ml-2 animate-pulse">...</span>}
          </div>
      )}

      {result && (
        <div className="h-64 w-full">
           <ResponsiveContainer width="100%" height="100%">
            <LineChart data={result.p50.map((p: any, i: number) => ({
                period: p.period,
                p10: result.p10[i]?.value,
                p50: p.value,
                p90: result.p90[i]?.value
            }))}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
              <XAxis dataKey="period" stroke="#94A3B8" fontSize={10} />
              <YAxis stroke="#94A3B8" fontSize={10} />
              <Tooltip
                contentStyle={{ backgroundColor: '#1E293B', borderColor: '#334155', color: '#fff' }}
                itemStyle={{ fontSize: 12 }}
              />
              <Legend />
              <Line type="monotone" dataKey="p10" stroke="#EF4444" name="P10 (High)" dot={false} strokeWidth={1} strokeDasharray="3 3" />
              <Line type="monotone" dataKey="p50" stroke="#F59E0B" name="P50 (Median)" dot={false} strokeWidth={2} />
              <Line type="monotone" dataKey="p90" stroke="#10B981" name="P90 (Low)" dot={false} strokeWidth={1} strokeDasharray="3 3" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </DataPanel>
  );
}
