/**
 * DEEP ENGAGEMENT ANALYTICS
 *
 * Tracks detailed behavioral metrics:
 * - Visual attention (eyes): What they read, how long, scroll depth
 * - Audio attention (ears): What they listen to, how long, skip behavior
 * - Interaction patterns: Clicks, highlights, notes, replays
 * - Psychographic signals: Preferences, browsing patterns, conversion triggers
 */

export interface BibleEngagement {
  versesRead: string[]; // Array of verse references read (e.g., "John 3:16")
  totalReadingTime: number; // Seconds spent reading
  audioListeningTime: number; // Seconds spent listening to audio Bible
  chaptersCompleted: string[]; // Full chapters read
  highlightCount: number;
  noteCount: number;
  searchQueries: string[]; // What they search for reveals intent
  favoriteBooks: string[]; // Most read books
  readingSpeed: number; // Words per minute (calculated)
  scrollDepth: number; // Percentage of content scrolled
  timeOfDayPreference: 'morning' | 'afternoon' | 'evening' | 'night';
  lastVerseRead: string;
  consecutiveDays: number; // Reading streak
}

export interface RadioEngagement {
  totalListeningTime: number; // Total seconds listened
  sessionsCount: number; // How many times they've used radio
  averageSessionLength: number; // Average listening session
  skipCount: number; // How many times they skipped
  volumeChanges: number; // Engagement indicator
  peakListeningHours: number[]; // Hours of day they listen most (0-23)
  backgroundListening: boolean; // Are they multitasking?
  favoriteGenres: string[]; // Teaching, worship, storytelling
  returnListener: boolean; // Do they come back?
  bingeListener: boolean; // Long sessions (>30min)
  loyaltyScore: number; // 0-100 based on consistency
}

export interface SamEngagement {
  totalMessages: number;
  totalChatTime: number; // Seconds in chat
  averageResponseTime: number; // How fast they reply
  counselorModeUsed: boolean;
  deepQuestions: string[]; // Longer, more personal questions
  topicsDiscussed: string[]; // Marriage, leadership, Bible study, etc.
  sentimentTrend: 'improving' | 'declining' | 'stable'; // Are they getting better?
  engagementQuality: 'shallow' | 'medium' | 'deep'; // Based on question depth
  returnRate: number; // How often they come back to chat
  problemSolvingSuccess: boolean; // Did Sam help them?
}

export interface VisualAttentionMetrics {
  totalScrolls: number;
  totalClicks: number;
  mouseMovements: number; // Activity indicator
  timeOnPage: Record<string, number>; // Page URL -> seconds
  ctaClicks: Record<string, number>; // Which CTAs they clicked
  productViews: string[]; // Products they looked at
  exitIntentTriggered: boolean;
  exitIntentConverted: boolean;
  heatmapData: { x: number; y: number; intensity: number }[]; // Click heatmap
  mostViewedSections: string[]; // What content got the most eyes
}

export interface AudioAttentionMetrics {
  totalAudioTime: number; // All audio consumed
  radioTime: number;
  bibleAudioTime: number;
  podcastTime: number;
  preferredAudioFormat: 'reading' | 'teaching' | 'worship' | 'mixed';
  audioCompletionRate: number; // Do they finish what they start?
  multitaskingIndicator: boolean; // Background listening?
  audioEngagementScore: number; // 0-100
}

export interface PsychographicSignals {
  personalityType: 'alpha' | 'beta' | 'seeker' | 'skeptic' | 'desperate';
  conversionReadiness: number; // 0-100
  painPoints: string[];
  motivators: string[];
  resistanceLevel: 'low' | 'medium' | 'high';
  messageFramingPreference: 'authority' | 'empathy' | 'urgency' | 'social-proof' | 'fear';
  copyToneResponse: 'aggressive' | 'gentle' | 'challenging' | 'supportive';
  triggerEvents: string[]; // What made them convert/engage
  decisionSpeed: 'fast' | 'slow' | 'deliberate'; // How quickly they make decisions
  priceSeNsitivity: 'high' | 'medium' | 'low';
  socialProofInfluence: number; // 0-100, how much testimonials affect them
  urgencySensitivity: number; // 0-100, how much scarcity/urgency works
  trustLevel: 'low' | 'building' | 'high'; // Based on behavior
}

export interface DeepEngagementProfile {
  visitorId: string;
  bible: BibleEngagement;
  radio: RadioEngagement;
  sam: SamEngagement;
  visual: VisualAttentionMetrics;
  audio: AudioAttentionMetrics;
  psychographic: PsychographicSignals;
  overallEngagementScore: number; // 0-100 composite score
  lifetimeValue: number; // Estimated based on behavior
  churnRisk: number; // 0-100, likelihood they'll stop engaging
  nextBestAction: string; // What to show them next
  conversionProbability: number; // 0-100
}

/**
 * Calculate overall engagement score from all metrics
 */
export function calculateEngagementScore(profile: Partial<DeepEngagementProfile>): number {
  let score = 0;
  let factors = 0;

  // Bible engagement (20% of score)
  if (profile.bible) {
    score += Math.min((profile.bible.totalReadingTime / 600) * 20, 20); // 10 min = max
    score += Math.min((profile.bible.versesRead?.length || 0) / 50 * 10, 10); // 50 verses = max
    score += Math.min((profile.bible.highlightCount || 0) / 10 * 5, 5); // 10 highlights = max
    factors += 3;
  }

  // Radio engagement (20% of score)
  if (profile.radio) {
    score += Math.min((profile.radio.totalListeningTime / 1800) * 20, 20); // 30 min = max
    score += Math.min((profile.radio.sessionsCount || 0) / 5 * 10, 10); // 5 sessions = max
    if (profile.radio.returnListener) score += 10;
    factors += 3;
  }

  // Sam engagement (20% of score)
  if (profile.sam) {
    score += Math.min((profile.sam.totalMessages || 0) / 20 * 10, 10); // 20 messages = max
    score += Math.min((profile.sam.totalChatTime / 600) * 10, 10); // 10 min = max
    if (profile.sam.counselorModeUsed) score += 5;
    if (profile.sam.engagementQuality === 'deep') score += 10;
    else if (profile.sam.engagementQuality === 'medium') score += 5;
    factors += 4;
  }

  // Visual attention (20% of score)
  if (profile.visual) {
    score += Math.min((profile.visual.totalClicks || 0) / 20 * 10, 10); // 20 clicks = max
    const totalPageTime = Object.values(profile.visual.timeOnPage || {}).reduce((a, b) => a + b, 0);
    score += Math.min(totalPageTime / 600 * 10, 10); // 10 min total = max
    if (profile.visual.exitIntentConverted) score += 10;
    factors += 3;
  }

  // Audio attention (20% of score)
  if (profile.audio) {
    score += Math.min((profile.audio.totalAudioTime / 1800) * 15, 15); // 30 min = max
    score += Math.min((profile.audio.audioCompletionRate || 0), 10); // 100% = max 10
    factors += 2;
  }

  return factors > 0 ? Math.min(Math.round(score / factors * 100), 100) : 0;
}

/**
 * Calculate churn risk based on engagement patterns
 */
export function calculateChurnRisk(profile: Partial<DeepEngagementProfile>): number {
  let risk = 50; // Start at neutral

  // Decreasing engagement over time = high risk
  if (profile.bible && profile.bible.consecutiveDays === 0) risk += 20;
  if (profile.radio && !profile.radio.returnListener) risk += 15;
  if (profile.sam && profile.sam.returnRate < 0.3) risk += 15;

  // High engagement = low risk
  if (profile.overallEngagementScore && profile.overallEngagementScore > 70) risk -= 30;
  if (profile.bible && profile.bible.consecutiveDays > 7) risk -= 20;
  if (profile.radio && profile.radio.bingeListener) risk -= 15;

  // Conversion indicators = low risk
  if (profile.visual && profile.visual.exitIntentConverted) risk -= 20;
  if (profile.psychographic && profile.psychographic.conversionReadiness > 70) risk -= 15;

  return Math.max(0, Math.min(100, risk));
}

/**
 * Predict lifetime value based on engagement
 */
export function predictLifetimeValue(profile: Partial<DeepEngagementProfile>): number {
  let ltv = 0;

  // High engagement = higher LTV
  if (profile.overallEngagementScore) {
    ltv += (profile.overallEngagementScore / 100) * 50;
  }

  // Bible users who highlight/note are premium users
  if (profile.bible && (profile.bible.highlightCount > 5 || profile.bible.noteCount > 3)) {
    ltv += 30;
  }

  // Radio loyalty indicates commitment
  if (profile.radio && profile.radio.loyaltyScore > 70) {
    ltv += 25;
  }

  // Deep Sam conversations = serious users
  if (profile.sam && profile.sam.engagementQuality === 'deep') {
    ltv += 40;
  }

  // Conversion signals
  if (profile.psychographic) {
    ltv += (profile.psychographic.conversionReadiness / 100) * 60;
    if (profile.psychographic.trustLevel === 'high') ltv += 30;
  }

  // Email captured = huge indicator
  if (profile.visual && profile.visual.exitIntentConverted) {
    ltv += 50;
  }

  return Math.round(ltv);
}

/**
 * Determine next best action for visitor
 */
export function determineNextBestAction(profile: Partial<DeepEngagementProfile>): string {
  // If they haven't given email, that's always priority
  if (profile.visual && !profile.visual.exitIntentConverted) {
    if (profile.overallEngagementScore && profile.overallEngagementScore > 60) {
      return 'AGGRESSIVE_EMAIL_CAPTURE'; // High engagement, no email = urgent
    }
    return 'SOFT_EMAIL_CAPTURE';
  }

  // Bible users -> deeper Bible resources
  if (profile.bible && profile.bible.totalReadingTime > 600) {
    return 'OFFER_BIBLE_STUDY_COURSE';
  }

  // Radio listeners -> premium content
  if (profile.radio && profile.radio.bingeListener) {
    return 'OFFER_PREMIUM_RADIO_ACCESS';
  }

  // Deep Sam conversations -> counseling
  if (profile.sam && profile.sam.engagementQuality === 'deep') {
    if (profile.sam.counselorModeUsed) {
      return 'OFFER_PERSONAL_COUNSELING';
    }
    return 'UNLOCK_COUNSELOR_MODE';
  }

  // High conversion readiness -> direct product
  if (profile.psychographic && profile.psychographic.conversionReadiness > 80) {
    return 'SHOW_MAIN_PRODUCT';
  }

  // Low engagement -> engagement hook
  if (profile.overallEngagementScore && profile.overallEngagementScore < 30) {
    return 'SHOW_FREE_RESOURCE_HOOK';
  }

  return 'CONTINUE_NURTURE';
}
