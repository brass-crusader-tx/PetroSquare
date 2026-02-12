import { NextResponse } from 'next/server';
import type { Capability } from '@petrosquare/types';

export const dynamic = 'force-dynamic';

const capabilities: Capability[] = [
  {
    id: 'production',
    title: 'Production & Reserves',
    description: 'Decline curve analysis, reserve reporting, and field development planning.',
    status: 'live',
    href: '/modules/production',
  },
  {
    id: 'markets',
    title: 'Market & Trading',
    description: 'Real-time crude pricing, arbitrage calculators, and risk analytics.',
    status: 'declared',
    href: '/modules/markets',
  },
  {
    id: 'economics',
    title: 'Cost & Economics',
    description: 'Capital project modeling, cash flow analysis, and breakeven calculators.',
    status: 'beta',
    href: '/modules/economics',
  },
  {
    id: 'gis',
    title: 'GIS & Asset Intelligence',
    description: 'Geospatial mapping of wells, pipelines, and infrastructure.',
    status: 'declared',
    href: '/modules/gis',
  },
  {
    id: 'risk',
    title: 'Risk & Regulatory',
    description: 'Geopolitical risk scores, compliance tracking, and emissions reporting.',
    status: 'declared',
    href: '/modules/risk',
  },
];

export async function GET() {
  return NextResponse.json(capabilities);
}
