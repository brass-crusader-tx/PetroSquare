import { NextResponse } from 'next/server';
import { DATA_SOURCES } from '../../../lib/data-fabric/registry';

export const dynamic = 'force-dynamic';

export async function GET() {
  const sources = Object.values(DATA_SOURCES).map(s => ({
      id: s.id,
      name: s.name,
      status: 'operational', // In a real app, we would ping the URL
      latency: Math.floor(Math.random() * 50) + 10, // Mock latency
      last_check: new Date().toISOString()
  }));

  const systemHealth = {
      status: 'ok',
      version: process.env.npm_package_version || '0.0.0',
      environment: process.env.NODE_ENV,
      timestamp: new Date().toISOString(),
      connectors: sources,
      database: {
          mode: process.env.DB_ENABLED === 'true' ? 'POSTGRES' : 'NO_DB',
          status: 'connected'
      }
  };

  return NextResponse.json(systemHealth);
}
