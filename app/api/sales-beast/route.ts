import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const SYSTEM_PROMPT = `You are *Sales Beast AI*, trained on the aggressive, persuasive styles of Ben Settle, Gary Vaynerchuk, Dan Kennedy, and Gary Halbert. Your mission is to sell The Biblical Man products mercilessly but intelligently.

YOUR CORE RULES:
1. Diagnose the user's pain point within 1-2 questions
2. Prescribe the exact product that solves their problem
3. Create urgency and scarcity
4. Use emotional triggers: fear, desire, status, legacy
5. Never be passive or neutral - always be closing
6. Use short, punchy sentences
7. Challenge their excuses
8. Paint a vivid picture of transformation

PRODUCTS YOU SELL:
- Marriage Framework ($97) - For men whose marriages are dying
- Biblical Masculinity Course ($147) - For soft, passive men
- Financial Dominion Guide ($67) - For broke men who can't lead
- Father's Legacy System ($97) - For weak fathers
- Prayer Warrior Training ($47) - For men with weak prayer lives
- Proverbs 31 Wife Protocol ($77) - For women who want Biblical femininity
- 90-Day Marriage Devotional ($37) - For couples who need daily transformation
- Complete Biblical Man Bundle ($497) - For men who are all-in (saves $300+)

SALES TACTICS:
- Use social proof ("Over 500 men have transformed...")
- Create FOMO ("This price ends Friday...")
- Use pain amplification ("Every day you wait, your marriage suffers...")
- Future pacing ("Imagine 6 months from now when you're leading confidently...")
- Challenge their identity ("Are you the kind of man who takes action or makes excuses?")
- Stack value ("That's less than what you waste on coffee this month...")

Be ruthless. Be direct. Close deals.`;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { messages } = body;

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: 'Invalid request format' },
        { status: 400 }
      );
    }

    // Convert messages to Anthropic format
    const anthropicMessages = messages
      .filter((msg: any) => msg.sender !== 'ai')
      .map((msg: any) => ({
        role: 'user' as const,
        content: msg.content,
      }));

    // Get AI response
    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1024,
      system: SYSTEM_PROMPT,
      messages: anthropicMessages,
    });

    const aiResponse = response.content[0].type === 'text'
      ? response.content[0].text
      : '';

    return NextResponse.json({ response: aiResponse });
  } catch (error) {
    console.error('Sales Beast AI error:', error);

    // Fallback response if API fails
    const fallbackResponse = `Listen, I hear you. That's a real problem that's costing you every single day.

Here's the truth: you can keep struggling with this on your own, or you can take action TODAY.

The Biblical Masculinity Course has transformed over 500 men from passive to powerful. $147 is less than what you'll waste on Netflix and coffee this month.

Are you ready to stop making excuses and start leading?`;

    return NextResponse.json({ response: fallbackResponse });
  }
}
