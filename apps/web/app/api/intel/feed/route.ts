import { NextRequest, NextResponse } from 'next/server';
import { getIntelFeed } from '../../../../lib/intel/service';

export async function GET(request: NextRequest) {
  const feed = await getIntelFeed();
  return NextResponse.json({ status: 'ok', data: feed });
}
