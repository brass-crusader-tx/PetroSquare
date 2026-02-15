"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Alert } from '@petrosquare/types';
import { Select } from '@petrosquare/ui';
import { ActionButtons } from '../components/ActionButtons';
import { WorkflowManager } from '../components/WorkflowManager';

export default function AlertsPage() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [severityFilter, setSeverityFilter] = useState('ALL');
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);

  const fetchAlerts = () => {
    setLoading(true);
    let url = `/api/control-center/alerts?`;
    if (statusFilter !== 'ALL') url += `status=${statusFilter}&`;
    if (severityFilter !== 'ALL') url += `severity=${severityFilter}&`;

    fetch(url)
      .then(res => res.json())
      .then(setAlerts)
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchAlerts();
  }, [statusFilter, severityFilter]);

  const statusOptions = [
    { value: 'ALL', label: 'All Status' },
    { value: 'ACTIVE', label: 'Active' },
    { value: 'ACKNOWLEDGED', label: 'Acknowledged' },
    { value: 'RESOLVED', label: 'Resolved' },
  ];

  const severityOptions = [
    { value: 'ALL', label: 'All Severity' },
    { value: 'CRITICAL', label: 'Critical' },
    { value: 'HIGH', label: 'High' },
    { value: 'MEDIUM', label: 'Medium' },
    { value: 'LOW', label: 'Low' },
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white tracking-tight">Alerts Center</h1>
        <div className="flex space-x-4">
          <div className="w-48">
            <Select
              value={statusFilter}
              onChange={setStatusFilter}
              options={statusOptions}
            />
          </div>
          <div className="w-48">
             <Select
              value={severityFilter}
              onChange={setSeverityFilter}
              options={severityOptions}
            />
          </div>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-lg overflow-hidden">
        <table className="w-full text-left text-slate-400">
          <thead className="bg-slate-800 text-slate-200 uppercase text-xs font-bold tracking-wider">
            <tr>
              <th className="p-4">Severity</th>
              <th className="p-4">Alert</th>
              <th className="p-4">Asset</th>
              <th className="p-4">Time</th>
              <th className="p-4">Status</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {loading ? (
              <tr><td colSpan={6} className="p-8 text-center animate-pulse">Loading Alerts...</td></tr>
            ) : alerts.length === 0 ? (
              <tr><td colSpan={6} className="p-8 text-center text-slate-500">No alerts found</td></tr>
            ) : (
              alerts.map((alert) => (
                <tr key={alert.id} className="hover:bg-slate-800/50 transition-colors">
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded text-xs font-bold ${
                      alert.severity === 'CRITICAL' ? 'bg-red-900/30 text-red-400 border border-red-900 animate-pulse' :
                      alert.severity === 'HIGH' ? 'bg-orange-900/30 text-orange-400 border border-orange-900' :
                      alert.severity === 'MEDIUM' ? 'bg-yellow-900/30 text-yellow-400 border border-yellow-900' :
                      'bg-slate-800 text-slate-400'
                    }`}>
                      {alert.severity}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="font-medium text-white">{alert.title}</div>
                    <div className="text-xs text-slate-500 mt-1">{alert.description}</div>
                  </td>
                  <td className="p-4">
                    <Link href={`/modules/control-center/assets/${alert.assetId}`} className="text-emerald-400 hover:underline text-sm font-medium">
                      {alert.assetName}
                    </Link>
                  </td>
                  <td className="p-4 text-sm font-mono text-slate-500">
                    {new Date(alert.timestamp).toLocaleString()}
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded text-xs font-bold ${
                      alert.status === 'ACTIVE' ? 'bg-blue-900/30 text-blue-400 border border-blue-900' :
                      alert.status === 'ACKNOWLEDGED' ? 'bg-indigo-900/30 text-indigo-400 border border-indigo-900' :
                      'bg-slate-800 text-slate-500 border border-slate-700'
                    }`}>
                      {alert.status}
                    </span>
                    {alert.assigneeId && <div className="text-xs text-slate-500 mt-1">By: {alert.assigneeId}</div>}
                  </td>
                  <td className="p-4">
                    <ActionButtons
                      alert={alert}
                      onUpdate={fetchAlerts}
                      onWorkflowStart={setSelectedAlert}
                    />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <WorkflowManager
        isOpen={!!selectedAlert}
        onClose={() => setSelectedAlert(null)}
        contextAlert={selectedAlert}
        onCommit={() => {
            fetchAlerts();
            setSelectedAlert(null);
        }}
      />
    </div>
  );
}
