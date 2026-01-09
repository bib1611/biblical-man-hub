import { NextRequest, NextResponse } from 'next/server';
import { generateDailyDevotional, sendDevotionalToSubscribers } from '@/lib/devotional-generator';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// This endpoint should be called daily by a cron job (e.g., Vercel Cron)
// Configure in vercel.json or use external cron service

export async function GET(request: NextRequest) {
  try {
    // Verify cron secret to prevent unauthorized calls
    const authHeader = request.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;

    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Update job status
    await supabase
      .from('cron_jobs')
      .update({ status: 'running', last_run: new Date().toISOString() })
      .eq('job_name', 'daily_devotional_generation');

    // Generate today's devotional
    console.log('Generating daily devotional...');
    const devotional = await generateDailyDevotional();

    if (!devotional) {
      await supabase
        .from('cron_jobs')
        .update({ status: 'failed', error_message: 'Failed to generate devotional' })
        .eq('job_name', 'daily_devotional_generation');

      return NextResponse.json(
        { error: 'Failed to generate devotional' },
        { status: 500 }
      );
    }

    console.log('Devotional generated:', devotional.title);

    // Send to subscribers
    console.log('Sending devotional to subscribers...');
    const sentCount = await sendDevotionalToSubscribers(devotional);

    // Update job status
    await supabase
      .from('cron_jobs')
      .update({
        status: 'completed',
        error_message: null,
        next_run: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      })
      .eq('job_name', 'daily_devotional_generation');

    return NextResponse.json({
      success: true,
      devotional: {
        id: devotional.id,
        title: devotional.title,
        theme: devotional.theme,
      },
      emailsSent: sentCount,
    });
  } catch (error) {
    console.error('Cron job error:', error);

    await supabase
      .from('cron_jobs')
      .update({
        status: 'failed',
        error_message: error instanceof Error ? error.message : 'Unknown error',
      })
      .eq('job_name', 'daily_devotional_generation');

    return NextResponse.json(
      { error: 'Cron job failed' },
      { status: 500 }
    );
  }
}

// Also support POST for manual triggering from admin
export async function POST(request: NextRequest) {
  return GET(request);
}
