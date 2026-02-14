import { NextRequest, NextResponse } from 'next/server';
import { getAlerts } from '@/lib/control-center/data';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const status = searchParams.get('status') || undefined;
  const severity = searchParams.get('severity') || undefined;
  const assetId = searchParams.get('assetId') || undefined;

  const alerts = await getAlerts(status, severity, assetId);
  return NextResponse.json(alerts);
}
