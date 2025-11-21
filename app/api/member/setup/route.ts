import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { token, password } = body;

    if (!token || !password) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters' },
        { status: 400 }
      );
    }

    // Verify token and get pending member
    const { data: pending, error: pendingError } = await supabase
      .from('pending_members')
      .select('*')
      .eq('setup_token', token)
      .eq('setup_completed', false)
      .gt('expires_at', new Date().toISOString())
      .single();

    if (pendingError || !pending) {
      return NextResponse.json(
        { error: 'Invalid or expired setup link' },
        { status: 400 }
      );
    }

    // Check if member already exists
    const { data: existingMember } = await supabase
      .from('members')
      .select('id')
      .eq('email', pending.email)
      .single();

    if (existingMember) {
      return NextResponse.json(
        { error: 'Account already exists. Please login.' },
        { status: 400 }
      );
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create member account
    const { data: member, error: memberError } = await supabase
      .from('members')
      .insert({
        email: pending.email,
        password_hash: passwordHash,
        stripe_customer_id: pending.stripe_customer_id,
        stripe_payment_intent_id: pending.stripe_payment_intent_id,
      })
      .select()
      .single();

    if (memberError || !member) {
      console.error('Failed to create member:', memberError);
      return NextResponse.json(
        { error: 'Failed to create account' },
        { status: 500 }
      );
    }

    // Mark pending member as completed
    await supabase
      .from('pending_members')
      .update({ setup_completed: true })
      .eq('id', pending.id);

    // Create session
    const sessionToken = generateSessionToken();
    const { error: sessionError } = await supabase
      .from('member_sessions')
      .insert({
        member_id: member.id,
        session_token: sessionToken,
        ip_address: request.headers.get('x-forwarded-for') || 'unknown',
        user_agent: request.headers.get('user-agent') || 'unknown',
      });

    if (sessionError) {
      console.error('Failed to create session:', sessionError);
    }

    // Set session cookie
    const cookieStore = await cookies();
    cookieStore.set('member_session', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 30 * 24 * 60 * 60, // 30 days
      path: '/',
    });

    // Update member login stats
    await supabase
      .from('members')
      .update({
        last_login_at: new Date().toISOString(),
        login_count: 1,
      })
      .eq('id', member.id);

    console.log('✅ Member account created:', member.email);

    return NextResponse.json({
      success: true,
      message: 'Account created successfully',
    });
  } catch (error) {
    console.error('Setup error:', error);
    return NextResponse.json(
      { error: 'Server error' },
      { status: 500 }
    );
  }
}

function generateSessionToken(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let token = '';
  const crypto = require('crypto');
  const bytes = crypto.randomBytes(64);

  for (let i = 0; i < 64; i++) {
    token += chars[bytes[i] % chars.length];
  }

  return token;
}
