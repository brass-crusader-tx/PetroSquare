import React, { useState, useEffect } from 'react';
import { EconomicsScenarioVersion, EconomicsRun } from '@petrosquare/types';
import { DataPanel } from '@petrosquare/ui';

interface Props {
  scenarioId: string;
  currentVersionId: string;
}

export function ScenarioCompare({ scenarioId, currentVersionId }: Props) {
  const [compareVersionId, setCompareVersionId] = useState<string>('');
  const [data, setData] = useState<any>(null);
  const [versions, setVersions] = useState<EconomicsScenarioVersion[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch(`/api/economics/scenarios/${scenarioId}/versions`)
      .then(res => res.json())
      .then(setVersions)
      .catch(console.error);
  }, [scenarioId]);

  useEffect(() => {
    if (compareVersionId) {
        setLoading(true);
        fetch(`/api/economics/compare?versionA=${currentVersionId}&versionB=${compareVersionId}`)
            .then(res => res.json())
            .then(json => {
                setData(json);
                setLoading(false);
            })
            .catch(e => {
                console.error(e);
                setLoading(false);
            });
    }
  }, [currentVersionId, compareVersionId]);

  const f = (n: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n);
  const fp = (n: number) => n?.toFixed(2) + '%';

  const diff = (a: number, b: number, type: 'currency' | 'percent') => {
      const d = a - b;
      const color = d > 0 ? 'text-data-positive' : d < 0 ? 'text-data-critical' : 'text-muted';
      const str = type === 'currency' ? f(d) : fp(d);
      return <span className={color}>{d > 0 ? '+' : ''}{str}</span>;
  }

  if (!versions.length) return <div>Loading versions...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <label className="text-sm font-bold text-white">Compare with:</label>
        <select
          value={compareVersionId}
          onChange={e => setCompareVersionId(e.target.value)}
          className="bg-surface-highlight/10 border border-border rounded px-3 py-2 text-white"
        >
            <option value="">Select Version</option>
            {versions.filter(v => v.id !== currentVersionId).map(v => (
                <option key={v.id} value={v.id}>{v.name} (v{v.version})</option>
            ))}
        </select>
      </div>

      {data && (
        <DataPanel title="Comparison Matrix" loading={loading}>
            <table className="w-full text-sm">
                <thead>
                    <tr className="border-b border-border text-muted uppercase text-xs">
                        <th className="py-2 text-left">Metric</th>
                        <th className="py-2 text-right">Current (v{data.versionA.version})</th>
                        <th className="py-2 text-right">Compare (v{data.versionB.version})</th>
                        <th className="py-2 text-right">Delta</th>
                    </tr>
                </thead>
                <tbody>
                    <MetricRow label="NPV" valA={data.versionA.run?.result_payload_json?.kpis?.npv} valB={data.versionB.run?.result_payload_json?.kpis?.npv} fmt={f} type="currency" diffFn={diff} />
                    <MetricRow label="IRR" valA={data.versionA.run?.result_payload_json?.kpis?.irr_percent} valB={data.versionB.run?.result_payload_json?.kpis?.irr_percent} fmt={fp} type="percent" diffFn={diff} />
                    <MetricRow label="Total Revenue" valA={data.versionA.run?.result_payload_json?.kpis?.total_revenue} valB={data.versionB.run?.result_payload_json?.kpis?.total_revenue} fmt={f} type="currency" diffFn={diff} />
                    <MetricRow label="Total Capex" valA={data.versionA.run?.result_payload_json?.kpis?.total_capex} valB={data.versionB.run?.result_payload_json?.kpis?.total_capex} fmt={f} type="currency" diffFn={diff} />
                </tbody>
            </table>
        </DataPanel>
      )}
    </div>
  );
}

function MetricRow({ label, valA, valB, fmt, type, diffFn }: any) {
    if (valA === undefined || valB === undefined) return null;
    return (
        <tr className="border-b border-border/50">
            <td className="py-3 font-medium text-white">{label}</td>
            <td className="py-3 text-right font-mono text-muted">{fmt(valA)}</td>
            <td className="py-3 text-right font-mono text-muted">{fmt(valB)}</td>
            <td className="py-3 text-right font-mono font-bold">{diffFn(valA, valB, type)}</td>
        </tr>
    )
}
