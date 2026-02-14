import React from 'react';
import { EconomicsRunResult, CashFlowRow } from '@petrosquare/types';
import { DataPanel } from '@petrosquare/ui';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, LineChart, Line, ComposedChart } from 'recharts';

interface Props {
  result: EconomicsRunResult;
}

export function RunResults({ result }: Props) {
  const { kpis, cashflows } = result;

  // Format currency
  const f = (n: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n);
  const fp = (n: number) => n.toFixed(2) + '%';

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <MetricCard label="NPV (10%)" value={f(kpis.npv)} sub="Net Present Value" status={kpis.npv > 0 ? 'good' : 'bad'} />
        <MetricCard label="IRR" value={fp(kpis.irr_percent)} sub="Internal Rate of Return" status={kpis.irr_percent > 15 ? 'good' : 'neutral'} />
        <MetricCard label="Payout" value={`${kpis.payout_period_months} mo`} sub=" payback period" status="neutral" />
        <MetricCard label="ROI" value={fp(kpis.roi_percent)} sub="Return on Investment" status={kpis.roi_percent > 0 ? 'good' : 'bad'} />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <MetricCard label="Total Revenue" value={f(kpis.total_revenue)} sub="" status="neutral" />
        <MetricCard label="Total Capex" value={f(kpis.total_capex)} sub="" status="neutral" />
        <MetricCard label="Total Opex" value={f(kpis.total_opex)} sub="" status="neutral" />
        <MetricCard label="Breakeven Price" value={f(kpis.breakeven_price)} sub="Approx. Unit Cost" status="neutral" />
      </div>

      <DataPanel title="Cash Flow Analysis" className="h-[400px]">
        <div className="w-full h-full min-h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={cashflows}>
              <XAxis dataKey="period" stroke="#94A3B8" fontSize={12} tickFormatter={v => v.slice(0, 7)} />
              <YAxis yAxisId="left" stroke="#94A3B8" fontSize={12} tickFormatter={v => `$${v/1000}k`} />
              <YAxis yAxisId="right" orientation="right" stroke="#10B981" fontSize={12} tickFormatter={v => `$${v/1000}k`} />
              <Tooltip
                contentStyle={{ backgroundColor: '#1E293B', borderColor: '#334155', color: '#fff' }}
                formatter={(value: any) => typeof value === 'number' ? f(value) : value}
              />
              <Legend />
              <Bar yAxisId="left" dataKey="revenue" name="Revenue" fill="#3B82F6" stackId="a" />
              <Bar yAxisId="left" dataKey="opex" name="Opex" fill="#EF4444" stackId="a" />
              <Bar yAxisId="left" dataKey="capex" name="Capex" fill="#F59E0B" stackId="a" />
              <Bar yAxisId="left" dataKey="taxes" name="Taxes" fill="#6366F1" stackId="a" />
              <Line yAxisId="right" type="monotone" dataKey="cumulative_cash_flow" name="Cum. Cash Flow" stroke="#10B981" strokeWidth={2} dot={false} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </DataPanel>
    </div>
  );
}

function MetricCard({ label, value, sub, status }: { label: string, value: string, sub: string, status: 'good' | 'bad' | 'neutral' }) {
    const color = status === 'good' ? 'text-data-positive' : status === 'bad' ? 'text-data-critical' : 'text-white';
    return (
        <div className="p-4 bg-surface-highlight/10 border border-border rounded">
            <div className="text-xs text-muted uppercase font-mono mb-1">{label}</div>
            <div className={`text-2xl font-bold font-mono ${color}`}>{value}</div>
            <div className="text-xs text-muted mt-1">{sub}</div>
        </div>
    );
}
