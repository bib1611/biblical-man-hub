import { NextRequest, NextResponse } from 'next/server';
import { getDB } from '@/lib/db';
import { v4 as uuidv4 } from 'uuid';
import { ConversationLog } from '@/types';

// Calculate conversation quality based on length, engagement, and outcome
function calculateConversationQuality(messages: any[], intent: string): number {
  let quality = 50; // Base quality

  // Message count (more engagement = higher quality)
  if (messages.length > 10) quality += 30;
  else if (messages.length > 5) quality += 20;
  else if (messages.length > 2) quality += 10;

  // Intent (ready to buy is highest quality)
  if (intent === 'ready_to_buy') quality += 20;
  else if (intent === 'interested') quality += 10;
  else if (intent === 'needs_help') quality += 5;

  return Math.min(quality, 100);
}

export async function POST(request: NextRequest) {
  try {
    const { visitorId, sessionId, messages, intent, productsDiscussed } = await request.json();
    const db = getDB();

    const quality = calculateConversationQuality(messages, intent);

    const conversation: ConversationLog = {
      id: uuidv4(),
      visitorId,
      messages,
      quality,
      intent,
      productsDiscussed: productsDiscussed || [],
      startTime: messages[0]?.timestamp || new Date().toISOString(),
      endTime: messages[messages.length - 1]?.timestamp || new Date().toISOString(),
    };

    db.addConversation(conversation);

    // If high intent, send notification
    if (intent === 'ready_to_buy' || intent === 'needs_help') {
      await sendConversationAlert(conversation, visitorId);
    }

    return NextResponse.json({ success: true, quality });
  } catch (error) {
    console.error('Conversation logging error:', error);
    return NextResponse.json({ error: 'Failed to log conversation' }, { status: 500 });
  }
}

async function sendConversationAlert(conversation: ConversationLog, visitorId: string) {
  const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
  const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
    console.log('Would send Telegram notification for conversation:', conversation.id);
    return;
  }

  const db = getDB();
  const visitor = db.getVisitor(visitorId);

  const message = `💬 HIGH-INTENT CONVERSATION ALERT!

🎯 Intent: ${conversation.intent.toUpperCase().replace('_', ' ')}
⭐ Quality: ${conversation.quality}/100
💬 Messages: ${conversation.messages.length}
${visitor?.email ? `📧 Email: ${visitor.email}` : ''}
${conversation.productsDiscussed.length > 0 ? `\n🛍️ Products discussed: ${conversation.productsDiscussed.join(', ')}` : ''}

Last message: "${conversation.messages[conversation.messages.length - 1]?.content.substring(0, 100)}..."`;

  try {
    await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text: message,
      }),
    });
  } catch (error) {
    console.error('Telegram notification error:', error);
  }
}
