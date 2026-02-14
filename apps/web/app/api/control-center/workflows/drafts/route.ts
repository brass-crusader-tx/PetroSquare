import { NextRequest, NextResponse } from 'next/server';
import { createWorkflow } from '@/lib/control-center/data';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { title, description, sourceAlertId, sourceAssetId } = body;

  if (!title) {
    return NextResponse.json({ error: 'Title required' }, { status: 400 });
  }

  const workflow = await createWorkflow(
    { title, description, sourceAlertId, sourceAssetId },
    'current-user'
  );

  return NextResponse.json(workflow);
}
