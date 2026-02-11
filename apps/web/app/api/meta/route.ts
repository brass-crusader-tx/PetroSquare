import { NextResponse } from 'next/server';
import { SystemMeta } from '@petrosquare/types';

export async function GET() {
  const meta: SystemMeta = {
    version: '1.0.0',
    build: process.env.NEXT_PUBLIC_BUILD_ID || 'dev-build',
    commit: process.env.NEXT_PUBLIC_COMMIT_SHA || 'HEAD',
    region: process.env.REGION || 'us-east-1',
  };
  return NextResponse.json(meta);
}
