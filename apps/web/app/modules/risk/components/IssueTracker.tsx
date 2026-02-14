import React, { useState } from 'react';
import { DataPanel, Badge, Button } from '@petrosquare/ui';
import { Issue } from '@petrosquare/types';
import { useData } from '../../../../lib/hooks';

export function IssueTracker() {
    const { data: issues, loading, mutate } = useData<Issue[]>('/api/risk/issues');
    const [filter, setFilter] = useState<'ALL' | 'OPEN' | 'CLOSED'>('ALL');

    const filteredIssues = issues?.filter(i => {
        if (filter === 'ALL') return true;
        if (filter === 'OPEN') return i.status === 'OPEN' || i.status === 'IN_PROGRESS';
        if (filter === 'CLOSED') return i.status === 'CLOSED' || i.status === 'RESOLVED';
        return true;
    });

    const handleCreate = async () => {
        // MVP: Stub creation via prompt
        const title = prompt("Issue Title:");
        if (!title) return;

        await fetch('/api/risk/issues', {
            method: 'POST',
            body: JSON.stringify({
                title,
                asset_id: 'well-01', // stub
                severity: 'MEDIUM',
                status: 'OPEN',
                description: 'Created from Issue Tracker'
            })
        });
        mutate();
    };

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <div className="flex space-x-2">
                    <button
                        onClick={() => setFilter('ALL')}
                        className={`px-3 py-1 text-xs font-bold rounded ${filter === 'ALL' ? 'bg-primary text-white' : 'bg-surface-highlight/10 text-muted hover:text-white'}`}
                    >
                        ALL
                    </button>
                    <button
                        onClick={() => setFilter('OPEN')}
                        className={`px-3 py-1 text-xs font-bold rounded ${filter === 'OPEN' ? 'bg-primary text-white' : 'bg-surface-highlight/10 text-muted hover:text-white'}`}
                    >
                        OPEN
                    </button>
                    <button
                        onClick={() => setFilter('CLOSED')}
                        className={`px-3 py-1 text-xs font-bold rounded ${filter === 'CLOSED' ? 'bg-primary text-white' : 'bg-surface-highlight/10 text-muted hover:text-white'}`}
                    >
                        CLOSED
                    </button>
                </div>
                <Button size="sm" onClick={handleCreate}>+ New Issue</Button>
            </div>

            <DataPanel title="Risk Issues & Tasks" loading={loading}>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-muted uppercase bg-surface-highlight/20">
                            <tr>
                                <th className="px-4 py-3 border-b border-border">Title</th>
                                <th className="px-4 py-3 border-b border-border">Asset</th>
                                <th className="px-4 py-3 border-b border-border">Severity</th>
                                <th className="px-4 py-3 border-b border-border">Status</th>
                                <th className="px-4 py-3 border-b border-border">Due Date</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border/50">
                            {filteredIssues?.map(issue => (
                                <tr key={issue.id} className="hover:bg-surface-highlight/5 transition-colors">
                                    <td className="px-4 py-3 font-medium text-white">{issue.title}</td>
                                    <td className="px-4 py-3 text-muted font-mono">{issue.asset_id}</td>
                                    <td className="px-4 py-3">
                                        <Badge status={issue.severity === 'CRITICAL' ? 'critical' : issue.severity === 'HIGH' ? 'warning' : 'neutral'}>
                                            {issue.severity}
                                        </Badge>
                                    </td>
                                    <td className="px-4 py-3">
                                        <Badge status={issue.status === 'OPEN' ? 'live' : issue.status === 'CLOSED' ? 'neutral' : 'warning'}>
                                            {issue.status}
                                        </Badge>
                                    </td>
                                    <td className="px-4 py-3 text-muted font-mono">{issue.due_date || '-'}</td>
                                </tr>
                            ))}
                            {!loading && (!filteredIssues || filteredIssues.length === 0) && (
                                <tr>
                                    <td colSpan={5} className="px-4 py-8 text-center text-muted">No issues found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </DataPanel>
        </div>
    );
}
