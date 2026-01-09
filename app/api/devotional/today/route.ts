import { NextResponse } from 'next/server';
import { getTodaysDevotional } from '@/lib/devotional-generator';

export async function GET() {
  try {
    const devotional = await getTodaysDevotional();

    if (!devotional) {
      return NextResponse.json(
        { error: 'Failed to get today\'s devotional' },
        { status: 500 }
      );
    }

    return NextResponse.json({ devotional });
  } catch (error) {
    console.error('Devotional error:', error);
    return NextResponse.json(
      { error: 'Failed to get devotional' },
      { status: 500 }
    );
  }
}
