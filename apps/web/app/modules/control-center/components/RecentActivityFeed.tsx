"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Alert, AuditEvent } from '@petrosquare/types';
import { Badge } from '@petrosquare/ui';

interface ActivityItem {
  id: string;
  type: 'ALERT' | 'AUDIT';
  title: string;
  description?: string;
  timestamp: string;
  severity?: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW'; // For Alerts
  status?: string; // For Alerts
  eventType?: string; // For Audit
}

export default function RecentActivityFeed() {
  const [items, setItems] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [alertsRes, auditRes] = await Promise.all([
          fetch('/api/control-center/alerts'),
          fetch('/api/control-center/audit')
        ]);

        const alerts: Alert[] = await alertsRes.json();
        const auditLogs: AuditEvent[] = await auditRes.json();

        const alertItems: ActivityItem[] = alerts.map(a => ({
          id: a.id,
          type: 'ALERT',
          title: a.title,
          description: a.description,
          timestamp: a.timestamp,
          severity: a.severity,
          status: a.status
        }));

        const auditItems: ActivityItem[] = auditLogs.map(a => ({
          id: a.id,
          type: 'AUDIT',
          title: formatAuditTitle(a),
          description: formatAuditDescription(a),
          timestamp: a.timestamp,
          eventType: a.eventType
        }));

        const combined = [...alertItems, ...auditItems].sort((a, b) =>
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        );

        setItems(combined.slice(0, 5));
      } catch (e) {
        console.error("Failed to fetch recent activity", e);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const formatAuditTitle = (event: AuditEvent) => {
    switch (event.eventType) {
      case 'ACK_ALERT': return 'Alert Acknowledged';
      case 'ASSIGN_ALERT': return 'Alert Assigned';
      case 'CREATE_WORKFLOW': return 'Workflow Created';
      case 'COMMIT_WORKFLOW': return 'Workflow Committed';
      case 'LOGIN': return 'User Login';
      case 'SYSTEM_CHANGE': return 'System Change';
      default: return (event.eventType as string).replace(/_/g, ' ');
    }
  };

  const formatAuditDescription = (event: AuditEvent) => {
    if (event.details && typeof event.details === 'object') {
        const details = event.details as any;
        if (details.message) return details.message;
        if (details.workflowId) return `Workflow ID: ${details.workflowId}`;
        return JSON.stringify(details);
    }
    return '';
  };

  const getStatusColor = (status: string) => {
      switch (status) {
          case 'ACTIVE': return 'warning';
          case 'RESOLVED': return 'live';
          case 'ACKNOWLEDGED': return 'simulated';
          default: return status;
      }
  };

  if (loading) return (
      <div className="h-64 flex items-center justify-center">
        <div className="text-muted text-sm animate-pulse">Loading Activity...</div>
      </div>
  );

  if (items.length === 0) return (
      <div className="h-64 flex items-center justify-center">
        <div className="text-muted text-sm italic">No recent activity</div>
      </div>
  );

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 overflow-y-auto pr-1 space-y-2 max-h-[300px]">
        {items.map(item => (
          <div key={item.id} className="flex gap-3 p-3 rounded-xl bg-surface-highlight/5 border border-white/5 hover:bg-surface-highlight/10 transition-colors group">
            <div className="mt-1.5 flex-shrink-0">
              {item.type === 'ALERT' ? (
                <div className={`w-2.5 h-2.5 rounded-full ring-2 ring-white/5 ${
                  item.severity === 'CRITICAL' ? 'bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.6)] animate-pulse' :
                  item.severity === 'HIGH' ? 'bg-orange-500' :
                  item.severity === 'MEDIUM' ? 'bg-amber-500' : 'bg-blue-500'
                }`} />
              ) : (
                <div className="w-2.5 h-2.5 rounded-full bg-slate-500 ring-2 ring-white/5" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-start mb-0.5">
                <span className="text-sm font-medium text-white truncate group-hover:text-emerald-400 transition-colors">{item.title}</span>
                <span className="text-[10px] text-muted font-mono whitespace-nowrap ml-2 opacity-60">
                  {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>

              <p className="text-xs text-muted/80 line-clamp-1 mb-2">{item.description}</p>

              {item.type === 'ALERT' && (
                 <div className="flex items-center gap-2">
                    <Badge status={getStatusColor(item.status || 'ACTIVE')} className="text-[9px] py-0 px-1.5 h-5">
                        {item.status}
                    </Badge>
                    {item.severity && (
                        <span className="text-[9px] font-bold text-muted/60 uppercase tracking-wider border border-white/5 px-1.5 py-0.5 rounded bg-surface/50">
                            {item.severity}
                        </span>
                    )}
                 </div>
              )}
              {item.type === 'AUDIT' && (
                  <div className="flex items-center">
                      <span className="text-[9px] font-mono text-muted/60 bg-surface/50 border border-white/5 px-1.5 py-0.5 rounded uppercase">
                          {item.eventType}
                      </span>
                  </div>
              )}
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 pt-3 border-t border-white/5 flex justify-end">
        <Link href="/modules/control-center/alerts" className="text-xs font-medium text-emerald-400 hover:text-emerald-300 transition-colors flex items-center gap-1 group">
          View All Activity
          <span className="group-hover:translate-x-0.5 transition-transform" aria-hidden="true">→</span>
        </Link>
      </div>
    </div>
  );
}
