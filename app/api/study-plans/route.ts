import { NextResponse } from 'next/server';
import { getStudyPlans } from '@/lib/study-plans';

export async function GET() {
  try {
    const plans = await getStudyPlans();
    return NextResponse.json({ plans });
  } catch (error) {
    console.error('Study plans error:', error);
    return NextResponse.json(
      { error: 'Failed to get study plans' },
      { status: 500 }
    );
  }
}
