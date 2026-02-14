import { NextRequest, NextResponse } from 'next/server';
import { updateAlert, logAuditEvent } from '@/lib/control-center/data';

export const dynamic = 'force-dynamic';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const alert = await updateAlert(params.id, { status: 'ACKNOWLEDGED' });

  if (!alert) {
    return NextResponse.json({ error: 'Alert not found' }, { status: 404 });
  }

  await logAuditEvent({
    eventType: 'ACK_ALERT',
    actorId: 'current-user', // In real app, get from session
    details: { alertId: params.id },
    correlationId: params.id
  });

  return NextResponse.json(alert);
}
