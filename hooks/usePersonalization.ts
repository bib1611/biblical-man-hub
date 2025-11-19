'use client';

import { useEffect, useState } from 'react';
import { useAnalytics } from './useAnalytics';

export interface VisitorProfile {
  visitorId: string;
  sessionId: string;
  isReturning: boolean;
  visitCount: number;
  hasEmail: boolean;
  hasInteractedWithSam: boolean;
  hasUsedBible: boolean;
  hasUsedRadio: boolean;
  hasPurchased: boolean;
  leadScore: number;
  status: string;
  timeOnSite: number;
  pageViews: number;
  lastVisit?: string;
  pagesVisited: string[];
  windowsOpened: string[];
  trafficSource?: string;
  trafficMedium?: string;
  country?: string;
  city?: string;
  timezone?: string;
}

export interface PersonalizationConfig {
  primaryCTA: string;
  secondaryCTA: string;
  heroMessage: string;
  urgencyLevel: 'low' | 'medium' | 'high';
  showExitIntent: boolean;
  exitIntentOffer: string;
  recommendedProduct?: string;
  nextBestAction: 'email' | 'sam' | 'bible' | 'radio' | 'product' | 'counselor';
}

export function usePersonalization() {
  const { visitorId, sessionId } = useAnalytics();
  const [profile, setProfile] = useState<VisitorProfile | null>(null);
  const [config, setConfig] = useState<PersonalizationConfig | null>(null);
  const [psychographic, setPsychographic] = useState<any>(null);
  const [messaging, setMessaging] = useState<any>(null);
  const [timing, setTiming] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // ⚠️ SAFETY: If no visitorId yet, set fallback config immediately so popup works
    if (!visitorId) {
      setConfig({
        primaryCTA: 'Get Free Access',
        secondaryCTA: 'Explore Resources',
        heroMessage: 'Stop Being Soft. Start Leading.',
        urgencyLevel: 'low',
        showExitIntent: true,
        exitIntentOffer: 'Wait! Get our FREE Biblical Masculinity Framework before you go.',
        nextBestAction: 'email',
      });
      setIsLoading(false);
      return;
    }

    // Fetch visitor profile from analytics
    async function loadProfile() {
      try {
        const response = await fetch(`/api/personalization/profile?visitorId=${visitorId}`);
        if (response.ok) {
          const data = await response.json();
          setProfile(data.profile);
          // ⚠️ SAFETY: Ensure config is set even if API returns incomplete data
          setConfig(data.config || {
            primaryCTA: 'Get Free Access',
            secondaryCTA: 'Explore Resources',
            heroMessage: 'Stop Being Soft. Start Leading.',
            urgencyLevel: 'low',
            showExitIntent: true,
            exitIntentOffer: 'Wait! Get our FREE Biblical Masculinity Framework before you go.',
            nextBestAction: 'email',
          });
          setPsychographic(data.psychographic);
          setMessaging(data.messaging);
          setTiming(data.timing);
        } else {
          // ⚠️ FALLBACK: If API returns non-200, still set default config
          setConfig({
            primaryCTA: 'Get Free Access',
            secondaryCTA: 'Explore Resources',
            heroMessage: 'Stop Being Soft. Start Leading.',
            urgencyLevel: 'low',
            showExitIntent: true,
            exitIntentOffer: 'Wait! Get our FREE Biblical Masculinity Framework before you go.',
            nextBestAction: 'email',
          });
        }
      } catch (error) {
        console.error('Failed to load personalization:', error);
        // ⚠️ FALLBACK: Set default config so popup still works even if API fails
        setConfig({
          primaryCTA: 'Get Free Access',
          secondaryCTA: 'Explore Resources',
          heroMessage: 'Stop Being Soft. Start Leading.',
          urgencyLevel: 'low',
          showExitIntent: true,
          exitIntentOffer: 'Wait! Get our FREE Biblical Masculinity Framework before you go.',
          nextBestAction: 'email',
        });
      } finally {
        setIsLoading(false);
      }
    }

    loadProfile();
  }, [visitorId]);

  return {
    profile,
    config,
    psychographic,
    messaging,
    timing,
    isLoading,
    visitorId,
    sessionId,
  };
}

/**
 * Smart personalization logic based on visitor behavior
 */
export function generatePersonalizationConfig(profile: VisitorProfile): PersonalizationConfig {
  // DEFAULT: First-time visitor
  let config: PersonalizationConfig = {
    primaryCTA: 'Get Free Access',
    secondaryCTA: 'Explore Resources',
    heroMessage: 'Stop Being Soft. Start Leading.',
    urgencyLevel: 'low',
    showExitIntent: true,
    exitIntentOffer: 'Wait! Get our FREE Biblical Masculinity Framework before you go.',
    nextBestAction: 'email',
  };

  // RETURNING VISITOR - NO EMAIL
  if (profile.isReturning && !profile.hasEmail && profile.leadScore > 30) {
    config = {
      ...config,
      heroMessage: 'Welcome Back! Ready to Take the Next Step?',
      primaryCTA: 'Join 20,000+ Men (Free)',
      urgencyLevel: 'medium',
      exitIntentOffer: 'You\'ve been here before. Don\'t leave without getting our proven frameworks delivered weekly.',
      nextBestAction: 'email',
    };
  }

  // HIGH ENGAGEMENT - NO EMAIL (Hot lead going cold)
  if (profile.leadScore >= 50 && !profile.hasEmail) {
    config = {
      ...config,
      heroMessage: 'You\'re Serious About This. Let\'s Connect.',
      primaryCTA: 'Get Your Personalized Action Plan',
      urgencyLevel: 'high',
      exitIntentOffer: 'WAIT! You\'re 1 step away from getting personalized Biblical guidance delivered to your inbox.',
      nextBestAction: 'email',
    };
  }

  // HAS EMAIL - NO PURCHASE
  if (profile.hasEmail && !profile.hasPurchased) {
    config = {
      ...config,
      heroMessage: 'Ready for the Full Framework?',
      primaryCTA: 'View Proven Resources',
      secondaryCTA: 'Chat with Sam',
      urgencyLevel: 'medium',
      exitIntentOffer: 'Special Offer: Get our top-rated course at 50% off (subscribers only)',
      nextBestAction: 'product',
    };
  }

  // USED BIBLE - Show more Bible features
  if (profile.hasUsedBible && !profile.hasEmail) {
    config = {
      ...config,
      heroMessage: 'Love the Bible Study Tool?',
      primaryCTA: 'Get More Study Resources',
      urgencyLevel: 'medium',
      exitIntentOffer: 'Get our Biblical Masculinity Study Guide sent to your inbox (FREE)',
      nextBestAction: 'email',
    };
  }

  // USED RADIO - Show counselor mode
  if (profile.hasUsedRadio && !profile.hasInteractedWithSam) {
    config = {
      ...config,
      heroMessage: 'Enjoying the Teaching? Get Personalized Guidance',
      primaryCTA: 'Chat with Sam (AI Guide)',
      secondaryCTA: 'Join Newsletter',
      urgencyLevel: 'medium',
      nextBestAction: 'sam',
    };
  }

  // USED SAM - Recommend counselor mode or products
  if (profile.hasInteractedWithSam && !profile.hasEmail) {
    config = {
      ...config,
      heroMessage: 'Sam Can Help You Even More',
      primaryCTA: 'Unlock Deep Counseling Mode',
      urgencyLevel: 'high',
      exitIntentOffer: 'Get personalized Biblical counseling delivered to your inbox every week',
      nextBestAction: 'email',
    };
  }

  // PURCHASED - Testimonial ask
  if (profile.hasPurchased) {
    config = {
      ...config,
      heroMessage: 'How\'s Your Journey Going?',
      primaryCTA: 'Share Your Transformation',
      secondaryCTA: 'Explore More Resources',
      urgencyLevel: 'low',
      showExitIntent: false,
      nextBestAction: 'product',
    };
  }

  // TRAFFIC SOURCE PERSONALIZATION
  if ((profile.trafficSource || '').toLowerCase().includes('facebook')) {
    config = {
      ...config,
      heroMessage: 'From Facebook? You\'re in the Right Place.',
      primaryCTA: 'Start Free Trial',
    };
  }

  if ((profile.trafficSource || '').toLowerCase().includes('google')) {
    config = {
      ...config,
      heroMessage: 'Searching for Biblical Truth? You Found It.',
      primaryCTA: 'Get Instant Access',
    };
  }

  if ((profile.trafficSource || '').toLowerCase().includes('substack')) {
    config = {
      ...config,
      heroMessage: 'Welcome, Newsletter Reader!',
      primaryCTA: 'Explore All Resources',
      urgencyLevel: 'low',
    };
  }

  return config;
}
