import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, subject, message } = body;

    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Send email via Resend if configured
    if (resend) {
      await resend.emails.send({
        from: process.env.EMAIL_FROM || 'adam@thebiblicalmantruth.com',
        to: process.env.EMAIL_TO || 'adam@thebiblicalmantruth.com',
        subject: `[Biblical Man Hub] ${subject}`,
        html: `
          <h2>New Message from Biblical Man Hub</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Subject:</strong> ${subject}</p>
          <hr />
          <p><strong>Message:</strong></p>
          <p>${message.replace(/\n/g, '<br />')}</p>
        `,
      });
    } else {
      // Log to console if email service not configured
      console.log('Contact form submission (email not configured):', { name, email, subject, message });
    }

    // Store message locally (optional)
    // You could also save to a database here

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json(
      { error: 'Failed to send message' },
      { status: 500 }
    );
  }
}
