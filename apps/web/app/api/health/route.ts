import { NextResponse } from 'next/server';
import { SystemHealth } from '@petrosquare/types';

export async function GET() {
  const health: SystemHealth = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    env: process.env.NODE_ENV || 'development',
  };
  return NextResponse.json(health);
}
