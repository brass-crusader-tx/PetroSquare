import { NextRequest, NextResponse } from 'next/server';
import { getIntelItems, createIntelItem } from '../../../../lib/intel/service';
import { IntelItemStatus, IntelItemType } from '@petrosquare/types';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const status = searchParams.get('status') as IntelItemStatus | undefined;
  const type = searchParams.get('type') as IntelItemType | undefined;
  const query = searchParams.get('query') || undefined;
  const tag = searchParams.get('tag') || undefined;
  const entity = searchParams.get('entity') || undefined;

  const items = await getIntelItems({ status, type, query, tag, entity });

  return NextResponse.json({
    status: 'ok',
    data: items,
    provenance: {
        source_name: 'PetroSquare Intel Service',
        source_url: request.url,
        retrieved_at: new Date().toISOString()
    }
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const item = await createIntelItem(body, 'user-1'); // Mock user

    return NextResponse.json({
        status: 'ok',
        data: item
    });
  } catch (e: any) {
      return NextResponse.json({ status: 'error', error: { message: e.message } }, { status: 400 });
  }
}
