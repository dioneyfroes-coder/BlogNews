import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { url } = body;
    const apiKey = process.env.IMGBB_API_KEY;

    const response = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}&image=${url}`, {
      method: 'POST',
    });

    if (!response.ok) {
      throw new Error('Failed to upload image');
    }

    const data = await response.json();

    if (data && data.data && data.data.url) {
      return NextResponse.json({ imageUrl: data.data.url });
    } else {
      return NextResponse.json({ error: 'Failed to upload image' }, { status: 500 });
    }
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
