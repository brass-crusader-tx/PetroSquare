import { NextRequest, NextResponse } from 'next/server';
import { getIntelDigest } from '../../../../lib/intel/service';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const date = searchParams.get('date') || new Date().toISOString().split('T')[0];

  const digest = await getIntelDigest(date);
  return NextResponse.json({ status: 'ok', data: digest });
}
