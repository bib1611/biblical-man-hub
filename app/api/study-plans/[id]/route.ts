import { NextRequest, NextResponse } from 'next/server';
import { getStudyPlanWithDays } from '@/lib/study-plans';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const result = await getStudyPlanWithDays(id);

    if (!result) {
      return NextResponse.json(
        { error: 'Study plan not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('Study plan error:', error);
    return NextResponse.json(
      { error: 'Failed to get study plan' },
      { status: 500 }
    );
  }
}
