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
        <h1 className="text-2xl font-bold text-white tracking-tight">Assets</h1>
        <input
          type="text"
          placeholder="Search Assets..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="bg-slate-900 border border-slate-700 text-slate-200 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 w-64"
        />
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-lg overflow-hidden">
        <table className="w-full text-left text-slate-400">
          <thead className="bg-slate-800 text-slate-200 uppercase text-xs font-bold tracking-wider">
            <tr>
              <th className="p-4">Name</th>
              <th className="p-4">Type</th>
              <th className="p-4">Status</th>
              <th className="p-4">Health</th>
              <th className="p-4">Alarms</th>
              <th className="p-4">Last Contact</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {loading ? (
              <tr><td colSpan={6} className="p-8 text-center animate-pulse">Loading Assets...</td></tr>
            ) : assets.length === 0 ? (
              <tr><td colSpan={6} className="p-8 text-center text-slate-500">No assets found</td></tr>
            ) : (
              assets.map((asset) => (
                <tr key={asset.id} className="hover:bg-slate-800/50 transition-colors">
                  <td className="p-4 font-medium text-white">
                    <Link href={`/modules/control-center/assets/${asset.id}`} className="hover:text-emerald-400 hover:underline">
                      {asset.name}
                    </Link>
                    <div className="text-xs text-slate-500 font-mono mt-1">{asset.id}</div>
                  </td>
                  <td className="p-4"><span className="px-2 py-1 rounded text-xs bg-slate-800 text-slate-300 border border-slate-700">{asset.type}</span></td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded text-xs font-bold ${
                      asset.status === 'ACTIVE' ? 'bg-emerald-900/30 text-emerald-400 border border-emerald-900' :
                      asset.status === 'MAINTENANCE' ? 'bg-amber-900/30 text-amber-400 border border-amber-900' :
                      'bg-slate-800 text-slate-400'
                    }`}>
                      {asset.status}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center space-x-2">
                      <div className="w-16 bg-slate-800 rounded-full h-2 overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            asset.healthScore > 90 ? 'bg-emerald-500' :
                            asset.healthScore > 70 ? 'bg-amber-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${asset.healthScore}%` }}
                        />
                      </div>
                      <span className="text-sm font-mono">{asset.healthScore}%</span>
                    </div>
                  </td>
                  <td className="p-4">
                    {asset.activeAlarms > 0 ? (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-bold bg-red-900/30 text-red-400 border border-red-900 animate-pulse">
                        {asset.activeAlarms} Critical
                      </span>
                    ) : (
                      <span className="text-slate-600 text-sm">-</span>
                    )}
                  </td>
                  <td className="p-4 text-sm font-mono text-slate-500">
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
