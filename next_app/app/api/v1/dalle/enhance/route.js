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
    const { prompt, image } = await req.json();

    const chatResponse = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: `I have uploaded a logo image. I want to enhance it with the following style/instruction: '${prompt}'. Write a highly detailed DALL-E image generation prompt that preserves the core concept and layout of the original logo, but radically improves and stylizes it according to my instruction. ONLY return the proper prompt text suitable for DALL-E, nothing else.` },
            {
              type: "image_url",
              image_url: { url: image }
            }
          ]
        }
      ],
      max_tokens: 300,
    });

    const enhancedPrompt = chatResponse.choices[0].message.content.trim();

    const generateResponse = await openai.images.generate({
      model: 'gpt-image-1',
      prompt: enhancedPrompt,
      size: '1024x1024',
      response_format: 'b64_json',
    });

    const enhancedImage = generateResponse.data[0].b64_json;
    return NextResponse.json({ photo: enhancedImage, enhancedPrompt });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: error.message || "Something went wrong enhancing the image" }, { status: 500 });
  }
}
