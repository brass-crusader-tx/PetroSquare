import React from 'react';
import { EconomicsRunResult, CashFlowRow } from '@petrosquare/types';
import { DataPanel } from '@petrosquare/ui';

interface Props {
  result: EconomicsRunResult;
}

export function CashflowTable({ result }: Props) {
  const { cashflows } = result;

  const f = (n: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n);

  return (
    <DataPanel title="Cashflow Table" className="overflow-x-auto">
      <table className="w-full text-sm text-left">
        <thead className="text-xs text-muted uppercase bg-surface-highlight/10 border-b border-border">
          <tr>
            <th className="px-4 py-3">Period</th>
            <th className="px-4 py-3 text-right">Revenue</th>
            <th className="px-4 py-3 text-right">Opex</th>
            <th className="px-4 py-3 text-right">Capex</th>
            <th className="px-4 py-3 text-right">Royalties</th>
            <th className="px-4 py-3 text-right">Taxes</th>
            <th className="px-4 py-3 text-right font-bold">Net CF</th>
            <th className="px-4 py-3 text-right">Cum. CF</th>
          </tr>
        </thead>
        <tbody>
          {cashflows.map((row) => (
            <tr key={row.period} className="border-b border-border hover:bg-surface-highlight/5">
              <td className="px-4 py-2 font-mono text-muted">{row.period}</td>
              <td className="px-4 py-2 text-right font-mono">{f(row.revenue)}</td>
              <td className="px-4 py-2 text-right font-mono text-data-critical">{f(row.opex)}</td>
              <td className="px-4 py-2 text-right font-mono text-data-warning">{f(row.capex)}</td>
              <td className="px-4 py-2 text-right font-mono">{f(row.royalties)}</td>
              <td className="px-4 py-2 text-right font-mono">{f(row.taxes)}</td>
              <td className={`px-4 py-2 text-right font-mono font-bold ${row.net_cash_flow >= 0 ? 'text-data-positive' : 'text-data-critical'}`}>
                {f(row.net_cash_flow)}
              </td>
              <td className={`px-4 py-2 text-right font-mono ${row.cumulative_cash_flow >= 0 ? 'text-data-positive' : 'text-muted'}`}>
                {f(row.cumulative_cash_flow)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </DataPanel>
  );
}
