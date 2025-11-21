import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { upgradeUserToMember } from '@/lib/session';

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');
    const key = searchParams.get('key');

    // Simple protection to prevent public abuse
    if (key !== 'biblical-man-test-123') {
        return NextResponse.json({ error: 'Unauthorized. Invalid key.' }, { status: 401 });
    }

    if (!email) {
        return NextResponse.json({ error: 'Email parameter required' }, { status: 400 });
    }

    const resendApiKey = process.env.RESEND_API_KEY;
    if (!resendApiKey) {
        return NextResponse.json({ error: 'RESEND_API_KEY is missing in environment variables' }, { status: 500 });
    }

    const resend = new Resend(resendApiKey);
    const fromEmail = process.env.EMAIL_FROM || 'adam@thebiblicalmantruth.com';
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://thebiblicalmantruth.com';

    try {
        console.log(`🔄 Triggering manual welcome for: ${email}`);

        // 1. Send Welcome Email (Same template as webhook)
        await resend.emails.send({
            from: fromEmail,
            to: email,
            subject: '🔥 Welcome to The Biblical Man - Your Access Inside (Test Trigger)',
            html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #dc2626; font-size: 32px; font-weight: bold; margin-bottom: 20px;">
            Welcome to The Brotherhood, Member (Test)
          </h1>

          <p style="font-size: 18px; line-height: 1.6; color: #333; margin-bottom: 20px;">
            This is a <strong>manual test trigger</strong> to confirm your email delivery and database connection.
          </p>

          <div style="background: #fee2e2; border-left: 4px solid #dc2626; padding: 20px; margin: 30px 0;">
            <h2 style="margin-top: 0; color: #dc2626; font-size: 20px;">📦 What You Got:</h2>
            <p style="margin: 0; font-size: 16px; color: #333;">
              Biblical Man Hub Access (Test)
            </p>
          </div>

          <h2 style="color: #dc2626; font-size: 24px; margin-top: 30px;">
            🚪 How to Access Your Content
          </h2>

          <ol style="font-size: 16px; line-height: 1.8; color: #333;">
            <li><strong>Visit:</strong> <a href="${siteUrl}" style="color: #dc2626; text-decoration: underline;">${siteUrl}</a></li>
            <li><strong>Login with this email:</strong> ${email}</li>
            <li><strong>Access your member dashboard</strong> to download your products, access exclusive content, and join the community</li>
          </ol>

          <div style="margin: 40px 0; text-align: center;">
            <a href="${siteUrl}" style="display: inline-block; padding: 18px 40px; background: #dc2626; color: white; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 18px;">
              🔓 Access The Hub Now
            </a>
          </div>

          <p style="font-size: 16px; line-height: 1.6; color: #333; margin: 20px 0;">
            Questions? Just hit reply to this email. I read every message.
          </p>

          <p style="font-size: 16px; line-height: 1.6; color: #333;">
            <strong>- Adam</strong><br>
            The Biblical Man
          </p>
        </div>
      `,
        });

        // 2. Upgrade User in Database
        const success = await upgradeUserToMember(email, 'Test Product Access');

        return NextResponse.json({
            success: true,
            message: '✅ Welcome email sent and user upgraded in database.',
            dbUpgradeSuccess: success,
            emailSentTo: email
        });

    } catch (error) {
        console.error('Manual trigger failed:', error);
        return NextResponse.json({
            error: 'Failed to execute trigger',
            details: error instanceof Error ? error.message : String(error)
        }, { status: 500 });
    }
}
