// Initialize or resume user session
// Handles automatic creator recognition via fingerprinting

import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import {
  getOrCreateUser,
  createSession,
  getSessionByToken,
  getUserById
} from '@/lib/session';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      fingerprint,
      deviceInfo,
      email
    } = body;

    if (!fingerprint) {
      return NextResponse.json(
        { error: 'Fingerprint required' },
        { status: 400 }
      );
    }

    // Get client IP
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0] ||
               request.headers.get('x-real-ip') ||
               'unknown';

    // Get or create user by fingerprint
    const user = await getOrCreateUser({
      fingerprint,
      ip,
      email,
      userAgent: request.headers.get('user-agent') || undefined,
      deviceInfo
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Failed to create user session' },
        { status: 500 }
      );
    }

    // Check if there's an existing valid session
    const cookieStore = await cookies();
    const existingToken = cookieStore.get('session_token')?.value;

    let session;
    if (existingToken) {
      session = await getSessionByToken(existingToken);
    }

    // Create new session if none exists or expired
    if (!session) {
      session = await createSession({
        userId: user.id,
        fingerprint,
        ip,
        userAgent: request.headers.get('user-agent') || undefined,
        deviceInfo,
        expiresInDays: 30 // 30-day persistent session
      });

      if (!session) {
        return NextResponse.json(
          { error: 'Failed to create session' },
          { status: 500 }
        );
      }

      // Set session cookie (HTTP-only, secure)
      cookieStore.set('session_token', session.sessionToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 30 * 24 * 60 * 60, // 30 days
        path: '/'
      });
    }

    // Return user data and session info
    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        displayName: user.displayName,
        isCreator: user.isCreator,
        preferences: user.preferences,
        uiState: user.uiState,
        viewedArticles: user.viewedArticles,
        favoriteProducts: user.favoriteProducts,
        bookmarkedVerses: user.bookmarkedVerses,
        radioPreferences: user.radioPreferences
      },
      session: {
        id: session.id,
        expiresAt: session.expiresAt
      },
      recognized: !!existingToken // Whether user was auto-recognized
    });
  } catch (error) {
    console.error('Session init error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
