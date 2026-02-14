import React from 'react';
import { DataPanel, KpiCard, Badge } from '@petrosquare/ui';
import { WatchlistEvent, Issue } from '@petrosquare/types';
import { useData } from '../../../../lib/hooks';

export function RiskDashboard() {
    const { data: feed, loading: loadingFeed } = useData<WatchlistEvent[]>('/api/risk/feed');
    const { data: issues, loading: loadingIssues } = useData<Issue[]>('/api/risk/issues');

    // Calculate metrics
    const openIssues = issues?.filter(i => i.status === 'OPEN' || i.status === 'IN_PROGRESS').length || 0;
    const criticalIssues = issues?.filter(i => i.severity === 'CRITICAL' && i.status !== 'CLOSED').length || 0;

    // Mock Compliance Score (could be aggregated from assessments)
    const complianceScore = 85;

    return (
        <div className="space-y-6">
            {/* KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <KpiCard label="Compliance Score" value={`${complianceScore}%`} trend="positive" />
                <KpiCard label="Open Issues" value={openIssues} trend="neutral" />
                <KpiCard label="Critical Risks" value={criticalIssues} trend={criticalIssues > 0 ? 'negative' : 'positive'} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Activity Feed */}
                <DataPanel title="Regulatory & Risk Feed" loading={loadingFeed}>
                    <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
                        {feed?.map(event => (
                            <div key={event.id} className="border-b border-border pb-3 last:border-0 last:pb-0">
                                <div className="flex justify-between items-start mb-1">
                                    <Badge status={event.severity === 'HIGH' || event.severity === 'CRITICAL' ? 'critical' : 'live'}>
                                        {event.type.replace('_', ' ')}
                                    </Badge>
                                    <span className="text-[10px] text-muted font-mono">{new Date(event.created_at).toLocaleDateString()}</span>
                                </div>
                                <p className="text-sm text-white mt-1">{event.summary}</p>
                                {event.regulation_id && (
                                    <div className="text-[10px] text-primary mt-1 font-mono uppercase">
                                        Ref: {event.regulation_id}
                                    </div>
                                )}
                            </div>
                        ))}
                        {!loadingFeed && (!feed || feed.length === 0) && (
                            <div className="text-sm text-muted text-center py-4">No recent events.</div>
                        )}
                    </div>
                </DataPanel>

                {/* Priority Issues (placeholder for now, or fetch top 5) */}
                <DataPanel title="Priority Issues" loading={loadingIssues}>
                    <div className="space-y-2">
                         {issues?.slice(0, 5).map(issue => (
                             <div key={issue.id} className="bg-surface-highlight/10 p-3 rounded border border-border flex justify-between items-center">
                                 <div>
                                     <div className="text-sm font-medium text-white">{issue.title}</div>
                                     <div className="text-xs text-muted">{issue.asset_id} • {issue.status}</div>
                                 </div>
                                 <Badge status={issue.severity === 'CRITICAL' ? 'critical' : issue.severity === 'HIGH' ? 'warning' : 'neutral'}>
                                     {issue.severity}
                                 </Badge>
                             </div>
                         ))}
                         {!loadingIssues && (!issues || issues.length === 0) && (
                             <div className="text-sm text-muted text-center py-4">No open issues.</div>
                         )}
                    </div>
                </DataPanel>
            </div>
        </div>
    );
}
