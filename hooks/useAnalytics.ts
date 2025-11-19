'use client';

import { useEffect, useRef, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

// Generate or retrieve visitor ID from localStorage
function getVisitorId(): string {
  if (typeof window === 'undefined') return '';

  let visitorId = localStorage.getItem('visitor_id');
  if (!visitorId) {
    visitorId = `visitor_${Date.now()}_${uuidv4()}`;
    localStorage.setItem('visitor_id', visitorId);
  }
  return visitorId;
}

// Generate or retrieve session ID (expires after 30 minutes of inactivity)
function getSessionId(): string {
  if (typeof window === 'undefined') return '';

  const lastActivity = localStorage.getItem('session_last_activity');
  const now = Date.now();
  const thirtyMinutes = 30 * 60 * 1000;

  let sessionId = localStorage.getItem('session_id');

  // Check if session expired
  if (lastActivity && now - parseInt(lastActivity) > thirtyMinutes) {
    sessionId = null; // Force new session
  }

  if (!sessionId) {
    sessionId = `session_${Date.now()}_${uuidv4()}`;
    localStorage.setItem('session_id', sessionId);
  }

  localStorage.setItem('session_last_activity', now.toString());
  return sessionId;
}

// Get UTM parameters from URL
function getUTMParams() {
  if (typeof window === 'undefined') return {};

  const params = new URLSearchParams(window.location.search);
  return {
    utmSource: params.get('utm_source') || undefined,
    utmMedium: params.get('utm_medium') || undefined,
    utmCampaign: params.get('utm_campaign') || undefined,
    utmContent: params.get('utm_content') || undefined,
    utmTerm: params.get('utm_term') || undefined,
  };
}

// Get device fingerprint (simplified)
function getDeviceFingerprint(): string {
  if (typeof window === 'undefined') return '';

  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.textBaseline = 'top';
    ctx.font = '14px Arial';
    ctx.fillText('fingerprint', 2, 2);
    return canvas.toDataURL().slice(-50); // Last 50 chars as simple fingerprint
  }
  return '';
}

// 🔥 DEEP REFERRER INTELLIGENCE - Know where they came from before arriving
function getDeepReferrerIntel() {
  if (typeof window === 'undefined') return {};

  const referrer = document.referrer;
  const currentUrl = window.location.href;

  // If no referrer, they came directly (typed URL, bookmark, or direct link)
  if (!referrer) {
    return {
      referrerUrl: 'direct',
      referrerDomain: 'direct',
      referrerType: 'direct',
      referrerCategory: 'Direct Traffic',
      searchQuery: null,
      socialPlatform: null,
      intelSummary: 'User came directly (bookmark, typed URL, or direct link)',
    };
  }

  try {
    const referrerURL = new URL(referrer);
    const referrerDomain = referrerURL.hostname.replace('www.', '');
    const currentDomain = window.location.hostname.replace('www.', '');

    // Internal traffic (same domain)
    if (referrerDomain === currentDomain) {
      return {
        referrerUrl: referrer,
        referrerDomain,
        referrerType: 'internal',
        referrerCategory: 'Internal Navigation',
        searchQuery: null,
        socialPlatform: null,
        intelSummary: 'User navigating within site',
      };
    }

    // SEARCH ENGINE DETECTION
    const searchEngines: Record<string, string> = {
      'google.com': 'Google',
      'bing.com': 'Bing',
      'yahoo.com': 'Yahoo',
      'duckduckgo.com': 'DuckDuckGo',
      'baidu.com': 'Baidu',
      'yandex.com': 'Yandex',
      'ask.com': 'Ask',
      'aol.com': 'AOL',
      'ecosia.org': 'Ecosia',
      'startpage.com': 'Startpage',
    };

    const searchEngine = Object.keys(searchEngines).find(domain => referrerDomain.includes(domain));

    if (searchEngine) {
      // Extract search query if possible
      const searchParams = referrerURL.searchParams;
      const query = searchParams.get('q') || searchParams.get('query') || searchParams.get('p') || null;

      return {
        referrerUrl: referrer,
        referrerDomain,
        referrerType: 'search',
        referrerCategory: `Search - ${searchEngines[searchEngine]}`,
        searchQuery: query,
        socialPlatform: null,
        intelSummary: query
          ? `Searched "${query}" on ${searchEngines[searchEngine]}`
          : `Found via ${searchEngines[searchEngine]} search`,
      };
    }

    // SOCIAL MEDIA DETECTION
    const socialPlatforms: Record<string, string> = {
      'facebook.com': 'Facebook',
      'fb.com': 'Facebook',
      'instagram.com': 'Instagram',
      'twitter.com': 'Twitter/X',
      'x.com': 'Twitter/X',
      't.co': 'Twitter/X',
      'linkedin.com': 'LinkedIn',
      'lnkd.in': 'LinkedIn',
      'pinterest.com': 'Pinterest',
      'reddit.com': 'Reddit',
      'tiktok.com': 'TikTok',
      'youtube.com': 'YouTube',
      'youtu.be': 'YouTube',
      'snapchat.com': 'Snapchat',
      'whatsapp.com': 'WhatsApp',
      'telegram.org': 'Telegram',
      't.me': 'Telegram',
      'discord.com': 'Discord',
      'tumblr.com': 'Tumblr',
      'quora.com': 'Quora',
      'medium.com': 'Medium',
      'substack.com': 'Substack',
    };

    const socialPlatform = Object.keys(socialPlatforms).find(domain => referrerDomain.includes(domain));

    if (socialPlatform) {
      return {
        referrerUrl: referrer,
        referrerDomain,
        referrerType: 'social',
        referrerCategory: `Social - ${socialPlatforms[socialPlatform]}`,
        searchQuery: null,
        socialPlatform: socialPlatforms[socialPlatform],
        intelSummary: `Came from ${socialPlatforms[socialPlatform]} (social media referral)`,
      };
    }

    // EMAIL / NEWSLETTER DETECTION
    const emailPlatforms = ['mail.google.com', 'outlook.com', 'mail.yahoo.com', 'substack.com'];
    const isEmail = emailPlatforms.some(domain => referrerDomain.includes(domain));

    if (isEmail) {
      return {
        referrerUrl: referrer,
        referrerDomain,
        referrerType: 'email',
        referrerCategory: 'Email/Newsletter',
        searchQuery: null,
        socialPlatform: null,
        intelSummary: `Clicked link from email or newsletter (${referrerDomain})`,
      };
    }

    // EXTERNAL WEBSITE (Referral traffic)
    return {
      referrerUrl: referrer,
      referrerDomain,
      referrerType: 'referral',
      referrerCategory: `Referral - ${referrerDomain}`,
      searchQuery: null,
      socialPlatform: null,
      intelSummary: `Referred from external website: ${referrerDomain}`,
    };
  } catch (error) {
    // If URL parsing fails, return what we have
    return {
      referrerUrl: referrer,
      referrerDomain: 'unknown',
      referrerType: 'unknown',
      referrerCategory: 'Unknown',
      searchQuery: null,
      socialPlatform: null,
      intelSummary: `Unknown referrer: ${referrer}`,
    };
  }
}

export function useAnalytics() {
  const [visitorId] = useState(getVisitorId);
  const [sessionId] = useState(getSessionId);
  const startTime = useRef(Date.now());
  const heartbeatInterval = useRef<NodeJS.Timeout | undefined>(undefined);

  // Track page view on mount with DEEP REFERRER INTELLIGENCE
  useEffect(() => {
    const utmParams = getUTMParams();
    const referrerIntel = getDeepReferrerIntel();

    trackEvent('page_view', {
      page: window.location.pathname,
      referrer: document.referrer || 'direct',
      screenResolution: `${window.screen.width}x${window.screen.height}`,
      language: navigator.language,
      cookiesEnabled: navigator.cookieEnabled,
      fingerprint: getDeviceFingerprint(),
      ...utmParams,
      // 🔥 DEEP REFERRER INTELLIGENCE
      ...referrerIntel,
    });

    // Heartbeat to track time on site
    heartbeatInterval.current = setInterval(() => {
      const timeOnSite = Math.floor((Date.now() - startTime.current) / 1000);
      trackEvent('heartbeat', {
        timeOnSite,
        page: window.location.pathname,
      });
    }, 30000); // Every 30 seconds

    return () => {
      if (heartbeatInterval.current) {
        clearInterval(heartbeatInterval.current);
      }
    };
  }, []);

  const trackEvent = async (
    type: 'page_view' | 'window_open' | 'email_capture' | 'counselor_mode_enabled' | 'purchase' | 'sam_chat' | 'heartbeat' | 'custom',
    data: Record<string, any> = {}
  ) => {
    try {
      await fetch('/api/analytics/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          visitorId,
          sessionId,
          type,
          data,
          timestamp: new Date().toISOString(),
        }),
      });
    } catch (error) {
      console.error('Analytics tracking error:', error);
    }
  };

  const trackWindowOpen = (window: string) => {
    trackEvent('window_open', { window });
  };

  const trackEmailCapture = (email: string) => {
    trackEvent('email_capture', { email });
  };

  const trackCounselorMode = () => {
    trackEvent('counselor_mode_enabled', { counselorMode: true });
  };

  const trackPurchase = (amount: number, product: string) => {
    trackEvent('purchase', { amount, product, purchased: true });
  };

  const trackSamChat = (messageCount: number, mode: 'standard' | 'counselor') => {
    trackEvent('sam_chat', { messageCount, mode });
  };

  return {
    trackEvent,
    trackWindowOpen,
    trackEmailCapture,
    trackCounselorMode,
    trackPurchase,
    trackSamChat,
    visitorId,
    sessionId,
  };
}
