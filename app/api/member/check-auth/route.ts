import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get('member_session')?.value;

    if (!sessionToken) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    // Get session
    const { data: session, error: sessionError } = await supabase
      .from('member_sessions')
      .select('member_id, expires_at')
      .eq('session_token', sessionToken)
      .single();

    if (sessionError || !session) {
      return NextResponse.json(
        { error: 'Invalid session' },
        { status: 401 }
      );
    }

    // Check if session expired
    if (new Date(session.expires_at) < new Date()) {
      return NextResponse.json(
        { error: 'Session expired' },
        { status: 401 }
      );
    }

    // Get member details
    const { data: member, error: memberError } = await supabase
      .from('members')
      .select('email, is_active')
      .eq('id', session.member_id)
      .single();

    if (memberError || !member || !member.is_active) {
      return NextResponse.json(
        { error: 'Member not found or inactive' },
        { status: 401 }
      );
    }

    return NextResponse.json({
      authenticated: true,
      email: member.email,
    });
  } catch (error) {
    console.error('Auth check error:', error);
    return NextResponse.json(
      { error: 'Server error' },
      { status: 500 }
    );
  }
}
