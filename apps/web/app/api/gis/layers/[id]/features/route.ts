import { NextRequest, NextResponse } from 'next/server';
import { GISRegistry } from '@/lib/gis/registry';
import { checkRateLimit, log } from '@/lib/gis/observability';

// GET /api/gis/layers/[id]/features
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;

  // Rate Limit
  const ip = request.headers.get('x-forwarded-for') || 'unknown';
  if (!checkRateLimit(ip)) {
      log('warn', 'Rate limit exceeded', { ip, path: request.nextUrl.pathname });
      return NextResponse.json({ status: 'error', message: 'Too many requests' }, { status: 429 });
  }

  const searchParams = request.nextUrl.searchParams;

  const bboxStr = searchParams.get('bbox');
  const zoomStr = searchParams.get('zoom');
  const limitStr = searchParams.get('limit');
  const offsetStr = searchParams.get('offset');

  let bbox: [number, number, number, number] | undefined;
  if (bboxStr) {
      const parts = bboxStr.split(',').map(Number);
      if (parts.length === 4 && !parts.some(isNaN)) {
          bbox = parts as [number, number, number, number];
      }
  }

  const zoom = zoomStr ? parseInt(zoomStr, 10) : undefined;
  const limit = limitStr ? parseInt(limitStr, 10) : undefined;
  const offset = offsetStr ? parseInt(offsetStr, 10) : undefined;

  try {
      const features = await GISRegistry.getFeatures(id, { bbox, zoom, limit, offset });
      return NextResponse.json({
          status: 'ok',
          count: features.length,
          data: features
      });
  } catch (e) {
      console.error(e);
      return NextResponse.json({ status: 'error', message: 'Failed to fetch features' }, { status: 500 });
  }
}
