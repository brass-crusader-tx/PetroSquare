import { NextRequest, NextResponse } from 'next/server';
import { getIntelItemById, updateIntelItem, deleteIntelItem } from '../../../../../lib/intel/service';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const item = await getIntelItemById(params.id);
  if (!item) {
    return NextResponse.json({ status: 'error', error: { message: 'Item not found' } }, { status: 404 });
  }
  return NextResponse.json({ status: 'ok', data: item });
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json();
    const item = await updateIntelItem(params.id, body);
    if (!item) {
        return NextResponse.json({ status: 'error', error: { message: 'Item not found' } }, { status: 404 });
    }
    return NextResponse.json({ status: 'ok', data: item });
  } catch (e: any) {
    return NextResponse.json({ status: 'error', error: { message: e.message } }, { status: 400 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
    const success = await deleteIntelItem(params.id);
    if (!success) return NextResponse.json({ status: 'error', error: { message: 'Item not found' } }, { status: 404 });
    return NextResponse.json({ status: 'ok', data: { success: true } });
}
