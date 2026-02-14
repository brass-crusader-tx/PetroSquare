import { NextRequest, NextResponse } from 'next/server';
import { GISRegistry } from '@/lib/gis/registry';

// GET /api/gis/features/[id]
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;

  const feature = await GISRegistry.getFeatureById(id);

  if (!feature) {
      return NextResponse.json({ status: 'error', message: 'Feature not found' }, { status: 404 });
  }

  return NextResponse.json({
      status: 'ok',
      data: feature
  });
}
