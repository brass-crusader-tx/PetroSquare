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

const COLORS = {
  grid: 'rgba(255,255,255,0.05)',
  axis: '#52525b', // zinc-600
  text: '#a1a1aa', // zinc-400
  tooltipBg: '#18181b', // zinc-900
  tooltipBorder: 'rgba(255,255,255,0.1)',
  tooltipText: '#fafafa', // zinc-50
  line: '#10b981', // emerald-500
  warning: '#f59e0b', // amber-500
};

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
      <div className="h-full w-full flex items-center justify-center text-muted text-sm">
        No telemetry data available for this window.
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" stroke={COLORS.grid} vertical={false} />
        <XAxis
          dataKey="timeStr"
          stroke={COLORS.axis}
          tick={{ fontSize: 10, fill: COLORS.text }}
          tickLine={{ stroke: COLORS.axis }}
          interval="preserveStartEnd"
          minTickGap={30}
        />
        <YAxis
          stroke={COLORS.axis}
          tick={{ fontSize: 10, fill: COLORS.text }}
          tickLine={{ stroke: COLORS.axis }}
          domain={[Math.floor(yMin), Math.ceil(yMax)]}
          width={40}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: COLORS.tooltipBg,
            borderColor: COLORS.tooltipBorder,
            color: COLORS.tooltipText,
            borderRadius: '12px',
            backdropFilter: 'blur(8px)',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
          }}
          itemStyle={{ color: COLORS.line }}
          labelStyle={{ color: COLORS.text, marginBottom: '0.5rem', fontFamily: 'monospace', fontSize: '10px' }}
          formatter={(value: number | string | Array<number | string> | undefined) => {
            if (value === undefined) return ['', ''];
            const val = typeof value === 'number' ? value : Number(value);
            return [`${val} ${data[0].unit}`, data[0].tag];
          }}
        />
        <Line
          type="monotone"
          dataKey="value"
          stroke={COLORS.line}
          strokeWidth={2}
          dot={false}
          activeDot={{ r: 4, fill: COLORS.line, stroke: COLORS.tooltipBg, strokeWidth: 2 }}
        />
        {/* Mock Threshold Line */}
        <ReferenceLine
          y={100}
          stroke={COLORS.warning}
          strokeDasharray="3 3"
          label={{ value: 'Target', position: 'right', fill: COLORS.warning, fontSize: 10 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
