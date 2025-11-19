// Community chat room and welcome sequence types

export interface AIPersona {
  id: string;
  name: string;
  avatar: string;
  role: 'regular' | 'veteran' | 'moderator';
  joinedDate: string;
  personality: 'analytical' | 'enthusiastic' | 'skeptical' | 'encouraging' | 'deep_thinker';
  favoriteTopics: string[];
  responseStyle: string;
}

export interface CommunityMessage {
  id: string;
  personaId: string;
  personaName: string;
  personaAvatar: string;
  content: string;
  timestamp: string;
  reactions: Array<{ emoji: string; count: number }>;
  isUserMessage: boolean;
  replyTo?: string;
}

export interface ChatRoomThread {
  id: string;
  topic: string;
  substackPostUrl?: string;
  startedAt: string;
  lastActivity: string;
  messageCount: number;
  participantCount: number;
  messages: CommunityMessage[];
  isActive: boolean;
}

export interface WelcomeSequenceStep {
  id: string;
  order: number;
  type: 'question' | 'education' | 'resource_preview' | 'community_peek' | 'qualification';
  content: string;
  options?: Array<{
    text: string;
    value: string;
    leadsTo?: string; // Next step ID
    qualificationScore: number; // -10 to +10
  }>;
  skipAfter?: number; // Seconds before auto-advancing
}

export interface VisitorJourney {
  visitorId: string;
  sessionId: string;
  currentStep: string;
  completedSteps: string[];
  qualificationScore: number; // Running total
  leadTemperature: 'cold' | 'warm' | 'hot';
  personalizedMessage?: string;
  startedAt: string;
  lastInteraction: string;
  answers: Record<string, string>;
}

export interface CommunityAccess {
  userId: string;
  email: string;
  status: 'pending' | 'approved' | 'denied';
  requestedAt: string;
  approvedAt?: string;
  deniedReason?: string;
  accessLevel: 'free' | 'premium' | 'vip';
  canPostMessages: boolean;
  canReact: boolean;
}

// Simulated community activity configuration
export interface CommunitySimulation {
  baseActivityLevel: 'low' | 'medium' | 'high'; // Messages per hour
  peakHours: number[]; // Hours of day (0-23) with increased activity
  activePersonas: string[]; // IDs of personas currently "online"
  currentThreads: ChatRoomThread[];
  nextMessageSchedule: Array<{
    personaId: string;
    scheduledFor: string;
    content: string;
    threadId: string;
  }>;
}

// Welcome sequence configuration
export const WELCOME_SEQUENCE_STEPS: WelcomeSequenceStep[] = [
  {
    id: 'intro',
    order: 1,
    type: 'education',
    content: "Welcome to Biblical Man! This isn't just a website - it's a community of men reclaiming biblical masculinity. Let me show you around...",
    skipAfter: 8,
  },
  {
    id: 'struggle_identification',
    order: 2,
    type: 'qualification',
    content: "Quick question - what brought you here today?",
    options: [
      { text: "My marriage is struggling", value: "marriage", qualificationScore: 8 },
      { text: "I want to grow spiritually", value: "spiritual", qualificationScore: 6 },
      { text: "I'm battling sin patterns", value: "sin", qualificationScore: 9 },
      { text: "Just browsing", value: "browsing", qualificationScore: 1 },
      { text: "Looking for resources to lead better", value: "leadership", qualificationScore: 7 },
    ],
  },
  {
    id: 'urgency_check',
    order: 3,
    type: 'qualification',
    content: "On a scale of 1-10, how urgent does this feel right now?",
    options: [
      { text: "10 - I need help NOW", value: "10", qualificationScore: 10 },
      { text: "7-9 - Pretty urgent", value: "8", qualificationScore: 7 },
      { text: "4-6 - Important but not critical", value: "5", qualificationScore: 4 },
      { text: "1-3 - Just exploring", value: "2", qualificationScore: 1 },
    ],
  },
  {
    id: 'community_peek',
    order: 4,
    type: 'community_peek',
    content: "Here's what other men in the community are discussing right now. Click to see the conversation...",
  },
  {
    id: 'resource_match',
    order: 5,
    type: 'resource_preview',
    content: "Based on what you shared, here are the resources that could help you most:",
  },
  {
    id: 'sam_intro',
    order: 6,
    type: 'education',
    content: "Want personalized guidance? Sam is our AI counselor trained on thousands of hours of biblical counseling. Want to talk?",
    options: [
      { text: "Yes, let me talk to Sam", value: "yes", qualificationScore: 5 },
      { text: "Not right now", value: "no", qualificationScore: 0 },
    ],
  },
];

// AI Personas for community simulation
export const AI_PERSONAS: AIPersona[] = [
  {
    id: 'michael_thompson',
    name: 'Michael T.',
    avatar: '👨‍💼',
    role: 'veteran',
    joinedDate: '2023-01-15',
    personality: 'analytical',
    favoriteTopics: ['marriage', 'leadership', 'biblical-masculinity'],
    responseStyle: 'Analytical and detailed. Cites specific passages. Often shares personal experience from 15-year marriage.',
  },
  {
    id: 'david_king',
    name: 'David K.',
    avatar: '⚔️',
    role: 'moderator',
    joinedDate: '2022-08-20',
    personality: 'encouraging',
    favoriteTopics: ['spiritual-warfare', 'prayer', 'fatherhood'],
    responseStyle: 'Encouraging but direct. Focuses on practical application. Former pastor.',
  },
  {
    id: 'james_porter',
    name: 'James P.',
    avatar: '📖',
    role: 'regular',
    joinedDate: '2024-03-10',
    personality: 'deep_thinker',
    favoriteTopics: ['theology', 'scripture', 'biblical-counseling'],
    responseStyle: 'Thoughtful and precise. Loves diving deep into Greek/Hebrew. Seminary student.',
  },
  {
    id: 'mark_stevens',
    name: 'Mark S.',
    avatar: '💪',
    role: 'veteran',
    joinedDate: '2023-06-05',
    personality: 'enthusiastic',
    favoriteTopics: ['parenting', 'discipline', 'family-legacy'],
    responseStyle: 'High energy. Shares victories and struggles. Father of 5 boys.',
  },
  {
    id: 'joshua_white',
    name: 'Joshua W.',
    avatar: '🛡️',
    role: 'regular',
    joinedDate: '2024-01-22',
    personality: 'skeptical',
    favoriteTopics: ['apologetics', 'cultural-issues', 'truth'],
    responseStyle: 'Questions everything. Demands biblical proof. Ex-atheist convert.',
  },
];
