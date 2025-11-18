import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

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

    // 2. Send welcome email sequence
    if (resend) {
      await sendWelcomeSequence(email);
    } else {
      console.log('Email service not configured. Would send welcome sequence to:', email);
    }

    return NextResponse.json({
      success: true,
      message: 'Successfully subscribed! Check your email for welcome message.'
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

async function sendWelcomeSequence(email: string): Promise<void> {
  if (!resend) return;

  const fromEmail = process.env.EMAIL_FROM || 'adam@biblicalman.com';

  // Email 1: Welcome (immediate)
  await resend.emails.send({
    from: fromEmail,
    to: email,
    subject: 'Welcome to The Biblical Man',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #dc2626; font-size: 32px; font-weight: bold;">Welcome to The Biblical Man</h1>

        <p style="font-size: 18px; line-height: 1.6; color: #333;">
          You just joined 20,000+ men and women who refuse to settle for mediocrity.
        </p>

        <p style="font-size: 16px; line-height: 1.6; color: #333;">
          Here's what you can expect:
        </p>

        <ul style="font-size: 16px; line-height: 1.8; color: #333;">
          <li><strong>Weekly Biblical Truth</strong> - No fluff. No compromise. Just raw, unfiltered teaching.</li>
          <li><strong>Practical Frameworks</strong> - Real systems for marriage, parenting, finances, and spiritual warfare.</li>
          <li><strong>Direct Access</strong> - Tools, resources, and community to help you lead.</li>
        </ul>

        <div style="margin: 30px 0; padding: 20px; background: #fee2e2; border-left: 4px solid #dc2626;">
          <p style="margin: 0; font-size: 16px; color: #333;">
            <strong>Your next email arrives in 24 hours.</strong> I'll introduce you to the Substack where I publish weekly.
          </p>
        </div>

        <p style="font-size: 16px; line-height: 1.6; color: #333;">
          In the meantime, here's what you should do:
        </p>

        <div style="margin: 20px 0;">
          <a href="https://biblicalman.substack.com" style="display: inline-block; padding: 15px 30px; background: #dc2626; color: white; text-decoration: none; border-radius: 8px; font-weight: bold; margin: 10px 10px 10px 0;">
            Read the Substack
          </a>
          <a href="https://gumroad.com/biblicalman" style="display: inline-block; padding: 15px 30px; background: #dc2626; color: white; text-decoration: none; border-radius: 8px; font-weight: bold; margin: 10px 10px 10px 0;">
            Browse Products
          </a>
        </div>

        <p style="font-size: 16px; line-height: 1.6; color: #333;">
          Question for you: What's your biggest struggle right now? Marriage? Money? Spiritual leadership?
        </p>

        <p style="font-size: 16px; line-height: 1.6; color: #333;">
          Hit reply and let me know. I read every response.
        </p>

        <p style="font-size: 16px; line-height: 1.6; color: #333;">
          <strong>- Adam</strong><br>
          The Biblical Man
        </p>

        <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e5e5;">

        <p style="font-size: 12px; color: #666; text-align: center;">
          © ${new Date().getFullYear()} The Biblical Man. Built for men who lead.
        </p>
      </div>
    `,
  });

  // Schedule follow-up emails (you would use a proper email automation service like Loops, ConvertKit, or similar)
  // For now, we'll log what emails would be sent
  console.log('Email sequence initiated for:', email);
  console.log('Scheduled emails:');
  console.log('- Day 1: Welcome (sent immediately)');
  console.log('- Day 2: Substack introduction');
  console.log('- Day 3: Product showcase');
  console.log('- Day 4: X account + community');
}
