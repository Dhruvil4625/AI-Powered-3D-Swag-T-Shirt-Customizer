import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { message: "Missing OPENAI_API_KEY on server" },
        { status: 400 }
      );
    }
    const { prompt } = await req.json();

    const response = await openai.images.generate({
      prompt,
      n: 1,
      size: '1024x1024',
      response_format: 'b64_json'
    });

    const image = response.data[0].b64_json;
    return NextResponse.json({ photo: image });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Something went wrong" }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ message: "Hello from DALL.E Next.js ROUTES" });
}
