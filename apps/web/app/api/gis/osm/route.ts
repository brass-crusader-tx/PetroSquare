import { NextRequest, NextResponse } from 'next/server';
import { fetchWells } from '../../../../lib/gis/overpass';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const bbox = searchParams.get('bbox');

  if (!bbox) {
    return NextResponse.json({ error: 'Missing bbox parameter' }, { status: 400 });
  }

  const data = await fetchWells(bbox);
  return NextResponse.json(data);
}
