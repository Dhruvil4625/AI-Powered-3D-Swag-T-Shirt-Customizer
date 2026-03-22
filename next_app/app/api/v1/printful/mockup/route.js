import { NextResponse } from 'next/server';

const PRINTFUL_API = 'https://api.printful.com';

async function uploadImage(apiKey, imageDataUrl) {
  const base64 = imageDataUrl.split(',')[1];
  const buffer = Buffer.from(base64, 'base64');
  const blob = new Blob([buffer], { type: 'image/png' });
  const form = new FormData();
  form.append('file', blob, 'design.png');
  const res = await fetch(`${PRINTFUL_API}/files`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiKey}` },
    body: form,
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(err || 'Failed to upload image to Printful');
  }
  const data = await res.json();
  return data.result.id;
}

async function createMockupTask(apiKey, variantId, fileId) {
  const body = {
    variant_ids: [variantId],
    format: 'png',
    files: [{ placement: 'front', id: fileId }],
  };
  const res = await fetch(`${PRINTFUL_API}/mockup-generator/create-task`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(err || 'Failed to create mockup task');
  }
  const data = await res.json();
  return data.result.task_key;
}

async function pollMockup(apiKey, taskKey, timeoutMs = 20000, intervalMs = 1500) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    const res = await fetch(`${PRINTFUL_API}/mockup-generator/task?task_key=${encodeURIComponent(taskKey)}`, {
      headers: { Authorization: `Bearer ${apiKey}` },
      cache: 'no-store',
    });
    if (!res.ok) {
      const err = await res.text();
      throw new Error(err || 'Failed to poll mockup task');
    }
    const data = await res.json();
    if (data.result && data.result.status === 'completed') {
      const mockups = data.result.mockups || [];
      if (mockups.length && mockups[0].mockup_url) {
        return mockups[0].mockup_url;
      }
      if (mockups.length && mockups[0].extra && mockups[0].extra[0]) {
        return mockups[0].extra[0].url;
      }
      break;
    }
    if (data.result && data.result.status === 'failed') {
      throw new Error('Printful mockup task failed');
    }
    await new Promise((r) => setTimeout(r, intervalMs));
  }
  throw new Error('Mockup generation timed out');
}

export async function POST(req) {
  try {
    const apiKey = process.env.PRINTFUL_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ message: 'Missing PRINTFUL_API_KEY' }, { status: 400 });
    }
    const { image, variantId } = await req.json();
    if (!image) {
      return NextResponse.json({ message: 'Missing image' }, { status: 400 });
    }
    const vId = variantId || 4012;
    const fileId = await uploadImage(apiKey, image);
    const taskKey = await createMockupTask(apiKey, vId, fileId);
    const mockupUrl = await pollMockup(apiKey, taskKey);
    return NextResponse.json({ mockupUrl });
  } catch (e) {
    return NextResponse.json({ message: String(e.message || e) }, { status: 500 });
  }
}
