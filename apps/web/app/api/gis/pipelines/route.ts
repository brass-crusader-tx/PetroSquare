import { NextRequest, NextResponse } from 'next/server';
import { fetchPipelines } from '../../../../lib/gis/pipelines';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const bbox = searchParams.get('bbox');

  if (!bbox) {
    return NextResponse.json({ error: 'Missing bbox parameter' }, { status: 400 });
  }

  const data = await fetchPipelines(bbox);
  return NextResponse.json(data);
}
