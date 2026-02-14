import { NextRequest, NextResponse } from 'next/server';
import { EconomicsService } from '@/lib/economics/service';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const orgId = req.headers.get('x-org-id') || 'org-001';
  const scenario = await EconomicsService.getScenario(params.id);

  if (!scenario) {
    return NextResponse.json({ error: 'Scenario not found' }, { status: 404 });
  }

  if (scenario.org_id !== orgId) {
    return NextResponse.json({ error: 'Unauthorized access to scenario' }, { status: 403 });
  }

  return NextResponse.json(scenario);
}

// Implement PUT if needed for updating basic info
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  // TODO: implement update logic in Service and here
  return NextResponse.json({ status: 'Not implemented' }, { status: 501 });
}
