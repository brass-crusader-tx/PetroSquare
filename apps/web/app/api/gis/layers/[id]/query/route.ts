import { NextRequest, NextResponse } from 'next/server';
import { GISRegistry } from '@/lib/gis/registry';

// POST /api/gis/layers/[id]/query
export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;

  try {
      const body = await request.json();
      const { polygon, radius, limit } = body;

      const options: any = { limit };
      if (polygon && Array.isArray(polygon)) {
          options.polygon = polygon;
      }
      if (radius && radius.center && radius.km) {
          options.radius = radius;
      }

      const features = await GISRegistry.getFeatures(id, options);
      return NextResponse.json({
          status: 'ok',
          count: features.length,
          data: features
      });

  } catch (e) {
      console.error(e);
      return NextResponse.json({ status: 'error', message: 'Query failed' }, { status: 500 });
  }
}
