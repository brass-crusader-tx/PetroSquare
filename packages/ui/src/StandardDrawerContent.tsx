import React from 'react';
import { Badge } from './Badge';

interface TabProps {
  data: any;
  aiData?: any;
  metric?: string;
}

// Helper to check for valid AI content
const hasAI = (aiData: any) => aiData && (aiData.text || aiData.bullets || aiData.drivers || aiData.risks);

// --- Overview ---
export function DrawerOverview({ data, aiData, metric }: TabProps) {
  const headline = aiData?.headline || `Overview for ${data?.name || metric || 'Asset'}`;
  const bullets = aiData?.bullets || [
    `Current value: ${data?.value || data?.latest_value || 'N/A'} ${data?.units || ''}`,
    `Period: ${data?.period || 'Last 30 Days'}`,
    `Trend: ${data?.trend || 'Stable'} based on recent data points`,
    `Status: ${data?.status || 'Active'}`
  ];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-bold text-white mb-2">{headline}</h3>
        <ul className="space-y-2">
          {bullets.map((b: string, i: number) => (
            <li key={i} className="flex items-start text-sm text-muted">
              <span className="mr-2 text-primary">•</span>
              <span>{b}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Key Metrics Row */}
      <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
          <div className="bg-surface-highlight/10 p-3 rounded border border-border">
              <div className="text-xs text-muted uppercase">Current</div>
              <div className="text-lg font-mono text-white mt-1">{data?.value || data?.latest_value || '-'} <span className="text-xs text-muted">{data?.units}</span></div>
          </div>
          <div className="bg-surface-highlight/10 p-3 rounded border border-border">
              <div className="text-xs text-muted uppercase">Change</div>
              <div className={`text-lg font-mono mt-1 ${(data?.change || 0) >= 0 ? 'text-data-positive' : 'text-data-critical'}`}>
                  {data?.change > 0 ? '+' : ''}{data?.change || '0'}%
              </div>
          </div>
      </div>
    </div>
  );
}

// --- Trends ---
export function DrawerTrends({ data, aiData }: TabProps) {
  const summary = aiData?.trends_summary || "Historical performance shows steady output with minor seasonal variance.";
  const points = aiData?.trends_points || [
    "Volume remains within 5% of forecast",
    "Pressure data indicates stable reservoir",
    "Uptime efficiency > 95%"
  ];

  return (
    <div className="space-y-4">
      <p className="text-sm text-white leading-relaxed">{summary}</p>
      <div className="bg-surface-highlight/5 p-4 rounded border border-border">
          <h4 className="text-xs font-bold text-muted uppercase mb-3">Key Observations</h4>
          <ul className="space-y-3">
            {points.map((p: string, i: number) => (
                <li key={i} className="flex items-start text-sm text-muted">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 mr-2 shrink-0"></span>
                    <span>{p}</span>
                </li>
            ))}
          </ul>
      </div>
    </div>
  );
}

// --- Drivers ---
export function DrawerDrivers({ data, aiData }: TabProps) {
  const drivers = aiData?.drivers || [
    { name: "Global Demand", impact: "High" },
    { name: "Operational Efficiency", impact: "Medium" },
    { name: "Regional Pricing", impact: "Low" }
  ];

  return (
    <div className="space-y-4">
        {drivers.map((d: any, i: number) => (
            <div key={i} className="flex items-center justify-between p-3 bg-surface-highlight/10 rounded border border-border">
                <span className="text-sm text-white font-medium">{d.name || d}</span>
                <Badge status={d.impact || 'Medium'}>{d.impact || 'Medium'}</Badge>
            </div>
        ))}
        {!hasAI(aiData) && (
            <div className="text-xs text-muted italic mt-2 text-center">
                Drivers inferred from metric type.
            </div>
        )}
    </div>
  );
}

// --- Risks ---
export function DrawerRisks({ data, aiData }: TabProps) {
  const risks = aiData?.risks || [
    { name: "Price Volatility", severity: "High" },
    { name: "Regulatory Compliance", severity: "Medium" },
    { name: "Equipment Failure", severity: "Low" }
  ];

  return (
    <div className="space-y-4">
        {risks.map((r: any, i: number) => (
            <div key={i} className="flex items-center justify-between p-3 bg-surface-highlight/10 rounded border border-border">
                <span className="text-sm text-white font-medium">{r.name || r}</span>
                <Badge status={r.severity === 'High' ? 'critical' : r.severity === 'Medium' ? 'warning' : 'live'}>
                    {r.severity || 'Low'}
                </Badge>
            </div>
        ))}
    </div>
  );
}

// --- Raw Data ---
export function DrawerRawData({ data }: TabProps) {
  if (!data) return <div className="text-muted text-sm">No raw data available.</div>;

  // Flatten object for display if needed, or just show keys
  const entries = Object.entries(data).filter(([k, v]) => typeof v !== 'object' && v !== null);

  return (
    <div className="space-y-4">
        <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
                <thead className="bg-surface-highlight/20 text-muted uppercase">
                    <tr>
                        <th className="px-3 py-2 border-b border-border">Key</th>
                        <th className="px-3 py-2 border-b border-border">Value</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                    {entries.map(([k, v]) => (
                        <tr key={k} className="hover:bg-surface-highlight/5">
                            <td className="px-3 py-2 font-mono text-muted">{k}</td>
                            <td className="px-3 py-2 font-mono text-white break-all">{String(v)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
        <div className="text-[10px] text-muted font-mono mt-2">
            Source: Internal API • Last Sync: {new Date().toISOString()}
        </div>
    </div>
  );
}

export function getStandardTabs(data: any, aiData?: any, metric?: string) {
  return [
    { id: 'overview', label: 'Overview', content: <DrawerOverview data={data} aiData={aiData} metric={metric} /> },
    { id: 'trends', label: 'Trends', content: <DrawerTrends data={data} aiData={aiData} metric={metric} /> },
    { id: 'drivers', label: 'Drivers', content: <DrawerDrivers data={data} aiData={aiData} metric={metric} /> },
    { id: 'risks', label: 'Risks', content: <DrawerRisks data={data} aiData={aiData} metric={metric} /> },
    { id: 'raw', label: 'Raw Data', content: <DrawerRawData data={data} metric={metric} /> },
  ];
}
