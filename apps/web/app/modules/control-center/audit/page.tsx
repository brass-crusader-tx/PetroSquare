"use client";

import { useEffect, useState } from 'react';
import { AuditEvent } from '@petrosquare/types';

export default function AuditPage() {
  const [events, setEvents] = useState<AuditEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/control-center/audit')
      .then(res => res.json())
      .then(setEvents)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white tracking-tight">Audit Trail</h1>
        <div className="text-sm text-slate-500 font-mono">Immutable Log</div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-lg overflow-hidden">
        <table className="w-full text-left text-slate-400">
          <thead className="bg-slate-800 text-slate-200 uppercase text-xs font-bold tracking-wider">
            <tr>
              <th className="p-4">Timestamp</th>
              <th className="p-4">Event Type</th>
              <th className="p-4">Actor</th>
              <th className="p-4">Correlation ID</th>
              <th className="p-4">Details</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800 font-mono text-sm">
            {loading ? (
              <tr><td colSpan={5} className="p-8 text-center animate-pulse">Loading Audit Log...</td></tr>
            ) : events.length === 0 ? (
              <tr><td colSpan={5} className="p-8 text-center text-slate-500">No events found</td></tr>
            ) : (
              events.map((event) => (
                <tr key={event.id} className="hover:bg-slate-800/50 transition-colors">
                  <td className="p-4 text-slate-500 whitespace-nowrap">
                    {new Date(event.timestamp).toLocaleString()}
                  </td>
                  <td className="p-4">
                    <span className="px-2 py-1 rounded text-xs font-bold bg-slate-800 text-slate-300 border border-slate-700">
                      {event.eventType}
                    </span>
                  </td>
                  <td className="p-4 text-emerald-400">{event.actorId}</td>
                  <td className="p-4 text-slate-600">{event.correlationId || '-'}</td>
                  <td className="p-4 text-xs text-slate-400 max-w-md truncate" title={JSON.stringify(event.details, null, 2)}>
                    {JSON.stringify(event.details)}
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
