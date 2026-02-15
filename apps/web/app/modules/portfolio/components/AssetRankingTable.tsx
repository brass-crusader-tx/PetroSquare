'use client';

import React from 'react';
import { PortfolioAsset } from '@petrosquare/types';
import { ArrowUp, ArrowDown, ArrowRight } from 'lucide-react';
// import { useRouter } from 'next/navigation';

interface AssetRankingTableProps {
    assets: PortfolioAsset[];
    // onSelectAsset?: (assetId: string) => void; // Removed to avoid Server Component passing function error
}

export function AssetRankingTable({ assets }: AssetRankingTableProps) {
    // const router = useRouter();

    return (
        <div className="w-full bg-surface rounded-lg border border-border overflow-hidden">
            <table className="min-w-full divide-y divide-border">
                <thead className="bg-surface-highlight">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-muted uppercase tracking-wider">Asset</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-muted uppercase tracking-wider">Type</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-muted uppercase tracking-wider">Region</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-muted uppercase tracking-wider">NPV ($M)</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-muted uppercase tracking-wider">Risk Score</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-muted uppercase tracking-wider">Comp Score</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-muted uppercase tracking-wider">Rank</th>
                    </tr>
                </thead>
                <tbody className="bg-surface divide-y divide-border/50">
                    {assets.sort((a, b) => b.composite_score - a.composite_score).map((asset) => (
                        <tr key={asset.id} className="hover:bg-surface-highlight/50 cursor-default">
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-white font-medium">{asset.name}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-muted">{asset.type}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-muted">{asset.region}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-white font-mono">{(asset.base_npv / 1000000).toFixed(1)}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-muted">
                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${asset.risk_score > 70 ? 'bg-red-900 text-red-200' : (asset.risk_score > 40 ? 'bg-yellow-900 text-yellow-200' : 'bg-green-900 text-green-200')}`}>
                                    {asset.risk_score.toFixed(0)}
                                </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-white font-bold">{asset.composite_score.toFixed(1)}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-muted flex items-center">
                                {asset.rank_change === 'UP' && <ArrowUp size={16} className="text-green-500 mr-1" />}
                                {asset.rank_change === 'DOWN' && <ArrowDown size={16} className="text-red-500 mr-1" />}
                                {asset.rank_change === 'SAME' && <ArrowRight size={16} className="text-muted mr-1" />}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
