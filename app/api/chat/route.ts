import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { message } = await request.json();

    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: 'Message is required and must be a string' },
        { status: 400 }
      );
    }

    const responseMessage = `You said: ${message}`;

    return NextResponse.json({ reply: responseMessage }, { status: 200 });
  } catch (error) {
    console.error('CHAT ENDPOINT ERROR:', error);
    return NextResponse.json(
      { error: 'Failed to process chat message' },
      { status: 500 }
    );
  }
}
