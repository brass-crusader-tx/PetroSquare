import { NextResponse } from 'next/server';
import { getAuditLog } from '@/lib/control-center/data';

export const dynamic = 'force-dynamic';

export async function GET() {
  const logs = await getAuditLog();
  return NextResponse.json(logs);
}
