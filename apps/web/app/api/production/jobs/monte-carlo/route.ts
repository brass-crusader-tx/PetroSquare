import { NextRequest, NextResponse } from 'next/server';
import { JobService } from '../../../../../lib/production/jobs';
import { createSuccessEnvelope, createErrorEnvelope } from '../../../../../lib/errors';
import { Provenance } from '@petrosquare/types';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { model, iterations, horizon_months } = body;

    if (!model) throw new Error("Missing model");

    const job = await JobService.submitMonteCarlo(model, iterations, horizon_months);

    return NextResponse.json(createSuccessEnvelope(job));
  } catch (error) {
      return NextResponse.json(createErrorEnvelope(error), { status: 500 });
  }
}

export async function GET(request: NextRequest) {
    try {
        const id = request.nextUrl.searchParams.get('id');
        if (!id) throw new Error("Missing job id");

        const job = await JobService.getStatus(id);
        if (!job) return NextResponse.json(createErrorEnvelope("Job not found"), { status: 404 });

        return NextResponse.json(createSuccessEnvelope(job));
    } catch (error) {
        return NextResponse.json(createErrorEnvelope(error), { status: 500 });
    }
}
