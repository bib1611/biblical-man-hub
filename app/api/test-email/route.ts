import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

export async function GET(request: NextRequest) {
    const resendApiKey = process.env.RESEND_API_KEY;

    if (!resendApiKey) {
        return NextResponse.json({
            error: 'RESEND_API_KEY is missing in environment variables',
            env: process.env.NODE_ENV
        }, { status: 500 });
    }

    const resend = new Resend(resendApiKey);
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email') || 'adam@thebiblicalmantruth.com';

    try {
        const data = await resend.emails.send({
            from: 'adam@thebiblicalmantruth.com',
            to: email,
            subject: 'Test Email from Biblical Man Hub',
            html: '<p>If you are seeing this, your email configuration is working correctly! 🚀</p>'
        });

        return NextResponse.json({
            success: true,
            data,
            message: `Email sent to ${email}`
        });
    } catch (error) {
        return NextResponse.json({
            error: 'Failed to send email',
            details: error
        }, { status: 500 });
    }
}
