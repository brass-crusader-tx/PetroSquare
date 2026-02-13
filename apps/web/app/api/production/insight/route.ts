import { NextRequest, NextResponse } from 'next/server';
import { generateInsight } from '@/lib/ai';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
    const context = request.nextUrl.searchParams.get('context') || 'global';

    try {
        const markdown = await generateInsight('production', `Generate a concise production and reserves operational summary for context: ${context}. Include decline curve trends, rig count impact, and reserve replacement ratio notes.`);

        return NextResponse.json({
            status: 'ok',
            data: {
                summary: markdown,
                generated_at: new Date().toISOString()
            }
        });
    } catch (e) {
        return NextResponse.json({ status: 'error', message: 'Failed to generate insight' }, { status: 500 });
    }
}
