import { NextRequest, NextResponse } from 'next/server';
import { EconomicsService } from '@/lib/economics/service';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const orgId = req.headers.get('x-org-id') || 'org-001';
  const scenarios = await EconomicsService.listScenarios(orgId);
  return NextResponse.json(scenarios);
}

export async function POST(req: NextRequest) {
  try {
    const orgId = req.headers.get('x-org-id') || 'org-001';
    const userId = req.headers.get('x-user-id') || 'user-001';
    const body = await req.json();

    if (!body.name) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }

    const scenario = await EconomicsService.createScenario(orgId, userId, body.name, body.description, body.input);
    return NextResponse.json(scenario, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
