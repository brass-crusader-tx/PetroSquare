import { NextResponse } from 'next/server';
import type { HealthResponse } from '@petrosquare/types';

export const dynamic = 'force-dynamic';

export async function GET() {
  const response: HealthResponse = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
  };
  return NextResponse.json(response);
}
