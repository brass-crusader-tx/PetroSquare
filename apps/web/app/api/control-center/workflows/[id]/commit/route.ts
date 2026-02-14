import { NextRequest, NextResponse } from 'next/server';
import { commitWorkflow } from '@/lib/control-center/data';

export const dynamic = 'force-dynamic';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const workflow = await commitWorkflow(params.id, 'current-user');

  if (!workflow) {
    return NextResponse.json({ error: 'Workflow not found' }, { status: 404 });
  }

  return NextResponse.json(workflow);
}
