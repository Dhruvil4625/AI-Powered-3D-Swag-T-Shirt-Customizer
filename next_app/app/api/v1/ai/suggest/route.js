import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({ message: 'Missing OPENAI_API_KEY' }, { status: 400 });
    }
    const { prompt } = await req.json();
    const base = prompt || '';
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content:
            'You are an AI art director. Given a short user prompt for a logo/texture, propose 3 concise, higher-impact variations tailored for DALL·E 3. Keep each under 140 characters. Return as a numbered list only.',
        },
        { role: 'user', content: base },
      ],
      temperature: 0.8,
      max_tokens: 200,
    });
    const text = completion.choices?.[0]?.message?.content || '';
    const suggestions = text
      .split('\n')
      .map((l) => l.replace(/^\s*\d+[\).\s-]?\s*/, '').trim())
      .filter(Boolean)
      .slice(0, 3);
    return NextResponse.json({ suggestions });
  } catch (e) {
    return NextResponse.json({ message: String(e.message || e) }, { status: 500 });
  }
}

