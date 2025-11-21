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

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Valid email is required' },
        { status: 400 }
      );
    }

    // 1. Store in Google Sheets
    const googleSheetsSuccess = await storeInGoogleSheets(email);

    if (!googleSheetsSuccess) {
      console.error('Failed to store email in Google Sheets');
      // Continue anyway - we still want to send the welcome sequence
    }

    // 2. Add to email sequence database
    const { error: dbError } = await supabase
      .from('email_sequence_subscribers')
      .upsert(
        {
          email,
          subscribed_at: new Date().toISOString(),
          current_day: 1,
          last_email_sent_at: new Date().toISOString(), // Day 1 sent immediately
        },
        { onConflict: 'email' }
      );

    if (dbError) {
      console.error('Failed to add to email sequence:', dbError);
    }

    // 3. Send Day 1 email immediately
    if (resend) {
      await sendEmailDay(email, 1);
    } else {
      console.log('Email service not configured. Would send Day 1 to:', email);
    }

    return NextResponse.json({
      success: true,
      message: 'Successfully subscribed! Check your email for Day 1 of your challenge.'
    });
  } catch (error) {
    console.error('Newsletter subscription error:', error);
    return NextResponse.json(
      { error: 'Failed to subscribe. Please try again.' },
      { status: 500 }
    );
  }
}

async function storeInGoogleSheets(email: string): Promise<boolean> {
  try {
    const GOOGLE_SHEET_URL = process.env.GOOGLE_SHEET_WEBHOOK_URL;

    if (!GOOGLE_SHEET_URL) {
      console.warn('GOOGLE_SHEET_WEBHOOK_URL not configured');
      return false;
    }

    const response = await fetch(GOOGLE_SHEET_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        timestamp: new Date().toISOString(),
        source: 'biblical-man-hub',
      }),
    });

    return response.ok;
  } catch (error) {
    console.error('Error storing in Google Sheets:', error);
    return false;
  }
}

async function sendEmailDay(email: string, day: number): Promise<void> {
  if (!resend) return;

  const fromEmail = process.env.EMAIL_FROM || 'adam@thebiblicalmantruth.com';
  const emailTemplate = emailSequence.find((e) => e.day === day);

  if (!emailTemplate) {
    console.error(`Email template for day ${day} not found`);
    return;
  }

  try {
    await resend.emails.send({
      from: fromEmail,
      to: email,
      subject: emailTemplate.subject,
      html: emailTemplate.html,
    });

    console.log(`✅ Day ${day} email sent to:`, email);
  } catch (error) {
    console.error(`Failed to send Day ${day} email to ${email}:`, error);
    throw error;
  }
}
