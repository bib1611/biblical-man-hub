import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

export async function POST(request: NextRequest) {
  try {
    // Verify admin authentication
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.ADMIN_PASSWORD}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!resend) {
      return NextResponse.json(
        { error: 'Resend API not configured' },
        { status: 500 }
      );
    }

    // Fetch all emails sent in the last 24 hours
    // Note: Resend API has a limit of 100 emails per request
    const emails = await resend.emails.list({
      limit: 100,
    });

    console.log('🔍 Resend API response:', JSON.stringify(emails, null, 2));

    // Resend API returns data property with array
    const emailList = emails.data?.data || emails.data || [];

    if (!Array.isArray(emailList)) {
      console.error('Unexpected response format:', emails);
      return NextResponse.json(
        {
          error: 'Unexpected API response format',
          responseReceived: emails
        },
        { status: 500 }
      );
    }

    // Filter for welcome emails (emails with subject "Welcome to The Biblical Man")
    const welcomeEmails = emailList.filter((email: any) =>
      email.subject && email.subject.includes('Welcome to The Biblical Man')
    );

    // Extract unique email addresses and metadata
    const recoveredLeads = welcomeEmails.map((email: any) => ({
      email: Array.isArray(email.to) ? email.to[0] : email.to,
      sentAt: email.created_at,
      emailId: email.id,
      status: email.last_event || 'sent',
    }));

    // Remove duplicates
    const uniqueLeads = Array.from(
      new Map(recoveredLeads.map((lead: any) => [lead.email, lead])).values()
    );

    console.log('🔥 RECOVERED LEADS:', uniqueLeads.length);
    console.log('Recovered emails:', uniqueLeads);

    return NextResponse.json({
      success: true,
      totalEmailsFetched: emailList.length,
      welcomeEmailsSent: welcomeEmails.length,
      recoveredLeads: uniqueLeads,
      message: `Successfully recovered ${uniqueLeads.length} leads from Resend`,
    });
  } catch (error) {
    console.error('Lead recovery error:', error);
    return NextResponse.json(
      {
        error: 'Failed to recover leads',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// GET endpoint for easy testing from browser
export async function GET(request: NextRequest) {
  try {
    // Check for password in query params for quick testing
    const { searchParams } = new URL(request.url);
    const password = searchParams.get('password');

    if (password !== process.env.ADMIN_PASSWORD) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!resend) {
      return NextResponse.json(
        { error: 'Resend API not configured' },
        { status: 500 }
      );
    }

    // Fetch all emails sent
    const emails = await resend.emails.list({
      limit: 100,
    });

    console.log('🔍 Resend API response:', JSON.stringify(emails, null, 2));

    // Resend API returns data property with array
    const emailList = emails.data?.data || emails.data || [];

    if (!Array.isArray(emailList)) {
      console.error('Unexpected response format:', emails);
      return NextResponse.json(
        {
          error: 'Unexpected API response format',
          responseReceived: emails
        },
        { status: 500 }
      );
    }

    // Filter for welcome emails
    const welcomeEmails = emailList.filter((email: any) =>
      email.subject && email.subject.includes('Welcome to The Biblical Man')
    );

    // Extract unique email addresses
    const recoveredLeads = welcomeEmails.map((email: any) => ({
      email: Array.isArray(email.to) ? email.to[0] : email.to,
      sentAt: email.created_at,
      emailId: email.id,
      status: email.last_event || 'sent',
    }));

    const uniqueLeads = Array.from(
      new Map(recoveredLeads.map((lead: any) => [lead.email, lead])).values()
    );

    return NextResponse.json({
      success: true,
      totalEmailsFetched: emailList.length,
      welcomeEmailsSent: welcomeEmails.length,
      recoveredLeads: uniqueLeads,
      allEmails: emailList.map((e: any) => ({
        id: e.id,
        to: e.to,
        subject: e.subject,
        from: e.from,
        created_at: e.created_at,
        last_event: e.last_event,
      })),
    });
  } catch (error) {
    console.error('Lead recovery error:', error);
    return NextResponse.json(
      {
        error: 'Failed to recover leads',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
