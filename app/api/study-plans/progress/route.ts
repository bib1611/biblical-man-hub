import { NextRequest, NextResponse } from 'next/server';
import { getUserProgress, startStudyPlan, completeDay } from '@/lib/study-plans';

export async function GET(request: NextRequest) {
  try {
    const userId = request.nextUrl.searchParams.get('userId');
    const planId = request.nextUrl.searchParams.get('planId');

    if (!userId || !planId) {
      return NextResponse.json(
        { error: 'userId and planId are required' },
        { status: 400 }
      );
    }

    const progress = await getUserProgress(userId, planId);
    return NextResponse.json({ progress });
  } catch (error) {
    console.error('Progress error:', error);
    return NextResponse.json(
      { error: 'Failed to get progress' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, planId, action, dayNumber } = body;

    if (!userId || !planId || !action) {
      return NextResponse.json(
        { error: 'userId, planId, and action are required' },
        { status: 400 }
      );
    }

    if (action === 'start') {
      const progress = await startStudyPlan(userId, planId);
      return NextResponse.json({ progress });
    }

    if (action === 'complete' && dayNumber) {
      const success = await completeDay(userId, planId, dayNumber);
      return NextResponse.json({ success });
    }

    return NextResponse.json(
      { error: 'Invalid action' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Progress update error:', error);
    return NextResponse.json(
      { error: 'Failed to update progress' },
      { status: 500 }
    );
  }
}
