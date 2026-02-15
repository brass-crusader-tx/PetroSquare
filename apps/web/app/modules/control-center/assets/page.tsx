"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ControlAsset } from '@petrosquare/types';

export default function AssetListPage() {
  const [assets, setAssets] = useState<ControlAsset[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');

  const fetchAssets = () => {
    setLoading(true);
    fetch(`/api/control-center/assets?query=${query}`)
      .then(res => res.json())
      .then(setAssets)
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    const timeout = setTimeout(fetchAssets, 500); // Debounce
    return () => clearTimeout(timeout);
  }, [query]);

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold text-white uppercase tracking-wider font-sans">Assets</h1>
        <input
          type="text"
          placeholder="Search Assets..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="bg-surface/50 border border-border/50 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 w-64 placeholder:text-muted transition-colors"
        />
      </div>

      <div className="bg-surface border border-border/50 rounded-xl overflow-hidden shadow-md">
        <table className="w-full text-left text-muted">
          <thead className="bg-surface-highlight/30 text-white uppercase text-[10px] font-bold tracking-wider border-b border-border/50">
            <tr>
              <th className="p-4 font-medium">Name</th>
              <th className="p-4 font-medium">Type</th>
              <th className="p-4 font-medium">Status</th>
              <th className="p-4 font-medium">Health</th>
              <th className="p-4 font-medium">Alarms</th>
              <th className="p-4 font-medium">Last Contact</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/50">
            {loading ? (
              <tr><td colSpan={6} className="p-8 text-center animate-pulse text-muted text-sm">Loading Assets...</td></tr>
            ) : assets.length === 0 ? (
              <tr><td colSpan={6} className="p-8 text-center text-muted text-sm">No assets found</td></tr>
            ) : (
              assets.map((asset) => (
                <tr key={asset.id} className="hover:bg-surface-highlight/5 transition-colors group">
                  <td className="p-4 font-medium text-white">
                    <Link href={`/modules/control-center/assets/${asset.id}`} className="hover:text-primary transition-colors">
                      {asset.name}
                    </Link>
                    <div className="text-[10px] text-muted font-mono mt-1 group-hover:text-muted/80">{asset.id}</div>
                  </td>
                  <td className="p-4"><span className="px-2 py-1 rounded text-[10px] bg-surface-highlight/20 text-white border border-border/50">{asset.type}</span></td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded text-[10px] uppercase tracking-wider font-bold ${
                      asset.status === 'ACTIVE' ? 'bg-data-positive/20 text-data-positive border border-data-positive/20' :
                      asset.status === 'MAINTENANCE' ? 'bg-data-warning/20 text-data-warning border border-data-warning/20' :
                      'bg-surface-highlight text-muted border border-border/50'
                    }`}>
                      {asset.status}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center space-x-2">
                      <div className="w-16 bg-surface-highlight rounded-full h-1.5 overflow-hidden">
                        <div
                          className={`h-full rounded-full shadow-[0_0_8px_currentColor] ${
                            asset.healthScore > 90 ? 'bg-data-positive text-data-positive' :
                            asset.healthScore > 70 ? 'bg-data-warning text-data-warning' : 'bg-data-critical text-data-critical'
                          }`}
                          style={{ width: `${asset.healthScore}%` }}
                        />
                      </div>
                      <span className="text-xs font-mono text-muted">{asset.healthScore}%</span>
                    </div>
                  </td>
                  <td className="p-4">
                    {asset.activeAlarms > 0 ? (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] uppercase tracking-wider font-bold bg-data-critical/20 text-data-critical border border-data-critical/20 animate-pulse">
                        {asset.activeAlarms} Critical
                      </span>
                    ) : (
                      <span className="text-muted/50 text-xs">-</span>
                    )}
                  </td>
                  <td className="p-4 text-xs font-mono text-muted">
                    {new Date(asset.lastContact).toLocaleString()}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
