import { NextRequest, NextResponse } from 'next/server';
import { getDB } from '@/lib/db';
import { v4 as uuidv4 } from 'uuid';
import { Lead } from '@/types';

// Lead scoring algorithm
function calculateLeadScore(visitor: any, source: string): number {
  let score = 0;

  // Source value
  if (source === 'counseling_inquiry') score += 50;
  else if (source === 'sam_chat') score += 30;
  else if (source === 'email_capture') score += 10;

  // Engagement
  if (visitor.pageViews > 5) score += 20;
  else if (visitor.pageViews > 2) score += 10;

  // Time on site (in minutes)
  const minutesOnSite = visitor.totalTimeOnSite / 60;
  if (minutesOnSite > 10) score += 20;
  else if (minutesOnSite > 5) score += 10;

  return Math.min(score, 100);
}

export async function POST(request: NextRequest) {
  try {
    const { visitorId, sessionId, email, name, source } = await request.json();
    const db = getDB();

    // Check if lead already exists
    let lead = await db.getLeadByEmail(email);

    if (lead) {
      // Update existing lead
      lead.lastContact = new Date().toISOString();
      const visitor = await db.getVisitor(visitorId);
      lead.score = Math.max(lead.score, calculateLeadScore(visitor, source));
      await db.updateLead(lead.id, lead);
    } else {
      // Create new lead
      const visitor = await db.getVisitor(visitorId);
      lead = {
        id: uuidv4(),
        email,
        name,
        source,
        score: calculateLeadScore(visitor, source),
        status: 'new',
        firstContact: new Date().toISOString(),
        lastContact: new Date().toISOString(),
        tags: [],
        notes: '',
      };
      await db.createLead(lead);
    }

    // Update visitor with email
    const visitor = await db.getVisitor(visitorId);
    if (visitor) {
      visitor.email = email;
      visitor.name = name;
      await db.createOrUpdateVisitor(visitor);
    }

    // Send notification if high-value lead
    if (lead.score >= 50) {
      await sendTelegramNotification(lead, visitor);
    }

    return NextResponse.json({ success: true, leadId: lead.id, score: lead.score });
  } catch (error) {
    console.error('Lead capture error:', error);
    return NextResponse.json({ error: 'Failed to capture lead' }, { status: 500 });
  }
}

async function sendTelegramNotification(lead: Lead, visitor: any) {
  const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
  const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
    console.log('Telegram not configured - would send notification:', lead);
    return;
  }

  const message = `🔥 HIGH-VALUE LEAD ALERT!

📧 Email: ${lead.email}
${lead.name ? `👤 Name: ${lead.name}` : ''}
📊 Score: ${lead.score}/100
🎯 Source: ${lead.source}
⏰ Time: ${new Date().toLocaleString()}

${visitor ? `🌐 Pages viewed: ${visitor.pageViews}
⏱️ Time on site: ${Math.floor(visitor.totalTimeOnSite / 60)} minutes` : ''}`;

  try {
    await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text: message,
        parse_mode: 'HTML',
      }),
    });
  } catch (error) {
    console.error('Telegram notification error:', error);
  }
}
