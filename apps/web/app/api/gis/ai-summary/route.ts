import { NextRequest, NextResponse } from 'next/server';
import { generateInsight } from '@/lib/ai';
import { DataEnvelope } from '@petrosquare/types';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const context_id = request.nextUrl.searchParams.get('context_id');
  if (!context_id) {
      return NextResponse.json({
          status: 'error',
          error: {
              code: 'BAD_REQUEST',
              message: 'Missing context_id'
          }
      }, { status: 400 });
  }

  try {
    const markdown = await generateInsight(context_id, `Provide a concise GIS and asset intelligence summary for basin or asset ID: ${context_id}. Focus on operational status, risks, and production trends.`);

    const data = {
        context_id,
        context_type: 'ASSET', // or BASIN, simplified
        generated_at: new Date().toISOString(),
        model_version: 'Gemini-Pro-Unified',
        sources: ['PetroSquare Intelligence'],
        confidence_score: 0.92,
        summary_markdown: markdown
    };

    return NextResponse.json({
      status: 'ok',
      data,
      provenance: {
        source_name: 'PetroSquare AI Engine',
        source_url: request.nextUrl.toString(),
        retrieved_at: new Date().toISOString()
      }
    } as DataEnvelope<typeof data>);
  } catch (error) {
    return NextResponse.json({
      status: 'degraded',
      data: null,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Failed to generate summary'
      }
    }, { status: 500 });
  }
}
