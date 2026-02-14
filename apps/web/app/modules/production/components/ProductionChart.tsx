"use client";

import React, { useState } from 'react';
import { ResponsiveContainer, ComposedChart, Line, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ReferenceLine } from 'recharts';
import { ChartContainer } from '@petrosquare/ui';
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

  // Get latest timestamp
  const latestTs = oil.length > 0 ? oil[oil.length - 1].timestamp : new Date().toISOString();

  return (
    <ChartContainer
      title="Production History"
      units="Mixed"
      timestamp={new Date(latestTs).toLocaleString()}
      source="Production DB (Historian)"
      className="h-[400px]"
    >
      <div className="absolute top-2 right-4 z-10">
        <button
          onClick={() => setLogScale(!logScale)}
          className="text-[10px] uppercase font-bold text-muted hover:text-white border border-border px-2 py-1 rounded bg-surface/80 backdrop-blur-sm"
        >
          {logScale ? 'Linear Scale' : 'Log Scale'}
        </button>
      </div>
      <div className="h-full w-full">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={combined} margin={{ top: 20, right: 0, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} vertical={false} />
            <XAxis dataKey="date" stroke="#94A3B8" fontSize={10} tickFormatter={(v) => v.slice(5)} tickLine={false} axisLine={false} dy={10} />
            <YAxis yAxisId="left" stroke="#94A3B8" fontSize={10} scale={logScale ? 'log' : 'auto'} domain={['auto', 'auto']} tickLine={false} axisLine={false} tickFormatter={(val) => val >= 1000 ? `${(val/1000).toFixed(1)}k` : val} />
            <YAxis yAxisId="right" orientation="right" stroke="#94A3B8" fontSize={10} scale={logScale ? 'log' : 'auto'} domain={['auto', 'auto']} tickLine={false} axisLine={false} tickFormatter={(val) => val >= 1000 ? `${(val/1000).toFixed(1)}k` : val} />
            <Tooltip
              contentStyle={{ backgroundColor: '#151E32', borderColor: '#2A3650', color: '#fff', borderRadius: '8px', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5)' }}
              itemStyle={{ fontSize: 12, padding: 0 }}
              labelStyle={{ color: '#94A3B8', fontSize: 10, marginBottom: 4 }}
              cursor={{ stroke: '#334155', strokeWidth: 1 }}
            />
            <Legend wrapperStyle={{ fontSize: '10px', paddingTop: '10px' }} iconType="circle" />
            <Line yAxisId="left" type="monotone" dataKey="oil" stroke="#10B981" dot={false} name="Oil (bbl/d)" strokeWidth={2} activeDot={{ r: 4, fill: '#10B981' }} />
            <Line yAxisId="right" type="monotone" dataKey="gas" stroke="#EF4444" dot={false} name="Gas (mcf/d)" strokeWidth={2} activeDot={{ r: 4, fill: '#EF4444' }} />
            <Bar yAxisId="left" dataKey="water" fill="#3B82F6" name="Water (bbl/d)" opacity={0.2} barSize={20} radius={[4, 4, 0, 0]} />
            {anomalies.map(a => (
              <ReferenceLine
                key={a.id}
                x={a.timestamp.slice(0, 10)}
                stroke={a.severity === 'HIGH' ? '#EF4444' : (a.severity === 'MEDIUM' ? '#F59E0B' : '#3B82F6')}
                strokeDasharray="3 3"
                label={{ value: '!', position: 'insideTop', fill: a.severity === 'HIGH' ? '#EF4444' : '#F59E0B', fontSize: 12, fontWeight: 'bold' }}
              />
            ))}
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </ChartContainer>
  );
}
