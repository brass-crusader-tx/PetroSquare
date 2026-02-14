import { NextRequest, NextResponse } from 'next/server';
import { assistQuery, logAuditEvent } from '@/lib/control-center/data';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { query } = body;

  if (!query) {
    return NextResponse.json({ error: 'Query required' }, { status: 400 });
  }

  const response = await assistQuery(query);

  // Log the interaction
  await logAuditEvent({
    eventType: 'SYSTEM_CHANGE', // Reusing type, or could add 'ASSIST_QUERY'
    actorId: 'current-user',
    details: { query, confidence: response.confidence },
  });

  return NextResponse.json(response);
}
