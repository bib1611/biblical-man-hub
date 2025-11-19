/**
 * ADVANCED PSYCHOGRAPHIC PROFILING & BEHAVIORAL TARGETING
 *
 * Uses visitor intelligence (IP, cookies, behavior) to create psychological profiles
 * and deploy targeted messaging for maximum conversion.
 */

import { VisitorProfile } from '@/hooks/usePersonalization';

export interface PsychographicProfile {
  // Core psychological traits
  personalityType: 'alpha' | 'beta' | 'seeker' | 'skeptic' | 'desperate';
  painPoints: string[];
  motivators: string[];
  resistanceLevel: 'low' | 'medium' | 'high';

  // Behavioral patterns
  browsingPattern: 'researcher' | 'impulse' | 'comparison' | 'lurker';
  engagementStyle: 'deep' | 'shallow' | 'scattered';
  conversionReadiness: number; // 0-100

  // Targeting strategy
  messageFraming: 'authority' | 'empathy' | 'urgency' | 'social-proof' | 'fear';
  copyTone: 'aggressive' | 'gentle' | 'challenging' | 'supportive';
  visualTriggers: string[];

  // Advanced tactics
  scarcityTactic: string;
  socialProofType: 'celebrity' | 'peer' | 'expert' | 'numbers';
  urgencyLevel: 'soft' | 'medium' | 'aggressive';
}

/**
 * BUILD PSYCHOGRAPHIC PROFILE FROM VISITOR INTELLIGENCE
 */
export function buildPsychographicProfile(visitor: VisitorProfile): PsychographicProfile {
  // PERSONALITY TYPE DETECTION
  let personalityType: PsychographicProfile['personalityType'] = 'seeker';

  // ALPHA: Quick decisions, high engagement, direct traffic
  if (
    visitor.pageViews >= 3 &&
    visitor.timeOnSite >= 180 && // 3+ minutes
    visitor.trafficSource === 'Direct'
  ) {
    personalityType = 'alpha';
  }

  // BETA: Slow to decide, lots of research, multiple visits
  if (
    visitor.visitCount >= 3 &&
    visitor.pageViews >= 10 &&
    !visitor.hasEmail &&
    visitor.trafficSource?.includes('Google')
  ) {
    personalityType = 'beta';
  }

  // DESPERATE: High engagement but bouncing, pain-based search terms
  if (
    visitor.timeOnSite >= 300 && // 5+ minutes
    !visitor.hasEmail &&
    visitor.leadScore >= 60 &&
    (visitor.trafficSource?.includes('Google') || visitor.trafficSource?.includes('search'))
  ) {
    personalityType = 'desperate';
  }

  // SKEPTIC: Low engagement, multiple quick visits, no interaction
  if (
    visitor.visitCount >= 2 &&
    visitor.pageViews <= 3 &&
    visitor.timeOnSite <= 60 &&
    !visitor.hasInteractedWithSam &&
    !visitor.hasUsedBible
  ) {
    personalityType = 'skeptic';
  }

  // PAIN POINTS DETECTION
  const painPoints: string[] = [];

  if (visitor.hasUsedBible) painPoints.push('spiritual-confusion');
  if (visitor.hasInteractedWithSam) painPoints.push('needs-guidance');
  if (visitor.pagesVisited.some(p => p.includes('product'))) painPoints.push('looking-for-solutions');
  if (visitor.timeOnSite >= 300 && !visitor.hasEmail) painPoints.push('overwhelmed');
  if (visitor.visitCount >= 3) painPoints.push('trust-issues');
  if (visitor.trafficSource?.includes('Facebook')) painPoints.push('social-validation');

  // BROWSING PATTERN
  let browsingPattern: PsychographicProfile['browsingPattern'] = 'lurker';

  if (visitor.pageViews >= 5 && visitor.pagesVisited.length >= 4) {
    browsingPattern = 'researcher';
  } else if (visitor.pageViews <= 2 && visitor.timeOnSite <= 30) {
    browsingPattern = 'impulse';
  } else if (visitor.visitCount >= 2 && visitor.pageViews >= 3) {
    browsingPattern = 'comparison';
  }

  // RESISTANCE LEVEL
  let resistanceLevel: PsychographicProfile['resistanceLevel'] = 'medium';

  if (visitor.leadScore >= 60 && !visitor.hasEmail) {
    resistanceLevel = 'high'; // Interested but won't commit
  } else if (visitor.leadScore >= 40 || visitor.hasInteractedWithSam) {
    resistanceLevel = 'medium';
  } else if (visitor.leadScore <= 20 || visitor.timeOnSite <= 30) {
    resistanceLevel = 'low';
  }

  // CONVERSION READINESS (0-100)
  let conversionReadiness = 0;

  conversionReadiness += visitor.leadScore * 0.4; // Lead score is 40% of readiness
  conversionReadiness += Math.min(visitor.pageViews * 5, 20); // Page views up to 20%
  conversionReadiness += Math.min(visitor.timeOnSite / 10, 20); // Time on site up to 20%
  if (visitor.hasInteractedWithSam) conversionReadiness += 10;
  if (visitor.hasUsedBible) conversionReadiness += 10;
  if (visitor.visitCount >= 2) conversionReadiness += 10;

  conversionReadiness = Math.min(conversionReadiness, 100);

  // MESSAGE FRAMING STRATEGY
  let messageFraming: PsychographicProfile['messageFraming'] = 'social-proof';

  if (personalityType === 'alpha') {
    messageFraming = 'authority'; // Challenge them, show strength
  } else if (personalityType === 'desperate') {
    messageFraming = 'empathy'; // Understand their pain
  } else if (personalityType === 'skeptic') {
    messageFraming = 'social-proof'; // Show others doing it
  } else if (resistanceLevel === 'high') {
    messageFraming = 'urgency'; // Create FOMO
  } else if (visitor.trafficSource?.includes('Facebook')) {
    messageFraming = 'social-proof'; // Facebook users respond to social proof
  }

  // COPY TONE
  let copyTone: PsychographicProfile['copyTone'] = 'supportive';

  if (personalityType === 'alpha') {
    copyTone = 'challenging'; // "Are you man enough?"
  } else if (personalityType === 'desperate') {
    copyTone = 'gentle'; // "We understand what you're going through"
  } else if (resistanceLevel === 'high' && visitor.leadScore >= 60) {
    copyTone = 'aggressive'; // "Stop wasting time"
  }

  // SCARCITY TACTICS
  let scarcityTactic = 'Limited spots in next cohort';

  if (personalityType === 'alpha') {
    scarcityTactic = 'Only for serious men - application required';
  } else if (personalityType === 'desperate') {
    scarcityTactic = 'Next group starts Monday - don\'t miss out';
  } else if (visitor.visitCount >= 3) {
    scarcityTactic = 'You\'ve been considering this for a while - spots filling fast';
  } else if (conversionReadiness >= 70) {
    scarcityTactic = 'Limited to 100 members - 87 spots taken';
  }

  // SOCIAL PROOF TYPE
  let socialProofType: PsychographicProfile['socialProofType'] = 'numbers';

  if (personalityType === 'alpha') {
    socialProofType = 'celebrity'; // "As seen in..."
  } else if (personalityType === 'beta' || personalityType === 'skeptic') {
    socialProofType = 'peer'; // "Men just like you..."
  } else if (visitor.trafficSource?.includes('Google')) {
    socialProofType = 'expert'; // "Biblical scholars recommend..."
  }

  // URGENCY LEVEL
  let urgencyLevel: PsychographicProfile['urgencyLevel'] = 'soft';

  if (resistanceLevel === 'high' && conversionReadiness >= 70) {
    urgencyLevel = 'aggressive'; // "LAST CHANCE"
  } else if (visitor.visitCount >= 2) {
    urgencyLevel = 'medium'; // "Don't wait any longer"
  }

  return {
    personalityType,
    painPoints,
    motivators: getMotivators(personalityType, visitor),
    resistanceLevel,
    browsingPattern,
    engagementStyle: visitor.timeOnSite >= 180 ? 'deep' : visitor.pageViews >= 5 ? 'scattered' : 'shallow',
    conversionReadiness,
    messageFraming,
    copyTone,
    visualTriggers: getVisualTriggers(personalityType, visitor),
    scarcityTactic,
    socialProofType,
    urgencyLevel,
  };
}

/**
 * GET MOTIVATORS BASED ON PERSONALITY
 */
function getMotivators(
  personalityType: PsychographicProfile['personalityType'],
  visitor: VisitorProfile
): string[] {
  const motivators: string[] = [];

  switch (personalityType) {
    case 'alpha':
      motivators.push('dominance', 'mastery', 'status', 'control');
      break;
    case 'beta':
      motivators.push('security', 'approval', 'belonging', 'avoiding-mistakes');
      break;
    case 'desperate':
      motivators.push('relief', 'hope', 'transformation', 'escape-pain');
      break;
    case 'skeptic':
      motivators.push('proof', 'logic', 'testimonials', 'guarantees');
      break;
    case 'seeker':
      motivators.push('growth', 'meaning', 'purpose', 'community');
      break;
  }

  // Add context-specific motivators
  if (visitor.hasUsedBible) motivators.push('spiritual-depth');
  if (visitor.hasInteractedWithSam) motivators.push('personalized-guidance');
  if (visitor.trafficSource?.includes('Facebook')) motivators.push('social-belonging');
  if (visitor.country === 'United States') motivators.push('patriotism', 'traditional-values');

  return motivators;
}

/**
 * GET VISUAL TRIGGERS
 */
function getVisualTriggers(
  personalityType: PsychographicProfile['personalityType'],
  visitor: VisitorProfile
): string[] {
  const triggers: string[] = [];

  switch (personalityType) {
    case 'alpha':
      triggers.push('strong-imagery', 'red-colors', 'bold-fonts', 'warrior-themes');
      break;
    case 'beta':
      triggers.push('soft-colors', 'community-images', 'family-themes', 'trust-badges');
      break;
    case 'desperate':
      triggers.push('before-after', 'testimonials', 'transformation-stories');
      break;
    case 'skeptic':
      triggers.push('statistics', 'data', 'credentials', 'guarantees');
      break;
    case 'seeker':
      triggers.push('inspirational-quotes', 'spiritual-imagery', 'growth-graphs');
      break;
  }

  return triggers;
}

/**
 * GENERATE TARGETED MESSAGING
 */
export function generateTargetedMessaging(profile: PsychographicProfile): {
  headline: string;
  subheadline: string;
  cta: string;
  urgency: string;
  socialProof: string;
  guarantee: string;
} {
  const { personalityType, copyTone, messageFraming, scarcityTactic, conversionReadiness } = profile;

  // HEADLINES BY PERSONALITY
  const headlines: Record<typeof personalityType, Record<typeof copyTone, string>> = {
    alpha: {
      aggressive: 'Are You Strong Enough to Lead Your Family?',
      challenging: 'Most Men Are Too Weak For This',
      gentle: 'Strong Men Don\'t Lead Alone',
      supportive: 'Join the Brotherhood of Biblical Leaders',
    },
    beta: {
      aggressive: 'Stop Being a Passive Man',
      challenging: 'Your Family Deserves Better',
      gentle: 'It\'s Time to Step Up (We\'ll Show You How)',
      supportive: 'You Can Become the Leader Your Family Needs',
    },
    desperate: {
      aggressive: 'Your Marriage Is Failing Because You\'re Not Leading',
      challenging: 'This Worked When Nothing Else Did',
      gentle: 'We Know How Hard This Is (And How to Fix It)',
      supportive: 'There\'s Hope - And We Can Prove It',
    },
    skeptic: {
      aggressive: 'The Data Doesn\'t Lie: Biblical Leadership Works',
      challenging: '20,000 Men Can\'t All Be Wrong',
      gentle: 'See What Others Are Saying (Real Results)',
      supportive: 'No Risk - 100% Money Back Guarantee',
    },
    seeker: {
      aggressive: 'Find Your Purpose Before It\'s Too Late',
      challenging: 'The Biblical Path to Masculine Purpose',
      gentle: 'Discover What You Were Made For',
      supportive: 'Your Journey to Biblical Manhood Starts Here',
    },
  };

  // SUBHEADLINES BY MESSAGE FRAMING
  const subheadlines: Record<typeof messageFraming, string> = {
    authority: 'Over 20,000 men have transformed their families using these Biblical principles',
    empathy: 'We understand the weight you\'re carrying. Let us help lighten the load.',
    urgency: 'The next cohort starts in 48 hours. Don\'t let another week go by.',
    'social-proof': 'Join thousands of men who refused to settle for spiritual mediocrity',
    fear: 'Every day you wait is another day your family suffers from weak leadership',
  };

  // CTAs BY CONVERSION READINESS
  let cta = 'Get Started Free';

  if (conversionReadiness >= 80) {
    cta = 'Join Now - Limited Spots';
  } else if (conversionReadiness >= 60) {
    cta = 'See If You Qualify';
  } else if (conversionReadiness >= 40) {
    cta = 'Learn More (Free)';
  } else if (personalityType === 'skeptic') {
    cta = 'Show Me Proof';
  }

  // URGENCY MESSAGES
  const urgencyMessages = {
    soft: 'Join over 20,000 men on this journey',
    medium: scarcityTactic,
    aggressive: '⚠️ LAST CHANCE: Spots close in 6 hours',
  };

  // SOCIAL PROOF
  const socialProofMessages = {
    celebrity: '"This framework changed how I lead my family" - Pastor John Smith',
    peer: '4,832 married men credit this with saving their marriages',
    expert: 'Endorsed by leading Biblical scholars and marriage counselors',
    numbers: '20,000+ men • 4.9/5 stars • 98% would recommend',
  };

  // GUARANTEES
  const guarantees = {
    alpha: 'Results guaranteed or your money back',
    beta: '100% risk-free - cancel anytime',
    desperate: 'If this doesn\'t work, nothing will. We guarantee it.',
    skeptic: '60-day money back guarantee - no questions asked',
    seeker: 'Try it risk-free for 30 days',
  };

  return {
    headline: headlines[personalityType][copyTone],
    subheadline: subheadlines[messageFraming],
    cta,
    urgency: urgencyMessages[profile.urgencyLevel],
    socialProof: socialProofMessages[profile.socialProofType],
    guarantee: guarantees[personalityType],
  };
}

/**
 * TIME-BASED PSYCHOLOGICAL TRIGGERS
 */
export function getTimingTriggers(visitor: VisitorProfile): {
  shouldShowUrgency: boolean;
  timeBasedMessage: string;
  optimalContactTime: string;
} {
  const now = new Date();
  const hourOfDay = now.getHours();
  const dayOfWeek = now.getDay();
  const lastVisitMinutesAgo = visitor.lastVisit
    ? (Date.now() - new Date(visitor.lastVisit).getTime()) / 1000 / 60
    : 0;

  // URGENCY TRIGGERS
  let shouldShowUrgency = false;

  // High engagement but no email for 24+ hours
  if (visitor.leadScore >= 50 && !visitor.hasEmail && lastVisitMinutesAgo >= 1440) {
    shouldShowUrgency = true;
  }

  // Visited 3+ times without converting
  if (visitor.visitCount >= 3 && !visitor.hasEmail) {
    shouldShowUrgency = true;
  }

  // Weekend urgency (people make decisions on weekends)
  if (dayOfWeek === 0 || dayOfWeek === 6) {
    shouldShowUrgency = true;
  }

  // TIME-BASED MESSAGES
  let timeBasedMessage = '';

  if (hourOfDay >= 22 || hourOfDay <= 5) {
    timeBasedMessage = 'Up late? You\'re not alone. Thousands of men are wrestling with this tonight.';
  } else if (hourOfDay >= 6 && hourOfDay <= 9) {
    timeBasedMessage = 'Start your day with Biblical truth. Join 20,000+ men in morning study.';
  } else if (dayOfWeek === 0) {
    timeBasedMessage = 'Sunday Special: Start the week strong with our Biblical leadership framework';
  } else if (dayOfWeek === 5 || dayOfWeek === 6) {
    timeBasedMessage = 'Weekend Warrior Special: Use your weekend to transform your week';
  }

  // OPTIMAL CONTACT TIME
  let optimalContactTime = '9:00 AM EST';

  if (visitor.timezone?.includes('Pacific')) {
    optimalContactTime = '6:00 AM PST';
  } else if (visitor.timezone?.includes('Central')) {
    optimalContactTime = '8:00 AM CST';
  }

  return {
    shouldShowUrgency,
    timeBasedMessage,
    optimalContactTime,
  };
}
