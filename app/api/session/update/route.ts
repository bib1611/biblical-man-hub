// Update user preferences, UI state, and memory
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import {
  getSessionByToken,
  updateUserPreferences,
  updateUIState,
  addViewedArticle
} from '@/lib/session';

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
    const { type, data } = body;

    let success = false;

    switch (type) {
      case 'preferences':
        success = await updateUserPreferences(session.userId, data);
        break;

      case 'ui_state':
        success = await updateUIState(session.userId, data);
        break;

      case 'viewed_article':
        success = await addViewedArticle(session.userId, data.slug);
        break;

      default:
        return NextResponse.json(
          { error: 'Invalid update type' },
          { status: 400 }
        );
    }

    if (!success) {
      return NextResponse.json(
        { error: 'Failed to update' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Session update error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
