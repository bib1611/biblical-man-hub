/**
 * Premium Conversion Email Sequence
 * Automated emails to convert free users to premium subscribers
 */

export interface PremiumEmailTemplate {
  day: number;
  subject: string;
  html: string;
}

const baseStyles = `
  font-family: Georgia, serif;
  max-width: 600px;
  margin: 0 auto;
  color: #e5e5e5;
  line-height: 1.7;
  background-color: #1a1a1a;
  padding: 40px 20px;
`;

export function generatePremiumSequence(siteUrl: string): PremiumEmailTemplate[] {
  return [
    {
      day: 1,
      subject: 'You\'re Missing This Every Morning',
      html: `
        <div style="${baseStyles}">
          <p style="font-size: 16px;">Brother,</p>

          <p style="font-size: 16px;">
            While you slept, thousands of men woke up to a personalized devotional designed to transform their leadership.
          </p>

          <p style="font-size: 16px;">
            <strong style="color: #dc2626;">You weren't one of them.</strong>
          </p>

          <p style="font-size: 16px;">
            Every morning at 6 AM, Premium members receive an AI-generated devotional based on a rotating curriculum of biblical masculinity—leadership, marriage, fatherhood, spiritual warfare.
          </p>

          <p style="font-size: 16px;">
            It's like having a personal chaplain who knows exactly what you need to hear, delivered before your feet hit the floor.
          </p>

          <div style="margin: 30px 0; padding: 25px; background: #2a2a2a; border-left: 6px solid #dc2626;">
            <p style="margin: 0; font-size: 18px; font-weight: bold; color: #dc2626;">
              Here's what you missed this morning:
            </p>
            <p style="margin: 10px 0 0 0; font-size: 16px; color: #d4d4d4; font-style: italic;">
              "The man who waits for perfect conditions to lead will never lead. Leadership is a command, not a suggestion..."
            </p>
          </div>

          <p style="font-size: 16px;">
            Tomorrow morning, another devotional goes out. Will you receive it?
          </p>

          <div style="text-align: center; margin: 30px 0;">
            <a href="${siteUrl}/premium" style="display: inline-block; padding: 16px 40px; background: #dc2626; color: white; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 16px;">
              Unlock Daily Devotionals - $19.99/mo
            </a>
          </div>

          <p style="font-size: 16px;">
            Lead without apology,<br>
            <strong style="color: #dc2626;">Adam</strong>
          </p>

          <hr style="margin: 30px 0; border: none; border-top: 1px solid #333;">
          <p style="font-size: 12px; color: #666; text-align: center;">
            The Biblical Man • Premium Content
          </p>
        </div>
      `,
    },
    {
      day: 3,
      subject: 'The 7-Day Course They Don\'t Want You to Take',
      html: `
        <div style="${baseStyles}">
          <p style="font-size: 16px;">Brother,</p>

          <p style="font-size: 16px;">
            There's a 7-day intensive study on biblical leadership that would make your pastor uncomfortable.
          </p>

          <p style="font-size: 16px;">
            Why? Because it doesn't apologize for what the Bible actually says.
          </p>

          <p style="font-size: 16px;">
            <strong>Day 1:</strong> The Call to Lead (Joshua 1:9)<br>
            <strong>Day 2:</strong> Leading Your Wife (Ephesians 5:25-28)<br>
            <strong>Day 3:</strong> Leading Your Children (Ephesians 6:4)<br>
            <strong>Day 4:</strong> Leading Under Authority (Romans 13:1-2)<br>
            <strong>Day 5:</strong> Leading Through Service (Mark 10:43-45)<br>
            <strong>Day 6:</strong> Leading Through Discipline (1 Corinthians 9:27)<br>
            <strong>Day 7:</strong> Leading for Eternity (Matthew 25:21)
          </p>

          <p style="font-size: 16px;">
            Each day includes deep teaching, reflection questions, and an action item that will change your life <em>if you actually do it.</em>
          </p>

          <div style="margin: 30px 0; padding: 25px; background: #0a0a0a; border: 2px solid #dc2626; border-radius: 8px; text-align: center;">
            <p style="margin: 0; font-size: 20px; font-weight: bold; color: #ffffff;">
              This Study Plan is FREE with Premium
            </p>
            <p style="margin: 10px 0 0 0; font-size: 14px; color: #888;">
              Plus: Marriage Dominion, Fatherhood Bootcamp, and more coming monthly
            </p>
          </div>

          <p style="font-size: 16px;">
            Most men consume content. Premium members are <em>transformed</em> by it.
          </p>

          <div style="text-align: center; margin: 30px 0;">
            <a href="${siteUrl}/premium" style="display: inline-block; padding: 16px 40px; background: #dc2626; color: white; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 16px;">
              Start the 7-Day Leadership Course
            </a>
          </div>

          <p style="font-size: 16px;">
            Your family is waiting for you to lead,<br>
            <strong style="color: #dc2626;">Adam</strong>
          </p>

          <hr style="margin: 30px 0; border: none; border-top: 1px solid #333;">
          <p style="font-size: 12px; color: #666; text-align: center;">
            The Biblical Man • Premium Content
          </p>
        </div>
      `,
    },
    {
      day: 5,
      subject: '50 Men Joined Yesterday. You Didn\'t.',
      html: `
        <div style="${baseStyles}">
          <p style="font-size: 16px;">Brother,</p>

          <p style="font-size: 16px;">
            I'm not going to beg you.
          </p>

          <p style="font-size: 16px;">
            Yesterday, 50 men decided they were done being passive. They joined Premium and got immediate access to:
          </p>

          <ul style="font-size: 16px; line-height: 1.8; color: #d4d4d4;">
            <li>Daily AI-generated devotionals (6 AM, every day)</li>
            <li>The 7-Day Leadership Transformation</li>
            <li>Marriage Dominion Study Guide</li>
            <li>Priority access to new content</li>
            <li>Community of like-minded men</li>
          </ul>

          <p style="font-size: 16px;">
            You're still thinking about it.
          </p>

          <p style="font-size: 16px;">
            Here's the truth: <strong style="color: #dc2626;">Thinking about transformation isn't transformation.</strong>
          </p>

          <p style="font-size: 16px;">
            You can read all the free content you want. You'll feel better temporarily. Nothing will change.
          </p>

          <p style="font-size: 16px;">
            Or you can commit. $19.99 a month. Less than your coffee habit. Cancel anytime.
          </p>

          <div style="text-align: center; margin: 30px 0;">
            <a href="${siteUrl}/premium" style="display: inline-block; padding: 16px 40px; background: #dc2626; color: white; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 16px;">
              Join the 50 Men Who Acted
            </a>
          </div>

          <p style="font-size: 16px;">
            The door is open. Walk through it or don't,<br>
            <strong style="color: #dc2626;">Adam</strong>
          </p>

          <hr style="margin: 30px 0; border: none; border-top: 1px solid #333;">
          <p style="font-size: 12px; color: #666; text-align: center;">
            The Biblical Man • Premium Content
          </p>
        </div>
      `,
    },
    {
      day: 7,
      subject: 'Last Chance: This Offer Expires Tonight',
      html: `
        <div style="${baseStyles}">
          <p style="font-size: 16px;">Brother,</p>

          <p style="font-size: 16px;">
            This is your final email about Premium.
          </p>

          <p style="font-size: 16px;">
            I've told you about the daily devotionals. The study plans. The community. The transformation.
          </p>

          <p style="font-size: 16px;">
            Now it's decision time.
          </p>

          <div style="margin: 30px 0; padding: 25px; background: #2a2a2a; border-radius: 8px;">
            <p style="margin: 0; font-size: 18px; font-weight: bold; color: #ffffff;">
              Tonight at midnight, this offer goes away:
            </p>
            <ul style="margin: 15px 0 0 0; font-size: 16px; color: #d4d4d4;">
              <li><strong>7-day free trial</strong> - Experience everything risk-free</li>
              <li><strong>Save 20%</strong> on annual with code LEADER2024</li>
              <li><strong>Bonus:</strong> Private consultation with Adam (first 10 members)</li>
            </ul>
          </div>

          <p style="font-size: 16px;">
            After tonight, you'll pay full price with no trial. I don't do sales. I don't negotiate. This is your one shot.
          </p>

          <p style="font-size: 16px;">
            Joshua told Israel: "Choose this day whom you will serve."
          </p>

          <p style="font-size: 16px;">
            <strong style="color: #dc2626;">What will you choose?</strong>
          </p>

          <div style="text-align: center; margin: 30px 0;">
            <a href="${siteUrl}/premium" style="display: inline-block; padding: 20px 50px; background: #dc2626; color: white; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 18px;">
              CLAIM YOUR SPOT NOW
            </a>
            <p style="margin: 10px 0 0; font-size: 14px; color: #888;">
              Offer expires at midnight
            </p>
          </div>

          <p style="font-size: 16px;">
            Lead or follow. Your choice,<br>
            <strong style="color: #dc2626;">Adam</strong>
          </p>

          <hr style="margin: 30px 0; border: none; border-top: 1px solid #333;">
          <p style="font-size: 12px; color: #666; text-align: center;">
            The Biblical Man • Premium Content<br>
            This is your final email in this sequence.
          </p>
        </div>
      `,
    },
  ];
}

/**
 * Send premium conversion email
 */
export async function sendPremiumConversionEmail(
  email: string,
  dayNumber: number,
  resend: any,
  siteUrl: string
): Promise<boolean> {
  const sequence = generatePremiumSequence(siteUrl);
  const template = sequence.find((t) => t.day === dayNumber);

  if (!template) {
    console.error(`No template found for day ${dayNumber}`);
    return false;
  }

  try {
    const fromEmail = process.env.EMAIL_FROM || 'adam@thebiblicalmantruth.com';

    await resend.emails.send({
      from: fromEmail,
      to: email,
      subject: template.subject,
      html: template.html,
    });

    console.log(`Premium conversion email (day ${dayNumber}) sent to ${email}`);
    return true;
  } catch (error) {
    console.error('Error sending premium conversion email:', error);
    return false;
  }
}
