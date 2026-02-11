import { NextResponse } from 'next/server';
import { CAPABILITIES } from '../../../lib/data';

export async function GET() {
  return NextResponse.json(CAPABILITIES);
}
