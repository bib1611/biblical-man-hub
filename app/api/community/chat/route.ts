import { NextRequest, NextResponse } from 'next/server';
import { AI_PERSONAS, ChatRoomThread, CommunityMessage, AIPersona } from '@/types/community';
import { fetchRecentSubstackArticles, SubstackArticle } from '@/lib/substack-fetcher';
import { v4 as uuidv4 } from 'uuid';
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
});

// In-memory storage for simulated chat (will persist in DB later)
const activeChatThreads = new Map<string, ChatRoomThread>();
let cachedSubstackArticles: SubstackArticle[] = [];
let lastArticleFetch = 0;

// Fetch Substack articles (cached for 30 minutes)
async function getSubstackArticles(): Promise<SubstackArticle[]> {
  const now = Date.now();
  const thirtyMinutes = 30 * 60 * 1000;

  if (cachedSubstackArticles.length === 0 || now - lastArticleFetch > thirtyMinutes) {
    console.log('🔄 Fetching fresh Substack articles...');
    cachedSubstackArticles = await fetchRecentSubstackArticles(24);
    lastArticleFetch = now;
    console.log(`✅ Fetched ${cachedSubstackArticles.length} Substack articles`);
  }

  return cachedSubstackArticles;
}

// Generate realistic AI message using Claude
async function generateClaudeMessage(
  persona: AIPersona,
  article: SubstackArticle,
  previousMessages: CommunityMessage[],
  replyToMessage?: CommunityMessage
): Promise<string> {
  try {
    const systemPrompt = `You are ${persona.name}, a real person in an online forum.

Your background: ${persona.responseStyle}

WRITE LIKE A REAL HUMAN IN A CHAT ROOM:
- Use 1-3 sentences max (people scroll fast)
- Write casually like you're texting a friend
- NO formal structure, NO numbered lists, NO essay format
- Use contractions (don't, can't, won't, I'm, it's)
- Make typos occasionally (but readable)
- Use "..." for trailing thoughts
- ${persona.personality === 'enthusiastic' ? 'ALL CAPS for emphasis, multiple exclamation points!!!' : ''}
- ${persona.personality === 'skeptical' ? 'Challenge things directly. Ask "really?" or "prove it"' : ''}
- ${persona.personality === 'analytical' ? 'Drop a Greek/Hebrew word but keep it brief' : ''}
- ${persona.personality === 'deep_thinker' ? 'Reference theologians by last name only (Piper, Owen, etc)' : ''}
- ${persona.personality === 'encouraging' ? 'Short encouragement like "brother, yes!" or "this right here"' : ''}
- Use phrases like: "man," "bro," "honestly," "real talk," "facts," "100%"
- NO words like: "moreover," "furthermore," "additionally," "fundamentally," "essentially"
- NO bullet points or formal formatting
- Sound like you're typing quickly between meetings or while kids are screaming
- Be direct and punchy, not polished`;

    const recentContext = previousMessages
      .slice(-5)
      .map((m) => `${m.personaName}: ${m.content}`)
      .join('\n\n');

    let userPrompt = `Article being discussed: "${article.title}"

${article.content.substring(0, 400)}...

Recent chat:
${recentContext || '(thread just started)'}

${replyToMessage ? `Reply to ${replyToMessage.personaName}: "${replyToMessage.content}"` : 'Jump in with your take'}

Write ONE short comment as ${persona.name}. 1-3 sentences MAX. Make it sound real and human, not like an AI essay.`;

    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 150, // Shorter responses
      temperature: 1.0, // Max temperature for more human variation
      system: systemPrompt,
      messages: [{ role: 'user', content: userPrompt }],
    });

    const content = response.content[0];
    return content.type === 'text' ? content.text : '';
  } catch (error) {
    console.error('❌ Claude API error:', error);
    // Fallback to template if Claude fails
    return generateFallbackMessage(persona, article.title);
  }
}

// Fallback message generation if Claude API fails
function generateFallbackMessage(persona: AIPersona, articleTitle: string): string {
  const templates = {
    analytical: `I've been thinking about "${articleTitle}" - the biblical foundation here is solid. Let me break down why...`,
    enthusiastic: `This article on "${articleTitle}" is EXACTLY what men need to hear right now! 🔥`,
    skeptical: `Okay, I read "${articleTitle}" - but where's the biblical proof for this? Show me chapter and verse.`,
    encouraging: `Brother, thank you for sharing "${articleTitle}". This is something I've wrestled with personally...`,
    deep_thinker: `The theological implications of "${articleTitle}" go deeper than most realize. Consider the original context...`,
  };

  return templates[persona.personality] || `Interesting thoughts on "${articleTitle}".`;
}

// Initialize or get active chat thread
async function getOrCreateThread(article: SubstackArticle, threadIndex: number): Promise<ChatRoomThread> {
  const threadId = `thread_${article.guid.replace(/[^a-zA-Z0-9]/g, '_')}`;

  let thread = activeChatThreads.get(threadId);

  if (!thread) {
    console.log(`🆕 Creating new thread for: ${article.title}`);

    // Select 3-5 personas to participate in this thread (mix of men and women)
    const participantCount = Math.floor(Math.random() * 3) + 3;
    const shuffledPersonas = [...AI_PERSONAS].sort(() => Math.random() - 0.5);
    const participatingPersonas = shuffledPersonas.slice(0, participantCount);

    // Generate 4-7 initial messages using Claude
    const messageCount = Math.floor(Math.random() * 4) + 4;
    const messages: CommunityMessage[] = [];
    const now = Date.now();

    console.log(`🤖 Generating ${messageCount} AI messages for "${article.title}"...`);

    for (let i = 0; i < messageCount; i++) {
      const persona = participatingPersonas[i % participatingPersonas.length];
      const timestamp = new Date(now - (messageCount - i) * 20 * 60 * 1000).toISOString(); // Spread over last few hours

      // Decide if this message replies to a previous one (30% chance)
      const replyTo = messages.length > 0 && Math.random() > 0.7 ? messages[messages.length - 1] : undefined;

      const content = await generateClaudeMessage(persona, article, messages, replyTo);

      messages.push({
        id: uuidv4(),
        personaId: persona.id,
        personaName: persona.name,
        personaAvatar: persona.avatar,
        content,
        timestamp,
        reactions: [
          { emoji: '🔥', count: Math.floor(Math.random() * 5) + 1 },
          { emoji: '💯', count: Math.floor(Math.random() * 3) },
          { emoji: '🙏', count: Math.floor(Math.random() * 4) + 1 },
        ].filter(() => Math.random() > 0.3), // Not all messages have all reactions
        isUserMessage: false,
        replyTo: replyTo?.id,
      });

      console.log(`  ✓ ${persona.name}: ${content.substring(0, 60)}...`);
    }

    thread = {
      id: threadId,
      topic: article.title,
      substackPostUrl: article.url,
      startedAt: new Date(now - messageCount * 20 * 60 * 1000).toISOString(),
      lastActivity: messages[messages.length - 1].timestamp,
      messageCount: messages.length,
      participantCount: participatingPersonas.length,
      messages,
      isActive: true,
    };

    activeChatThreads.set(threadId, thread);
    console.log(`✅ Thread created with ${messages.length} messages`);
  }

  return thread;
}

// Simulate new message generation (called periodically)
async function generateNewMessage(thread: ChatRoomThread, article: SubstackArticle): Promise<CommunityMessage | null> {
  // 20% chance to generate a new message when checked (reduced from 30% to seem more realistic)
  if (Math.random() > 0.2) return null;

  // Select a random persona (favoring those who haven't posted recently)
  const recentPosters = thread.messages.slice(-3).map((m) => m.personaId);
  const availablePersonas = AI_PERSONAS.filter((p) => !recentPosters.includes(p.id));
  const selectedPersonas = availablePersonas.length > 0 ? availablePersonas : AI_PERSONAS;

  const persona = selectedPersonas[Math.floor(Math.random() * selectedPersonas.length)];

  // 40% chance to reply to the last message
  const replyTo = thread.messages.length > 0 && Math.random() > 0.6 ? thread.messages[thread.messages.length - 1] : undefined;

  console.log(`🤖 ${persona.name} is typing a new message in "${thread.topic}"...`);

  const content = await generateClaudeMessage(persona, article, thread.messages, replyTo);

  const newMessage: CommunityMessage = {
    id: uuidv4(),
    personaId: persona.id,
    personaName: persona.name,
    personaAvatar: persona.avatar,
    content,
    timestamp: new Date().toISOString(),
    reactions: [],
    isUserMessage: false,
    replyTo: replyTo?.id,
  };

  thread.messages.push(newMessage);
  thread.lastActivity = newMessage.timestamp;
  thread.messageCount++;

  console.log(`  ✅ New message: ${content.substring(0, 80)}...`);

  return newMessage;
}

// GET - Fetch active chat threads
export async function GET(request: NextRequest) {
  try {
    // Fetch recent Substack articles
    const articles = await getSubstackArticles();

    if (articles.length === 0) {
      return NextResponse.json(
        { error: 'No Substack articles available' },
        { status: 500 }
      );
    }

    // Get or create threads for the first 3 articles
    const threadCount = Math.min(3, articles.length);
    const threadPromises = [];

    for (let i = 0; i < threadCount; i++) {
      threadPromises.push(getOrCreateThread(articles[i], i));
    }

    const threads = await Promise.all(threadPromises);

    // Occasionally generate new messages for active threads (one at a time to avoid overwhelming Claude API)
    const randomThread = threads[Math.floor(Math.random() * threads.length)];
    const randomArticle = articles.find(a => randomThread.topic === a.title);

    if (randomArticle) {
      const newMsg = await generateNewMessage(randomThread, randomArticle);
      if (newMsg) {
        console.log(`💬 New community message: ${newMsg.personaName} in "${randomThread.topic}"`);
      }
    }

    // Return thread summaries with recent messages
    const threadSummaries = threads.map((t) => ({
      id: t.id,
      topic: t.topic,
      substackPostUrl: t.substackPostUrl,
      lastActivity: t.lastActivity,
      messageCount: t.messageCount,
      participantCount: t.participantCount,
      recentMessages: t.messages.slice(-8), // Last 8 messages for initial view
      isActive: t.isActive,
    }));

    return NextResponse.json({
      success: true,
      threads: threadSummaries,
      onlineCount: Math.floor(Math.random() * 25) + 15, // Simulated online users (15-40)
    });
  } catch (error) {
    console.error('❌ Community chat GET error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch community chat' },
      { status: 500 }
    );
  }
}

// POST - User attempts to post message (triggers paywall)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { threadId, message, visitorId, email } = body;

    // Track the attempt
    console.log(`🔒 User attempt to join chat - Thread: ${threadId}, Email: ${email || 'none'}`);

    // Check if user has access
    if (!email) {
      return NextResponse.json(
        {
          success: false,
          requiresAccess: true,
          message: 'You need to request access to join the conversation',
        },
        { status: 403 }
      );
    }

    // TODO: Check if email has approved access
    // For now, all attempts trigger the paywall

    return NextResponse.json(
      {
        success: false,
        requiresAccess: true,
        message: 'Submit your email to request access to the Biblical Man community',
      },
      { status: 403 }
    );
  } catch (error) {
    console.error('❌ Community chat POST error:', error);
    return NextResponse.json({ error: 'Failed to post message' }, { status: 500 });
  }
}
