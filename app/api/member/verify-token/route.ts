import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get('token');

  if (!token) {
    return NextResponse.json(
      { valid: false, error: 'No token provided' },
      { status: 400 }
    );
  }

  try {
    const { data: pending, error } = await supabase
      .from('pending_members')
      .select('*')
      .eq('setup_token', token)
      .eq('setup_completed', false)
      .gt('expires_at', new Date().toISOString())
      .single();

    if (error || !pending) {
      return NextResponse.json({
        valid: false,
        error: 'Invalid or expired setup link',
      });
    }

    return NextResponse.json({
      valid: true,
      email: pending.email,
    });
  } catch (error) {
    console.error('Error verifying token:', error);
    return NextResponse.json(
      { valid: false, error: 'Server error' },
      { status: 500 }
    );
  }
}
