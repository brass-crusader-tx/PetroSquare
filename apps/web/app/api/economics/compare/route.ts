import { NextRequest, NextResponse } from 'next/server';
import { EconomicsService } from '@/lib/economics/service';
import { db } from '@/lib/economics/data';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const orgId = req.headers.get('x-org-id') || 'org-001';
  const versionAId = req.nextUrl.searchParams.get('versionA');
  const versionBId = req.nextUrl.searchParams.get('versionB');

  if (!versionAId || !versionBId) {
    return NextResponse.json({ error: 'versionA and versionB parameters required' }, { status: 400 });
  }

  const [verA, verB] = await Promise.all([
    db.getVersion(versionAId),
    db.getVersion(versionBId)
  ]);

  if (!verA || !verB) {
    return NextResponse.json({ error: 'One or both versions not found' }, { status: 404 });
  }

  // Check ownership
  const [scenA, scenB] = await Promise.all([
    db.getScenario(verA.scenario_id),
    db.getScenario(verB.scenario_id)
  ]);

  if (scenA?.org_id !== orgId || scenB?.org_id !== orgId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  const [runsA, runsB] = await Promise.all([
    db.listRuns(versionAId),
    db.listRuns(versionBId)
  ]);

  // Return versions and their latest completed run results
  const latestRunA = runsA.find(r => r.status === 'COMPLETED');
  const latestRunB = runsB.find(r => r.status === 'COMPLETED');

  return NextResponse.json({
    versionA: {
      ...verA,
      run: latestRunA
    },
    versionB: {
      ...verB,
      run: latestRunB
    }
  });
}
