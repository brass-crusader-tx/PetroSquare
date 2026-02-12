import { NextResponse } from 'next/server';
import type { MetaResponse } from '@petrosquare/types';

export const dynamic = 'force-dynamic';

export async function GET() {
  const response: MetaResponse = {
    version: '1.0.0',
    commit: process.env.VERCEL_GIT_COMMIT_SHA || 'local-dev',
    environment: process.env.VERCEL_ENV || 'development',
    timestamp: new Date().toISOString(),
  };
  return NextResponse.json(response);
}
