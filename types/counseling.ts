// Counseling credit system types

export interface CounselingUser {
  id: string;
  email: string;
  credits: number;
  totalCreditsEarned: number;
  createdAt: string;
  lastCreditUpdate: string;
}

export interface CreditTransaction {
  id: string;
  userId: string;
  amount: number; // positive for adding, negative for using
  type: 'purchase' | 'initial_bonus' | 'usage' | 'refund';
  stripePaymentId?: string;
  createdAt: string;
  metadata?: {
    conversationId?: string;
    wordCount?: number;
    [key: string]: any;
  };
}

export interface CounselingSession {
  id: string;
  userId: string;
  messages: CounselingMessage[];
  mode: 'counselor' | 'standard';
  creditsUsed: number;
  startedAt: string;
  lastActivity: string;
}

export interface CounselingMessage {
  id: string;
  sender: 'user' | 'ai';
  content: string;
  timestamp: string;
  mode: 'counselor' | 'standard';
  creditsUsed?: number;
  bibleReferences?: BibleReference[];
}

export interface BibleReference {
  book: string;
  chapter: number;
  verse?: number;
  text: string;
  version: 'KJV';
}

export const CREDIT_PRICING = {
  INITIAL_FREE_CREDITS: 5,
  CREDITS_PER_PURCHASE: 50, // $37 gets you 50 credits
  PURCHASE_PRICE: 37.00,
  CREDIT_COST_PER_MESSAGE: {
    standard: 0, // Free mode
    counselor: 1, // 1 credit per counselor message
  }
};

export const STRIPE_PRODUCT = {
  PRICE_ID: 'price_biblical_counseling_credits', // Will be set after Stripe setup
  PAYMENT_LINK: 'https://buy.stripe.com/5kQdRa9Ne7SFdaw2JwcMM1P',
};
