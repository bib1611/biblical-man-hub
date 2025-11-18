import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // In production, you would:
    // 1. Check session/authentication
    // 2. Verify payment status with Stripe/Gumroad
    // 3. Load existing messages from database

    // For now, return mock data
    const isPaid = false; // Set to true to test paid UI
    const messages: any[] = [];

    return NextResponse.json({
      isPaid,
      messages,
    });
  } catch (error) {
    console.error('Counseling verify error:', error);
    return NextResponse.json(
      { error: 'Failed to verify access' },
      { status: 500 }
    );
  }
}
