// Conversation storage and analytics types

export interface StoredConversation {
  id: string;
  userId: string; // email or generated ID
  sessionId: string; // unique session identifier
  startedAt: string;
  lastActivity: string;
  mode: 'standard' | 'counselor';
  totalMessages: number;
  userMessageCount: number;
  aiMessageCount: number;
  creditsUsed: number;
  topics: string[]; // extracted topics/themes
  painPoints: string[]; // extracted user problems
  status: 'active' | 'completed' | 'abandoned';
  metadata: {
    firstMessage: string;
    userAgent?: string;
    referrer?: string;
    conversationQuality?: 'high' | 'medium' | 'low'; // based on message count and engagement
  };
}

export interface ConversationMessage {
  id: string;
  conversationId: string;
  sessionId: string;
  userId: string;
  sender: 'user' | 'ai';
  content: string;
  mode: 'standard' | 'counselor';
  timestamp: string;
  metadata: {
    wordCount: number;
    containsScripture?: boolean;
    sentiment?: 'positive' | 'negative' | 'neutral';
    topics?: string[];
    creditUsed?: boolean;
  };
}

export interface ConversationInsights {
  // Topic Analysis
  topTopics: Array<{ topic: string; count: number }>;
  commonPainPoints: Array<{ issue: string; frequency: number }>;

  // User Behavior
  averageMessagesPerConversation: number;
  conversionRate: number; // % who upgrade to counselor mode
  averageSessionDuration: number;

  // Content Analysis
  mostEffectiveResponses: Array<{ content: string; engagement: number }>;
  commonUserQuestions: Array<{ question: string; count: number }>;

  // Business Intelligence
  topReferringSources: Array<{ source: string; conversions: number }>;
  peakUsageHours: Array<{ hour: number; usage: number }>;
  userJourneyPatterns: Array<{ pattern: string; frequency: number }>;
}

export interface TrainingDataExport {
  conversations: Array<{
    id: string;
    mode: 'standard' | 'counselor';
    quality: 'high' | 'medium' | 'low';
    exchanges: Array<{
      user: string;
      assistant: string;
      topic: string;
    }>;
  }>;
  metadata: {
    totalConversations: number;
    dateRange: { start: string; end: string };
    exportedAt: string;
  };
}
