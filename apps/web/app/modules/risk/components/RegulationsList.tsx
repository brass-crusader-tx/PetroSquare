import React, { useState } from 'react';
import { DataPanel, Badge, DetailDrawer } from '@petrosquare/ui';
import { Regulation, RegulationVersion } from '@petrosquare/types';
import { useData } from '../../../../lib/hooks';

export function RegulationsList() {
    const { data: regulations, loading } = useData<Regulation[]>('/api/risk/regulations');
    const [selectedReg, setSelectedReg] = useState<Regulation | null>(null);

    return (
        <>
            <DataPanel title="Regulations Library" loading={loading}>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-muted uppercase bg-surface-highlight/20">
                            <tr>
                                <th className="px-4 py-3 border-b border-border">Title</th>
                                <th className="px-4 py-3 border-b border-border">Jurisdiction</th>
                                <th className="px-4 py-3 border-b border-border">Status</th>
                                <th className="px-4 py-3 border-b border-border">Effective Date</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border/50">
                            {regulations?.map(reg => (
                                <tr
                                    key={reg.id}
                                    onClick={() => setSelectedReg(reg)}
                                    className="hover:bg-surface-highlight/10 cursor-pointer transition-colors"
                                >
                                    <td className="px-4 py-3 font-medium text-white">{reg.title}</td>
                                    <td className="px-4 py-3 text-muted font-mono">{reg.jurisdiction_id}</td>
                                    <td className="px-4 py-3">
                                        <Badge status={reg.status === 'active' ? 'live' : reg.status === 'pending' ? 'warning' : 'neutral'}>
                                            {reg.status}
                                        </Badge>
                                    </td>
                                    <td className="px-4 py-3 text-muted font-mono">{reg.effective_date}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </DataPanel>

            <DetailDrawer
                isOpen={!!selectedReg}
                onClose={() => setSelectedReg(null)}
                title={selectedReg?.title || ''}
                subtitle={selectedReg?.jurisdiction_id}
                source="Regulatory Database"
                timestamp={selectedReg?.updated_at}
                tabs={[
                    {
                        id: 'overview',
                        label: 'Overview',
                        content: (
                            <div className="space-y-4">
                                <p className="text-sm text-white leading-relaxed">{selectedReg?.description}</p>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-surface-highlight/10 p-3 rounded border border-border">
                                        <div className="text-xs text-muted uppercase">Status</div>
                                        <div className="text-sm font-medium text-white mt-1 capitalize">{selectedReg?.status}</div>
                                    </div>
                                    <div className="bg-surface-highlight/10 p-3 rounded border border-border">
                                        <div className="text-xs text-muted uppercase">Effective Date</div>
                                        <div className="text-sm font-medium text-white mt-1">{selectedReg?.effective_date}</div>
                                    </div>
                                </div>
                            </div>
                        )
                    },
                    {
                        id: 'versions',
                        label: 'History & Versions',
                        content: selectedReg ? <RegulationVersionsTab regId={selectedReg.id} /> : null
                    }
                ]}
            />
        </>
    );
}

function RegulationVersionsTab({ regId }: { regId: string }) {
    const { data: versions, loading } = useData<RegulationVersion[]>(`/api/risk/regulations/${regId}/versions`);

    if (loading) return <div className="text-sm text-muted">Loading versions...</div>;

    return (
        <div className="space-y-4">
            {versions?.sort((a,b) => b.version - a.version).map(v => (
                <div key={v.id} className="border border-border rounded p-3 bg-surface-highlight/5">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-bold text-white">Version {v.version}</span>
                        <span className="text-xs text-muted font-mono">{new Date(v.created_at).toLocaleDateString()}</span>
                    </div>
                    <div className="text-xs text-primary font-mono mb-2 uppercase tracking-wide">Changes</div>
                    <p className="text-sm text-muted">{v.changes_summary}</p>
                </div>
            ))}
        </div>
    );
}
