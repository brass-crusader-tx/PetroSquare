import { NextRequest, NextResponse } from 'next/server';
import { getIntelEntities } from '../../../../lib/intel/service';

export async function GET() {
  const entities = await getIntelEntities();
  return NextResponse.json({ status: 'ok', data: entities });
}
