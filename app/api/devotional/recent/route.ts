import { NextRequest, NextResponse } from 'next/server';
import { getRecentDevotionals } from '@/lib/devotional-generator';

export async function GET(request: NextRequest) {
  try {
    const limit = parseInt(request.nextUrl.searchParams.get('limit') || '7');
    const devotionals = await getRecentDevotionals(limit);

    return NextResponse.json({ devotionals });
  } catch (error) {
    console.error('Recent devotionals error:', error);
    return NextResponse.json(
      { error: 'Failed to get recent devotionals' },
      { status: 500 }
    );
  }
}
