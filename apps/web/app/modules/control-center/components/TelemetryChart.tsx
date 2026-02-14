"use client";

import { useMemo } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine
} from 'recharts';
import { TelemetryPoint } from '@petrosquare/types';

interface TelemetryChartProps {
  data: TelemetryPoint[];
  window: '1h' | '24h' | '7d';
}

export function TelemetryChart({ data, window }: TelemetryChartProps) {
  const chartData = useMemo(() => {
    if (!data) return [];
    return [...data].reverse().map(point => ({
      ...point,
      timeStr: new Date(point.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }));
  }, [data]);

  const yMin = useMemo(() => (data && data.length > 0) ? Math.min(...data.map(d => d.value)) * 0.95 : 0, [data]);
  const yMax = useMemo(() => (data && data.length > 0) ? Math.max(...data.map(d => d.value)) * 1.05 : 100, [data]);

  if (!data || data.length === 0) {
    return (
      <div className="h-full w-full flex items-center justify-center text-slate-500 text-sm">
        No telemetry data available for this window.
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
        <XAxis
          dataKey="timeStr"
          stroke="#94a3b8"
          tick={{ fontSize: 10 }}
          interval="preserveStartEnd"
          minTickGap={30}
        />
        <YAxis
          stroke="#94a3b8"
          tick={{ fontSize: 10 }}
          domain={[Math.floor(yMin), Math.ceil(yMax)]}
          width={40}
        />
        <Tooltip
          contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#e2e8f0' }}
          itemStyle={{ color: '#10b981' }}
          labelStyle={{ color: '#94a3b8', marginBottom: '0.5rem' }}
          formatter={(value: number) => [`${value} ${data[0].unit}`, data[0].tag]}
        />
        <Line
          type="monotone"
          dataKey="value"
          stroke="#10b981"
          strokeWidth={2}
          dot={false}
          activeDot={{ r: 4, fill: '#10b981' }}
        />
        {/* Mock Threshold Line */}
        <ReferenceLine y={100} stroke="#f59e0b" strokeDasharray="3 3" label={{ value: 'Target', position: 'right', fill: '#f59e0b', fontSize: 10 }} />
      </LineChart>
    </ResponsiveContainer>
  );
}
