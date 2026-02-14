import { NextRequest, NextResponse } from 'next/server';
import { EconomicsService } from '@/lib/economics/service';
import { db } from '@/lib/economics/data';

export const dynamic = 'force-dynamic';

async function checkAccess(versionId: string, orgId: string): Promise<boolean> {
  const version = await db.getVersion(versionId);
  if (!version) return false;
  const scenario = await db.getScenario(version.scenario_id);
  return scenario?.org_id === orgId;
}

export async function POST(req: NextRequest, { params }: { params: { versionId: string } }) {
  try {
    const orgId = req.headers.get('x-org-id') || 'org-001';
    const userId = req.headers.get('x-user-id') || 'user-001';

    if (!(await checkAccess(params.versionId, orgId))) {
      return NextResponse.json({ error: 'Unauthorized or Version not found' }, { status: 403 });
    }

    const run = await EconomicsService.runSimulation(params.versionId, userId);
    return NextResponse.json(run, { status: 202 }); // Accepted
  } catch (error: any) {
    if (error.message === 'Version not found') {
      return NextResponse.json({ error: error.message }, { status: 404 });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET(req: NextRequest, { params }: { params: { versionId: string } }) {
  const orgId = req.headers.get('x-org-id') || 'org-001';

  if (!(await checkAccess(params.versionId, orgId))) {
      return NextResponse.json({ error: 'Unauthorized or Version not found' }, { status: 403 });
  }

  const runs = await EconomicsService.getRunsForVersion(params.versionId);
  return NextResponse.json(runs);
}
