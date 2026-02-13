import { NextRequest, NextResponse } from 'next/server';
import { generateInsight } from '../../../../lib/ai';

export async function POST(request: NextRequest) {
  try {
    const { prompt, context } = await request.json();
    if (!prompt) {
      return NextResponse.json({ error: 'Missing prompt' }, { status: 400 });
    }
    const text = await generateInsight(prompt, context);
    return NextResponse.json({ text });
  } catch (e) {
    console.error("AI Insight Error", e);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
