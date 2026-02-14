"use client";

import React, { useState } from 'react';
import { ResponsiveContainer, ComposedChart, Line, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ReferenceLine } from 'recharts';
import { DataPanel } from '@petrosquare/ui';
import { Anomaly } from '@petrosquare/types';

export function ProductionChart({ oil, gas, water, anomalies = [] }: { oil: any[], gas: any[], water: any[], anomalies?: Anomaly[] }) {
  const [logScale, setLogScale] = useState(false);

  // Combine data by date
  const combined = oil.map((o, i) => ({
    date: o.timestamp.slice(0, 10),
    oil: o.value,
    gas: gas[i]?.value,
    water: water[i]?.value
  }));

  return (
    <DataPanel title="Production History">
      <div className="flex justify-end mb-2">
        <button
          onClick={() => setLogScale(!logScale)}
          className="text-xs text-muted hover:text-white border border-border px-2 py-1 rounded"
        >
          {logScale ? 'Linear Scale' : 'Log Scale'}
        </button>
      </div>
      <div className="h-80 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={combined}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
            <XAxis dataKey="date" stroke="#94A3B8" fontSize={10} tickFormatter={(v) => v.slice(0, 7)} />
            <YAxis yAxisId="left" stroke="#10B981" fontSize={10} scale={logScale ? 'log' : 'auto'} domain={['auto', 'auto']} />
            <YAxis yAxisId="right" orientation="right" stroke="#EF4444" fontSize={10} scale={logScale ? 'log' : 'auto'} domain={['auto', 'auto']} />
            <Tooltip
              contentStyle={{ backgroundColor: '#1E293B', borderColor: '#334155', color: '#fff' }}
              itemStyle={{ fontSize: 12 }}
            />
            <Legend />
            <Line yAxisId="left" type="monotone" dataKey="oil" stroke="#10B981" dot={false} name="Oil (bbl/d)" strokeWidth={2} />
            <Line yAxisId="right" type="monotone" dataKey="gas" stroke="#EF4444" dot={false} name="Gas (mcf/d)" strokeWidth={2} />
            <Bar yAxisId="left" dataKey="water" fill="#3B82F6" name="Water (bbl/d)" opacity={0.3} />
            {anomalies.map(a => (
              <ReferenceLine
                key={a.id}
                x={a.timestamp.slice(0, 10)}
                stroke={a.severity === 'HIGH' ? '#EF4444' : (a.severity === 'MEDIUM' ? '#F59E0B' : '#3B82F6')}
                strokeDasharray="3 3"
                label={{ value: '!', position: 'insideTop', fill: a.severity === 'HIGH' ? '#EF4444' : '#F59E0B', fontSize: 14, fontWeight: 'bold' }}
              />
            ))}
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </DataPanel>
  );
}
