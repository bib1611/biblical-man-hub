import { NextRequest, NextResponse } from 'next/server';
import { verifyPassword, createSession, getClientIP, checkRateLimit } from '@/lib/auth';
import { z } from 'zod';

const loginSchema = z.object({
  password: z.string().min(1),
});

export async function POST(request: NextRequest) {
  console.log('🔐 Login attempt received');
  try {
    // Rate limiting: 5 attempts per 15 minutes per IP
    const ip = getClientIP(request);
    console.log('IP:', ip);
    if (!checkRateLimit(`login:${ip}`, 5, 15 * 60 * 1000)) {
      console.log('❌ Rate limit exceeded for IP:', ip);
      return NextResponse.json(
        { error: 'Too many login attempts. Try again later.' },
        { status: 429 }
      );
    }

    const body = await request.json();
    console.log('📦 Request body received');
    const { password } = loginSchema.parse(body);
    console.log('🔑 Password from request:', password);
    console.log('🔑 ADMIN_PASSWORD env var:', process.env.ADMIN_PASSWORD);

    // Verify password server-side
    const isValid = verifyPassword(password);
    console.log('✅ Password verification result:', isValid);
    if (!isValid) {
      console.log('❌ Invalid password - rejecting');
      return NextResponse.json(
        { error: 'Invalid password' },
        { status: 401 }
      );
    }

    // Create secure session
    const sessionToken = createSession();

    // Set HTTP-only cookie
    const response = NextResponse.json({ success: true });
    response.cookies.set('admin_session', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 24 * 60 * 60, // 24 hours
      path: '/',
    });

    return response;
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request' },
        { status: 400 }
      );
    }

    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Login failed' },
      { status: 500 }
    );
  }
}
