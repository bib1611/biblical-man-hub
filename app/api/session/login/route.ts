import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getUserByEmail, createSession } from '@/lib/session';

export async function POST(request: Request) {
    try {
        const { email } = await request.json();

        if (!email) {
            return NextResponse.json({ error: 'Email required' }, { status: 400 });
        }

        const user = await getUserByEmail(email);

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        // Create new session for this user
        const session = await createSession({
            userId: user.id,
            ip: request.headers.get('x-forwarded-for')?.split(',')[0] || 'unknown',
            userAgent: request.headers.get('user-agent') || undefined,
            expiresInDays: 30
        });

        if (!session) {
            return NextResponse.json({ error: 'Failed to create session' }, { status: 500 });
        }

        // Set cookie
        const cookieStore = await cookies();
        cookieStore.set('session_token', session.sessionToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 30 * 24 * 60 * 60,
            path: '/'
        });

        return NextResponse.json({ success: true, user });
    } catch (error) {
        console.error('Login error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
