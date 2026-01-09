// AI-Powered Daily Devotional Generator
import 'server-only';
import { createClient } from '@supabase/supabase-js';
import Anthropic from '@anthropic-ai/sdk';
import { Resend } from 'resend';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
});

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

// Devotional themes that rotate
const DEVOTIONAL_THEMES = [
  'biblical-leadership',
  'marriage-headship',
  'fatherhood',
  'spiritual-warfare',
  'integrity',
  'provision-protection',
  'self-discipline',
  'prayer-warrior',
  'faith-action',
  'kingdom-work',
];

// Key verses for each theme (KJV)
const THEME_VERSES: Record<string, string[]> = {
  'biblical-leadership': [
    '1 Timothy 3:1-7',
    'Titus 1:6-9',
    'Joshua 1:9',
    'Proverbs 29:2',
    'Matthew 20:26-28',
  ],
  'marriage-headship': [
    'Ephesians 5:22-33',
    '1 Peter 3:7',
    'Colossians 3:19',
    'Proverbs 31:10-12',
    '1 Corinthians 11:3',
  ],
  'fatherhood': [
    'Ephesians 6:4',
    'Proverbs 22:6',
    'Deuteronomy 6:6-7',
    'Psalm 127:3-5',
    'Proverbs 13:24',
  ],
  'spiritual-warfare': [
    'Ephesians 6:10-18',
    '2 Corinthians 10:3-5',
    '1 Peter 5:8-9',
    'James 4:7',
    'Romans 8:37',
  ],
  'integrity': [
    'Proverbs 10:9',
    'Proverbs 11:3',
    'Psalm 15:1-5',
    'Titus 2:7-8',
    'Proverbs 20:7',
  ],
  'provision-protection': [
    '1 Timothy 5:8',
    'Proverbs 27:23-27',
    'Psalm 112:1-5',
    'Genesis 2:15',
    'Nehemiah 4:14',
  ],
  'self-discipline': [
    '1 Corinthians 9:27',
    'Proverbs 25:28',
    '2 Timothy 1:7',
    'Galatians 5:22-23',
    'Titus 2:11-12',
  ],
  'prayer-warrior': [
    '1 Thessalonians 5:17',
    'James 5:16',
    'Matthew 6:9-13',
    'Ephesians 6:18',
    'Philippians 4:6-7',
  ],
  'faith-action': [
    'James 2:17-26',
    'Hebrews 11:1-6',
    'Matthew 17:20',
    'Mark 11:22-24',
    'Romans 10:17',
  ],
  'kingdom-work': [
    'Matthew 6:33',
    'Matthew 28:19-20',
    'Acts 1:8',
    'Colossians 3:23-24',
    '1 Corinthians 15:58',
  ],
};

export interface Devotional {
  id: string;
  title: string;
  verseReference: string;
  verseText: string;
  meditation: string;
  prayer: string;
  application: string;
  theme: string;
  isPremium: boolean;
  publishDate: Date;
  sentAt?: Date;
  createdAt: Date;
}

/**
 * Generate a daily devotional using AI
 */
export async function generateDailyDevotional(theme?: string): Promise<Devotional | null> {
  try {
    // Pick theme based on day of year for variety
    const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
    const selectedTheme = theme || DEVOTIONAL_THEMES[dayOfYear % DEVOTIONAL_THEMES.length];

    // Pick a verse from the theme
    const themeVerses = THEME_VERSES[selectedTheme] || THEME_VERSES['biblical-leadership'];
    const verseRef = themeVerses[dayOfYear % themeVerses.length];

    // Generate devotional content using Claude
    const prompt = `You are writing a daily devotional for Christian men focused on biblical masculinity and leadership.

Theme: ${selectedTheme.replace('-', ' ')}
Scripture Reference: ${verseRef} (King James Version)

Write a devotional that includes:

1. TITLE: A compelling, masculine title (5-10 words)
2. VERSE_TEXT: The exact KJV text of the scripture reference
3. MEDITATION: A 200-300 word reflection on this passage, written directly to men. Be bold, challenging, and unapologetic. No soft language. Challenge men to step up and lead. Reference the verse directly.
4. PRAYER: A 50-75 word prayer men can pray, written in first person
5. APPLICATION: One specific, actionable item a man can do TODAY to apply this teaching

Format your response EXACTLY as:
TITLE: [title here]
VERSE_TEXT: [exact KJV verse text]
MEDITATION: [meditation text]
PRAYER: [prayer text]
APPLICATION: [action item]

Write in a direct, bold style similar to John MacArthur or Voddie Baucham. No fluff. No apologies. Just truth.`;

    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1500,
      messages: [{ role: 'user', content: prompt }],
    });

    const content = response.content[0];
    if (content.type !== 'text') {
      throw new Error('Unexpected response type');
    }

    // Parse the response
    const text = content.text;
    const titleMatch = text.match(/TITLE:\s*(.+?)(?=\nVERSE_TEXT:)/s);
    const verseTextMatch = text.match(/VERSE_TEXT:\s*(.+?)(?=\nMEDITATION:)/s);
    const meditationMatch = text.match(/MEDITATION:\s*(.+?)(?=\nPRAYER:)/s);
    const prayerMatch = text.match(/PRAYER:\s*(.+?)(?=\nAPPLICATION:)/s);
    const applicationMatch = text.match(/APPLICATION:\s*(.+?)$/s);

    if (!titleMatch || !verseTextMatch || !meditationMatch || !prayerMatch || !applicationMatch) {
      console.error('Failed to parse devotional response:', text);
      throw new Error('Failed to parse AI response');
    }

    // Store in database
    const { data, error } = await supabase
      .from('devotionals')
      .insert({
        title: titleMatch[1].trim(),
        verse_reference: verseRef,
        verse_text: verseTextMatch[1].trim(),
        meditation: meditationMatch[1].trim(),
        prayer: prayerMatch[1].trim(),
        application: applicationMatch[1].trim(),
        theme: selectedTheme,
        is_premium: true,
        publish_date: new Date().toISOString().split('T')[0],
      })
      .select()
      .single();

    if (error) throw error;

    return mapDevotional(data);
  } catch (error) {
    console.error('Error generating devotional:', error);
    return null;
  }
}

/**
 * Get today's devotional (or generate if not exists)
 */
export async function getTodaysDevotional(): Promise<Devotional | null> {
  try {
    const today = new Date().toISOString().split('T')[0];

    // Check if today's devotional exists
    const { data, error } = await supabase
      .from('devotionals')
      .select('*')
      .eq('publish_date', today)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (data) {
      return mapDevotional(data);
    }

    // Generate new one if not exists
    return await generateDailyDevotional();
  } catch {
    // If error (no devotional), generate one
    return await generateDailyDevotional();
  }
}

/**
 * Get recent devotionals
 */
export async function getRecentDevotionals(limit: number = 7): Promise<Devotional[]> {
  try {
    const { data, error } = await supabase
      .from('devotionals')
      .select('*')
      .order('publish_date', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data.map(mapDevotional);
  } catch (error) {
    console.error('Error getting recent devotionals:', error);
    return [];
  }
}

/**
 * Send devotional email to all active subscribers
 */
export async function sendDevotionalToSubscribers(devotional: Devotional): Promise<number> {
  if (!resend) {
    console.warn('Resend not configured, skipping email send');
    return 0;
  }

  try {
    // Get all active subscribers
    const { data: subscribers, error } = await supabase
      .from('subscriptions')
      .select('email')
      .in('status', ['active', 'trialing']);

    if (error || !subscribers || subscribers.length === 0) {
      console.log('No active subscribers to send to');
      return 0;
    }

    const fromEmail = process.env.EMAIL_FROM || 'adam@thebiblicalmantruth.com';
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://thebiblicalmantruth.com';

    let sentCount = 0;

    // Send to each subscriber
    for (const sub of subscribers) {
      try {
        await resend.emails.send({
          from: fromEmail,
          to: sub.email,
          subject: `Daily Devotional: ${devotional.title}`,
          html: generateDevotionalEmailHtml(devotional, siteUrl),
        });

        // Record email sent
        await supabase.from('devotional_emails').insert({
          devotional_id: devotional.id,
          email: sub.email,
        });

        sentCount++;
      } catch (emailError) {
        console.error(`Failed to send to ${sub.email}:`, emailError);
      }
    }

    // Mark devotional as sent
    await supabase
      .from('devotionals')
      .update({ sent_at: new Date().toISOString() })
      .eq('id', devotional.id);

    console.log(`Devotional sent to ${sentCount} subscribers`);
    return sentCount;
  } catch (error) {
    console.error('Error sending devotional emails:', error);
    return 0;
  }
}

/**
 * Generate HTML for devotional email
 */
function generateDevotionalEmailHtml(devotional: Devotional, siteUrl: string): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; background-color: #1a1a1a; font-family: Georgia, serif;">
  <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">

    <!-- Header -->
    <div style="text-align: center; margin-bottom: 30px;">
      <h1 style="color: #dc2626; font-size: 28px; margin: 0;">THE BIBLICAL MAN</h1>
      <p style="color: #888; font-size: 14px; margin: 10px 0 0;">Daily Devotional</p>
    </div>

    <!-- Title -->
    <h2 style="color: #ffffff; font-size: 24px; text-align: center; margin-bottom: 30px;">
      ${devotional.title}
    </h2>

    <!-- Scripture -->
    <div style="background: #2a2a2a; border-left: 4px solid #dc2626; padding: 20px; margin-bottom: 30px;">
      <p style="color: #dc2626; font-weight: bold; margin: 0 0 10px; font-size: 16px;">
        ${devotional.verseReference}
      </p>
      <p style="color: #d4d4d4; font-style: italic; margin: 0; line-height: 1.7; font-size: 16px;">
        "${devotional.verseText}"
      </p>
    </div>

    <!-- Meditation -->
    <div style="margin-bottom: 30px;">
      <h3 style="color: #dc2626; font-size: 18px; margin-bottom: 15px;">MEDITATION</h3>
      <p style="color: #e5e5e5; line-height: 1.8; font-size: 16px; margin: 0;">
        ${devotional.meditation}
      </p>
    </div>

    <!-- Prayer -->
    <div style="background: #2a2a2a; padding: 25px; border-radius: 8px; margin-bottom: 30px;">
      <h3 style="color: #dc2626; font-size: 18px; margin: 0 0 15px;">PRAYER</h3>
      <p style="color: #d4d4d4; line-height: 1.8; font-style: italic; font-size: 16px; margin: 0;">
        ${devotional.prayer}
      </p>
    </div>

    <!-- Application -->
    <div style="border: 2px solid #dc2626; padding: 25px; margin-bottom: 30px;">
      <h3 style="color: #dc2626; font-size: 18px; margin: 0 0 15px;">TODAY'S ACTION</h3>
      <p style="color: #ffffff; line-height: 1.7; font-size: 16px; margin: 0; font-weight: bold;">
        ${devotional.application}
      </p>
    </div>

    <!-- CTA -->
    <div style="text-align: center; margin: 40px 0;">
      <a href="${siteUrl}/hub" style="display: inline-block; padding: 16px 40px; background: #dc2626; color: white; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 16px;">
        Access The Hub
      </a>
    </div>

    <!-- Footer -->
    <div style="text-align: center; border-top: 1px solid #333; padding-top: 30px; margin-top: 30px;">
      <p style="color: #666; font-size: 14px; margin: 0;">
        Lead like a king. Love like Christ. Leave a legacy.
      </p>
      <p style="color: #444; font-size: 12px; margin: 15px 0 0;">
        The Biblical Man • Premium Member Content<br>
        <a href="${siteUrl}/unsubscribe" style="color: #666;">Manage Subscription</a>
      </p>
    </div>

  </div>
</body>
</html>
  `;
}

// Helper function to map database record
function mapDevotional(data: any): Devotional {
  return {
    id: data.id,
    title: data.title,
    verseReference: data.verse_reference,
    verseText: data.verse_text,
    meditation: data.meditation,
    prayer: data.prayer,
    application: data.application,
    theme: data.theme,
    isPremium: data.is_premium,
    publishDate: new Date(data.publish_date),
    sentAt: data.sent_at ? new Date(data.sent_at) : undefined,
    createdAt: new Date(data.created_at),
  };
}
