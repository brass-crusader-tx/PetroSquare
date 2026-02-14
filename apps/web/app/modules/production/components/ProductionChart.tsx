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
      <div className="flex justify-end mb-4">
        <button
          onClick={() => setLogScale(!logScale)}
          className="text-xs font-medium text-muted hover:text-white border border-white/10 hover:bg-white/5 px-3 py-1.5 rounded-lg transition-all"
        >
          {logScale ? 'Linear Scale' : 'Log Scale'}
        </button>
      </div>
      <div className="h-80 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={combined}>
            <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
            <XAxis
                dataKey="date"
                stroke="#52525b"
                fontSize={10}
                tickFormatter={(v) => v.slice(0, 7)}
                tickLine={false}
                axisLine={false}
                dy={10}
            />
            <YAxis
                yAxisId="left"
                stroke="#10b981"
                fontSize={10}
                scale={logScale ? 'log' : 'auto'}
                domain={['auto', 'auto']}
                tickLine={false}
                axisLine={false}
                dx={-10}
            />
            <YAxis
                yAxisId="right"
                orientation="right"
                stroke="#ef4444"
                fontSize={10}
                scale={logScale ? 'log' : 'auto'}
                domain={['auto', 'auto']}
                tickLine={false}
                axisLine={false}
                dx={10}
            />
            <Tooltip
              contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', borderRadius: '12px', color: '#fff', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
              itemStyle={{ fontSize: 12, padding: '2px 0' }}
              cursor={{ stroke: '#3f3f46', strokeWidth: 1 }}
            />
            <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
            <Line yAxisId="left" type="monotone" dataKey="oil" stroke="#10b981" dot={false} name="Oil (bbl/d)" strokeWidth={2} activeDot={{ r: 4, fill: '#10b981' }} />
            <Line yAxisId="right" type="monotone" dataKey="gas" stroke="#ef4444" dot={false} name="Gas (mcf/d)" strokeWidth={2} activeDot={{ r: 4, fill: '#ef4444' }} />
            <Bar yAxisId="left" dataKey="water" fill="#3b82f6" name="Water (bbl/d)" opacity={0.2} radius={[4, 4, 0, 0]} />
            {anomalies.map(a => (
              <ReferenceLine
                key={a.id}
                x={a.timestamp.slice(0, 10)}
                stroke={a.severity === 'HIGH' ? '#ef4444' : (a.severity === 'MEDIUM' ? '#f59e0b' : '#3b82f6')}
                strokeDasharray="3 3"
                label={{ value: '!', position: 'insideTop', fill: a.severity === 'HIGH' ? '#ef4444' : '#f59e0b', fontSize: 12, fontWeight: 'bold' }}
              />
            ))}
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </DataPanel>
  );
}
