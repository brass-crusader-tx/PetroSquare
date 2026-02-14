"use client";

import { useState } from 'react';
import { Alert } from '@petrosquare/types';
import { Button } from '@petrosquare/ui';

interface ActionButtonsProps {
  alert: Alert;
  onUpdate: () => void;
  onWorkflowStart: (alert: Alert) => void;
}

export function ActionButtons({ alert, onUpdate, onWorkflowStart }: ActionButtonsProps) {
  const [loading, setLoading] = useState(false);

  const handleAck = async () => {
    setLoading(true);
    try {
      await fetch(`/api/control-center/alerts/${alert.id}/ack`, { method: 'POST' });
      onUpdate();
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleAssign = async () => {
    setLoading(true);
    try {
      // Mock assignment to current user
      await fetch(`/api/control-center/alerts/${alert.id}/assign`, {
        method: 'POST',
        body: JSON.stringify({ assigneeId: 'current-user' }),
        headers: { 'Content-Type': 'application/json' }
      });
      onUpdate();
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (alert.status === 'RESOLVED') return <span className="text-slate-500 text-sm">Resolved</span>;

  return (
    <div className="flex gap-2">
      {alert.status === 'ACTIVE' && (
        <Button variant="secondary" onClick={handleAck} disabled={loading} className="text-sm py-1 px-3">
          Ack
        </Button>
      )}
      {!alert.assigneeId && (
        <Button variant="secondary" onClick={handleAssign} disabled={loading} className="text-sm py-1 px-3">
          Assign to Me
        </Button>
      )}
      <Button variant="primary" onClick={() => onWorkflowStart(alert)} className="text-sm py-1 px-3">
        Create Workflow
      </Button>
    </div>
  );
}
