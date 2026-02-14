import { NextResponse } from 'next/server';
import { getOverviewKPIs } from '@/lib/control-center/data';

export const dynamic = 'force-dynamic';

export async function GET() {
  const data = await getOverviewKPIs();
  return NextResponse.json({
    ...data,
    timestamp: new Date().toISOString()
  });
}
