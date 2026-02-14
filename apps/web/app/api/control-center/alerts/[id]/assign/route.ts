import { NextRequest, NextResponse } from 'next/server';
import { updateAlert, logAuditEvent } from '@/lib/control-center/data';

export const dynamic = 'force-dynamic';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const body = await request.json();
  const assigneeId = body.assigneeId;

  if (!assigneeId) {
    return NextResponse.json({ error: 'Assignee ID required' }, { status: 400 });
  }

  const alert = await updateAlert(params.id, { assigneeId });

  if (!alert) {
    return NextResponse.json({ error: 'Alert not found' }, { status: 404 });
  }

  await logAuditEvent({
    eventType: 'ASSIGN_ALERT',
    actorId: 'current-user',
    details: { alertId: params.id, assigneeId },
    correlationId: params.id
  });

  return NextResponse.json(alert);
}
