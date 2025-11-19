import { NextRequest, NextResponse } from 'next/server';
import { AI_PERSONAS, ChatRoomThread, CommunityMessage } from '@/types/community';
import { v4 as uuidv4 } from 'uuid';

// In-memory storage for simulated chat (will persist in DB later)
const activeChatThreads = new Map<string, ChatRoomThread>();

// Sample discussion topics based on recent Substack content
const DISCUSSION_TOPICS = [
  {
    topic: "Why Most Christian Men Are Spiritually Soft",
    substackUrl: "https://biblicalman.substack.com/p/why-christian-men-are-soft",
    keywords: ["soft Christianity", "biblical masculinity", "spiritual weakness", "accountability"],
  },
  {
    topic: "The Submission Fraud: What Your Pastor Won't Tell You",
    substackUrl: "https://biblicalman.substack.com/p/submission-fraud",
    keywords: ["submission", "marriage", "headship", "authority"],
  },
  {
    topic: "How to Actually Study the Bible (Not Just Read It)",
    substackUrl: "https://biblicalman.substack.com/p/bible-study-methods",
    keywords: ["Bible study", "Scripture", "hermeneutics", "application"],
  },
  {
    topic: "Your Son Is Being Softened While You Sleep",
    substackUrl: "https://biblicalman.substack.com/p/raising-sons",
    keywords: ["parenting", "sons", "cultural warfare", "masculinity"],
  },
];

// Generate realistic AI messages based on persona and topic
function generateAIMessage(persona: typeof AI_PERSONAS[0], topic: string, keywords: string[]): string {
  const messageTemplates = {
    analytical: [
      `I've been studying ${keywords[0]} for years, and here's what most people miss: the original Greek/Hebrew context changes everything. In ${Math.random() > 0.5 ? 'Ephesians 5' : '1 Peter 3'}, the word actually means...`,
      `Let me break this down logically. The issue with ${keywords[1]} isn't what most pastors teach. If you look at the biblical model, it's actually about ${keywords[2]}, not ${keywords[0]}.`,
      `This reminds me of what happened in my own marriage 10 years ago. We were struggling with ${keywords[1]} until I realized the Bible says something completely different than what we'd been taught.`,
    ],
    enthusiastic: [
      `BRO! This article on ${topic.split(':')[0]} hit me HARD! 🔥 I've been implementing this with my ${Math.floor(Math.random() * 3) + 3} kids and the transformation is INSANE!`,
      `Can we just talk about how REVOLUTIONARY this is?? ${keywords[0]} is the KEY that unlocks everything! I wish someone had told me this 15 years ago!`,
      `EXACTLY! This is what I've been trying to tell guys at my church! ${keywords[1]} isn't optional - it's BIBLICAL MANHOOD 101!`,
    ],
    skeptical: [
      `I'm gonna push back on this a bit. Where's the biblical proof for ${keywords[0]}? I see a lot of claims but I need chapter and verse.`,
      `Honest question - how is this different from what every other "Christian masculinity" teacher says? I've been burned before by cultural Christianity dressed up as truth.`,
      `Okay, I'll admit this ${topic.split(':')[0]} article challenged me. As an ex-atheist, I'm always looking for logical consistency, and this actually holds up scripturally.`,
    ],
    encouraging: [
      `Brother, thank you for sharing this. ${keywords[0]} is something I struggled with for YEARS in ministry. Here's what finally clicked for me...`,
      `Man, this is so timely. Just had a conversation with a friend going through exactly this with ${keywords[1]}. Sent him this article immediately.`,
      `Love seeing men hungry for truth like this. ${keywords[2]} changed my marriage, my parenting, everything. Happy to share more if anyone wants to DM.`,
    ],
    deep_thinker: [
      `Fascinating. The theological implications of ${keywords[0]} actually connect to ${keywords[2]} in ways most people don't see. Let me explain...`,
      `This goes deeper than most realize. When you understand the covenantal framework of ${keywords[1]}, it completely reframes ${keywords[0]}.`,
      `In seminary, we spent an entire semester on this. The Hebrew word for "${keywords[1]}" appears 47 times in the OT, and EVERY SINGLE TIME it refers to...`,
    ],
  };

  const templates = messageTemplates[persona.personality];
  return templates[Math.floor(Math.random() * templates.length)];
}

// Initialize or get active chat thread
function getOrCreateThread(topicIndex: number = 0): ChatRoomThread {
  const topic = DISCUSSION_TOPICS[topicIndex];
  const threadId = `thread_${topic.topic.replace(/\s+/g, '_').toLowerCase()}`;

  let thread = activeChatThreads.get(threadId);

  if (!thread) {
    // Create new thread with simulated messages
    const messages: CommunityMessage[] = [];
    const participatingPersonas = AI_PERSONAS.slice(0, Math.floor(Math.random() * 3) + 2);

    // Generate 5-8 initial messages
    const messageCount = Math.floor(Math.random() * 4) + 5;
    const now = Date.now();

    for (let i = 0; i < messageCount; i++) {
      const persona = participatingPersonas[i % participatingPersonas.length];
      const timestamp = new Date(now - (messageCount - i) * 15 * 60 * 1000).toISOString(); // Spread over last few hours

      messages.push({
        id: uuidv4(),
        personaId: persona.id,
        personaName: persona.name,
        personaAvatar: persona.avatar,
        content: generateAIMessage(persona, topic.topic, topic.keywords),
        timestamp,
        reactions: [
          { emoji: '🔥', count: Math.floor(Math.random() * 5) + 1 },
          { emoji: '💯', count: Math.floor(Math.random() * 3) },
          { emoji: '🙏', count: Math.floor(Math.random() * 4) + 1 },
        ],
        isUserMessage: false,
      });
    }

    thread = {
      id: threadId,
      topic: topic.topic,
      substackPostUrl: topic.substackUrl,
      startedAt: new Date(now - messageCount * 15 * 60 * 1000).toISOString(),
      lastActivity: messages[messages.length - 1].timestamp,
      messageCount: messages.length,
      participantCount: participatingPersonas.length,
      messages,
      isActive: true,
    };

    activeChatThreads.set(threadId, thread);
  }

  return thread;
}

// Simulate new message generation (called periodically)
function generateNewMessage(thread: ChatRoomThread): CommunityMessage | null {
  // 30% chance to generate a new message when checked
  if (Math.random() > 0.3) return null;

  const activePersonas = AI_PERSONAS.filter(p => Math.random() > 0.5);
  if (activePersonas.length === 0) return null;

  const persona = activePersonas[Math.floor(Math.random() * activePersonas.length)];
  const topic = DISCUSSION_TOPICS.find(t => thread.topic === t.topic);
  if (!topic) return null;

  const newMessage: CommunityMessage = {
    id: uuidv4(),
    personaId: persona.id,
    personaName: persona.name,
    personaAvatar: persona.avatar,
    content: generateAIMessage(persona, topic.topic, topic.keywords),
    timestamp: new Date().toISOString(),
    reactions: [],
    isUserMessage: false,
  };

  thread.messages.push(newMessage);
  thread.lastActivity = newMessage.timestamp;
  thread.messageCount++;

  return newMessage;
}

// GET - Fetch active chat threads
export async function GET(request: NextRequest) {
  try {
    // Get or create a few active threads
    const threads = [
      getOrCreateThread(0),
      getOrCreateThread(1),
      getOrCreateThread(2),
    ];

    // Occasionally generate new messages for active threads
    threads.forEach(thread => {
      const newMsg = generateNewMessage(thread);
      if (newMsg) {
        console.log(`🤖 Generated new AI message in ${thread.topic}: "${newMsg.content.substring(0, 50)}..."`);
      }
    });

    // Return thread summaries
    const threadSummaries = threads.map(t => ({
      id: t.id,
      topic: t.topic,
      substackPostUrl: t.substackPostUrl,
      lastActivity: t.lastActivity,
      messageCount: t.messageCount,
      participantCount: t.participantCount,
      recentMessages: t.messages.slice(-3), // Last 3 messages as preview
      isActive: t.isActive,
    }));

    return NextResponse.json({
      success: true,
      threads: threadSummaries,
      onlineCount: Math.floor(Math.random() * 25) + 15, // Simulated online users
    });
  } catch (error) {
    console.error('Community chat GET error:', error);
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

    // Check if user has access
    if (!email) {
      return NextResponse.json({
        success: false,
        requiresAccess: true,
        message: 'You need to request access to join the conversation',
      }, { status: 403 });
    }

    // TODO: Check if email has approved access
    // For now, all attempts trigger the paywall

    return NextResponse.json({
      success: false,
      requiresAccess: true,
      message: 'Submit your email to request access to the Biblical Man community',
    }, { status: 403 });
  } catch (error) {
    console.error('Community chat POST error:', error);
    return NextResponse.json(
      { error: 'Failed to post message' },
      { status: 500 }
    );
  }
}
