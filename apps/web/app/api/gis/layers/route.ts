import { NextRequest, NextResponse } from 'next/server';
import { GISRegistry } from '@/lib/gis/registry';

// GET /api/gis/layers
export async function GET(request: NextRequest) {
  // In a real app, we'd check auth here
  const orgId = 'org-1';
  const layers = await GISRegistry.getLayers(orgId);
  return NextResponse.json({ status: 'ok', data: layers });
}

// POST /api/gis/layers
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    // Validate body (minimal check)
    if (!body.name || !body.type) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const newLayer = {
        ...body,
        id: `l-${Date.now()}`,
        org_id: 'org-1',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
    };

    await GISRegistry.addLayer(newLayer);
    return NextResponse.json({ status: 'ok', data: newLayer });
  } catch (e) {
    return NextResponse.json({ error: 'Invalid Request' }, { status: 400 });
  }
}
