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
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password required' },
        { status: 400 }
      );
    }

    // Special handling for admin/owner email
    const isAdminEmail = email.toLowerCase() === 'adam@thebiblicalmantruth.com';
    const isAdminPassword = password === 'Blake2025!?123';

    if (isAdminEmail) {
      // Admin login - verify password directly
      if (!isAdminPassword) {
        return NextResponse.json(
          { error: 'Invalid email or password' },
          { status: 401 }
        );
      }

      // Create admin member record if doesn't exist
      let { data: member } = await supabase
        .from('members')
        .select('*')
        .eq('email', email.toLowerCase())
        .single();

      if (!member) {
        // Create admin member
        const adminPasswordHash = await bcrypt.hash(password, 10);
        const { data: newMember, error: createError } = await supabase
          .from('members')
          .insert({
            email: email.toLowerCase(),
            password_hash: adminPasswordHash,
            full_name: 'Adam (Owner)',
            is_active: true,
            is_admin: true,
            membership_tier: 'lifetime',
            subscription_status: 'active',
          })
          .select()
          .single();

        if (createError) {
          console.error('Failed to create admin member:', createError);
        } else {
          member = newMember;
        }
      }
    } else {
      // Regular member login
      const { data: member, error: memberError } = await supabase
        .from('members')
        .select('*')
        .eq('email', email.toLowerCase())
        .eq('is_active', true)
        .single();

      if (memberError || !member) {
        return NextResponse.json(
          { error: 'Invalid email or password' },
          { status: 401 }
        );
      }

      // Verify password
      const passwordValid = await bcrypt.compare(password, member.password_hash);

      if (!passwordValid) {
        return NextResponse.json(
          { error: 'Invalid email or password' },
          { status: 401 }
        );
      }
    }

    // Re-fetch member to ensure we have the data
    const { data: member, error: memberError } = await supabase
      .from('members')
      .select('*')
      .eq('email', email.toLowerCase())
      .single();

    if (memberError || !member) {
      return NextResponse.json(
        { error: 'Login failed. Please try again.' },
        { status: 500 }
      );
    }

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
      return NextResponse.json(
        { error: 'Failed to create session' },
        { status: 500 }
      );
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
        login_count: (member.login_count || 0) + 1,
      })
      .eq('id', member.id);

    console.log('✅ Member logged in:', member.email);

    return NextResponse.json({
      success: true,
      message: 'Login successful',
    });
  } catch (error) {
    console.error('Login error:', error);
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
