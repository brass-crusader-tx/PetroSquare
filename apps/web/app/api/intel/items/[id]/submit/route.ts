import { NextRequest, NextResponse } from 'next/server';
import { submitIntelItem } from '../../../../../../lib/intel/service';

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  const item = await submitIntelItem(params.id);
  if (!item) {
    return NextResponse.json({ status: 'error', error: { message: 'Item not found' } }, { status: 404 });
  }
  return NextResponse.json({ status: 'ok', data: item });
}
