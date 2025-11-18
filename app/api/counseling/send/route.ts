import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message } = body;

    if (!message) {
      return NextResponse.json(
        { error: 'Missing message' },
        { status: 400 }
      );
    }

    // In production, you would:
    // 1. Verify authentication
    // 2. Save message to database
    // 3. Send notification email
    // 4. Optionally trigger webhook

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Counseling send error:', error);
    return NextResponse.json(
      { error: 'Failed to send message' },
      { status: 500 }
    );
  }
}
