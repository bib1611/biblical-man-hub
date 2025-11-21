import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { createClient } from '@supabase/supabase-js';
import { emailSequence } from '@/lib/email-sequences';

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

/**
 * Cron Job: Send Email Sequence
 *
 * This endpoint should be called once per hour by Vercel Cron
 * It checks for subscribers who are ready for their next email
 * and sends it to them.
 *
 * Set up in vercel.json:
 * {
 *   "crons": [{
 *     "path": "/api/cron/send-email-sequence",
 *     "schedule": "0 * * * *"
 *   }]
 * }
 */
export async function GET(request: NextRequest) {
  try {
    // Verify this is a legitimate cron request
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!resend) {
      console.log('Resend not configured, skipping email send');
      return NextResponse.json({
        success: true,
        message: 'Resend not configured'
      });
    }

    // Get subscribers ready for next email
    const { data: subscribers, error } = await supabase
      .from('email_sequence_subscribers')
      .select('*')
      .eq('completed', false)
      .lte('current_day', 7)
      .or('last_email_sent_at.is.null,last_email_sent_at.lt.' + new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString());

    if (error) {
      console.error('Error fetching subscribers:', error);
      return NextResponse.json({
        success: false,
        error: error.message
      }, { status: 500 });
    }

    if (!subscribers || subscribers.length === 0) {
      console.log('No subscribers ready for email');
      return NextResponse.json({
        success: true,
        message: 'No subscribers ready',
        sent: 0
      });
    }

    console.log(`Found ${subscribers.length} subscribers ready for email`);

    const results = [];

    for (const subscriber of subscribers) {
      try {
        const dayToSend = subscriber.current_day;
        const emailTemplate = emailSequence.find((e) => e.day === dayToSend);

        if (!emailTemplate) {
          console.error(`Email template for day ${dayToSend} not found`);
          continue;
        }

        // Send the email
        const fromEmail = process.env.EMAIL_FROM || 'adam@biblicalman.com';
        await resend.emails.send({
          from: fromEmail,
          to: subscriber.email,
          subject: emailTemplate.subject,
          html: emailTemplate.html,
        });

        // Update subscriber record
        const nextDay = dayToSend + 1;
        const isCompleted = nextDay > 7;

        await supabase
          .from('email_sequence_subscribers')
          .update({
            current_day: nextDay,
            last_email_sent_at: new Date().toISOString(),
            completed: isCompleted,
            updated_at: new Date().toISOString(),
          })
          .eq('id', subscriber.id);

        console.log(`✅ Sent Day ${dayToSend} to ${subscriber.email}`);
        results.push({
          email: subscriber.email,
          day: dayToSend,
          success: true,
        });
      } catch (error) {
        console.error(`Failed to send email to ${subscriber.email}:`, error);
        results.push({
          email: subscriber.email,
          day: subscriber.current_day,
          success: false,
          error: error instanceof Error ? error.message : String(error),
        });
      }
    }

    const successCount = results.filter((r) => r.success).length;
    const failCount = results.filter((r) => !r.success).length;

    return NextResponse.json({
      success: true,
      sent: successCount,
      failed: failCount,
      results,
    });
  } catch (error) {
    console.error('Cron job error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}
