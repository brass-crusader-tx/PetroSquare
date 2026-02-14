import { NextRequest, NextResponse } from 'next/server';
import { EconomicsService } from '@/lib/economics/service';
import { db } from '@/lib/economics/data';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const orgId = req.headers.get('x-org-id') || 'org-001';

  // Verify scenario ownership
  const scenario = await EconomicsService.getScenario(params.id);
  if (!scenario) return NextResponse.json({ error: 'Scenario not found' }, { status: 404 });
  if (scenario.org_id !== orgId) return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });

  const versions = await db.listVersions(params.id);
  return NextResponse.json(versions);
}

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const orgId = req.headers.get('x-org-id') || 'org-001';
    const userId = req.headers.get('x-user-id') || 'user-001';

    // Verify scenario ownership
    const scenario = await EconomicsService.getScenario(params.id);
    if (!scenario) return NextResponse.json({ error: 'Scenario not found' }, { status: 404 });
    if (scenario.org_id !== orgId) return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });

    const body = await req.json();

    if (!body.input) {
      return NextResponse.json({ error: 'Input configuration is required' }, { status: 400 });
    }

    const version = await EconomicsService.createVersion(params.id, userId, body.input, body.name);
    return NextResponse.json(version, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
