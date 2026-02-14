import { NextRequest, NextResponse } from 'next/server';
import { getIntelTags, createIntelTag } from '../../../../lib/intel/service';

export async function GET() {
  const tags = await getIntelTags();
  return NextResponse.json({ status: 'ok', data: tags });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const tag = await createIntelTag(body.name, body.color);
  return NextResponse.json({ status: 'ok', data: tag });
}
