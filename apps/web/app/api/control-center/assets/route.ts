import { NextRequest, NextResponse } from 'next/server';
import { getAssets } from '@/lib/control-center/data';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get('query') || undefined;
  const status = searchParams.get('status') || undefined;

  const assets = await getAssets(query, status);
  return NextResponse.json(assets);
}
