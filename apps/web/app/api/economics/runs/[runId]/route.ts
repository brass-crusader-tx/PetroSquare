import { NextRequest, NextResponse } from 'next/server';
import { EconomicsService } from '@/lib/economics/service';
import { db } from '@/lib/economics/data';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest, { params }: { params: { runId: string } }) {
  const orgId = req.headers.get('x-org-id') || 'org-001';
  const run = await EconomicsService.getRun(params.runId);

  if (!run) {
    return NextResponse.json({ error: 'Run not found' }, { status: 404 });
  }

  // Check ownership
  const version = await db.getVersion(run.scenario_version_id);
  if (version) {
      const scenario = await db.getScenario(version.scenario_id);
      if (scenario && scenario.org_id !== orgId) {
          return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
      }
  }

  return NextResponse.json(run);
}
