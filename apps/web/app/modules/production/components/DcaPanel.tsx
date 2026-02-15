"use client";

import React, { useState } from 'react';
import { DataPanel, Select } from '@petrosquare/ui';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

export function DcaPanel({ assetId }: { assetId: string }) {
  const [modelType, setModelType] = useState('EXPONENTIAL');
  const [forecast, setForecast] = useState<any[]>([]);
  const [model, setModel] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const runFit = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/production/dca', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ asset_id: assetId, type: modelType, horizon_months: 24 })
      });
      const json = await res.json();
      if (json.status === 'ok') {
        setModel(json.data.model);
        setForecast(json.data.forecast);
      } else {
        setError(json.error.message);
      }
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const modelOptions = [
    { value: 'EXPONENTIAL', label: 'Exponential' },
    { value: 'HYPERBOLIC', label: 'Hyperbolic' }
  ];

  return (
    <DataPanel title="Decline Curve Analysis" className="overflow-visible">
      <div className="flex space-x-4 mb-4 items-center">
        <div className="w-48">
          <Select
            value={modelType}
            onChange={setModelType}
            options={modelOptions}
          />
        </div>
        <button
          onClick={runFit}
          disabled={loading}
          className="bg-primary text-white px-4 py-2.5 rounded-xl text-sm disabled:opacity-50 hover:bg-primary/90 transition-colors"
        >
          {loading ? 'Fitting...' : 'Run Fit & Forecast'}
        </button>
      </div>

      {error && <div className="text-critical text-sm mb-4">{error}</div>}

      {model && (
        <div className="mb-4 grid grid-cols-3 gap-4 text-sm bg-surface-highlight/10 p-3 rounded">
          <div><span className="text-muted">Qi:</span> {model.params.qi.toFixed(0)}</div>
          <div><span className="text-muted">Di:</span> {(model.params.di * 100).toFixed(2)}%</div>
          {model.params.b !== undefined && <div><span className="text-muted">b:</span> {model.params.b.toFixed(2)}</div>}
          <div><span className="text-muted">R²:</span> {model.goodness_of_fit.r2.toFixed(3)}</div>
        </div>
      )}

      {forecast.length > 0 && (
        <div className="h-64 w-full">
           <ResponsiveContainer width="100%" height="100%">
            <LineChart data={forecast}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
              <XAxis dataKey="period" stroke="#94A3B8" fontSize={10} />
              <YAxis stroke="#94A3B8" fontSize={10} />
              <Tooltip
                contentStyle={{ backgroundColor: '#1E293B', borderColor: '#334155', color: '#fff' }}
                itemStyle={{ fontSize: 12 }}
              />
              <Legend />
              <Line type="monotone" dataKey="value" stroke="#F59E0B" name="Forecast (bbl/d)" dot={false} strokeWidth={2} strokeDasharray="5 5" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </DataPanel>
  );
}
