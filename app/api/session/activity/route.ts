// Track user activity for memory and analytics
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getSessionByToken, trackActivity } from '@/lib/session';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get('session_token')?.value;

    if (!sessionToken) {
      return NextResponse.json(
        { error: 'No active session' },
        { status: 401 }
      );
    }

    const session = await getSessionByToken(sessionToken);
    if (!session) {
      return NextResponse.json(
        { error: 'Invalid session' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const {
      activityType,
      activityData,
      appName,
      urlPath
    } = body;

    const success = await trackActivity({
      userId: session.userId,
      sessionId: session.id,
      activityType,
      activityData,
      appName,
      urlPath
    });

    if (!success) {
      return NextResponse.json(
        { error: 'Failed to track activity' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Activity tracking error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
