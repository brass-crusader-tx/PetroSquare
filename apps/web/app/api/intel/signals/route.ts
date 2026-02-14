import { NextRequest, NextResponse } from 'next/server';
import { getIntelSignals, createIntelSignal, getIntelSignalEventsService } from '../../../../lib/intel/service';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const includeEvents = searchParams.get('include_events') === 'true';

  const signals = await getIntelSignals();
  const events = includeEvents ? await getIntelSignalEventsService() : undefined;

  return NextResponse.json({
    status: 'ok',
    data: { signals, events }
  });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const signal = await createIntelSignal(body);
  return NextResponse.json({ status: 'ok', data: signal });
}
