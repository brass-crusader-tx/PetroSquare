import { NextRequest, NextResponse } from 'next/server';
import { approveIntelItem } from '../../../../../../lib/intel/service';

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  const body = await request.json().catch(() => ({})); // Optional body
  const item = await approveIntelItem(params.id, 'user-2', body.comments); // Mock reviewer
  if (!item) {
    return NextResponse.json({ status: 'error', error: { message: 'Item not found' } }, { status: 404 });
  }
  return NextResponse.json({ status: 'ok', data: item });
}
