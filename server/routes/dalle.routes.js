import express from 'express';
import * as dotenv from 'dotenv';
import OpenAI from 'openai';

dotenv.config();

const router = express.Router();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

router.route('/').get((req, res) => {
  res.status(200).json({ message: "Hello from DALL.E ROUTES" })
})

router.route('/').post(async (req, res) => {
  try {
    const { prompt } = req.body;

    const response = await openai.images.generate({
      prompt,
      n: 1,
      size: '1024x1024',
      response_format: 'b64_json'
    });

    const image = response.data[0].b64_json;

    res.status(200).json({ photo: image });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong" })
  }
})

router.route('/enhance').post(async (req, res) => {
  try {
    const { prompt, image } = req.body;

    // 1. Analyze the original logo using Vision
    const chatResponse = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: `I have uploaded a logo image. I want to enhance it with the following style/instruction: '${prompt}'. Write a highly detailed DALL-E image generation prompt that preserves the core concept and layout of the original logo, but radically improves and stylizes it according to my instruction. ONLY return the proper prompt text suitable for DALL-E, nothing else.` },
            {
              type: "image_url",
              image_url: {
                url: image, // Base64 data URL
              }
            }
          ]
        }
      ],
      max_tokens: 300,
    });

    const enhancedPrompt = chatResponse.choices[0].message.content.trim();

    // 2. Generate the new enhanced logo
    const generateResponse = await openai.images.generate({
      prompt: enhancedPrompt,
      n: 1,
      size: '1024x1024',
      response_format: 'b64_json'
    });

    const enhancedImage = generateResponse.data[0].b64_json;

    res.status(200).json({ photo: enhancedImage, enhancedPrompt });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong enhancing the image" })
  }
})

export default router;