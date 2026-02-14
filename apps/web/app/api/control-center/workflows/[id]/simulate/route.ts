import { NextRequest, NextResponse } from 'next/server';
import { simulateWorkflow } from '@/lib/control-center/data';

export const dynamic = 'force-dynamic';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const workflow = await simulateWorkflow(params.id);

  if (!workflow) {
    return NextResponse.json({ error: 'Workflow not found' }, { status: 404 });
  }

  return NextResponse.json(workflow);
}
