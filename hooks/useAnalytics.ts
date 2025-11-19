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

// Get DEEP device & browser intelligence - "Sherlock Holmes" level detail
function getDeepDeviceIntel() {
  if (typeof window === 'undefined') return {};

  const ua = navigator.userAgent;

  // Browser detection
  let browser = 'Unknown';
  let browserVersion = '';

  if (ua.includes('Chrome') && !ua.includes('Edg')) {
    browser = 'Chrome';
    browserVersion = ua.match(/Chrome\/(\d+\.\d+)/)?.[1] || '';
  } else if (ua.includes('Safari') && !ua.includes('Chrome')) {
    browser = 'Safari';
    browserVersion = ua.match(/Version\/(\d+\.\d+)/)?.[1] || '';
  } else if (ua.includes('Firefox')) {
    browser = 'Firefox';
    browserVersion = ua.match(/Firefox\/(\d+\.\d+)/)?.[1] || '';
  } else if (ua.includes('Edg')) {
    browser = 'Edge';
    browserVersion = ua.match(/Edg\/(\d+\.\d+)/)?.[1] || '';
  } else if (ua.includes('Opera') || ua.includes('OPR')) {
    browser = 'Opera';
    browserVersion = ua.match(/(?:Opera|OPR)\/(\d+\.\d+)/)?.[1] || '';
  }

  // OS detection
  let os = 'Unknown';
  let osVersion = '';

  if (ua.includes('Windows NT 10.0')) {
    os = 'Windows';
    osVersion = '10/11';
  } else if (ua.includes('Windows NT 6.3')) {
    os = 'Windows';
    osVersion = '8.1';
  } else if (ua.includes('Windows NT 6.2')) {
    os = 'Windows';
    osVersion = '8';
  } else if (ua.includes('Windows NT 6.1')) {
    os = 'Windows';
    osVersion = '7';
  } else if (ua.includes('Mac OS X')) {
    os = 'macOS';
    osVersion = ua.match(/Mac OS X (\d+[._]\d+)/)?.[1]?.replace('_', '.') || '';
  } else if (ua.includes('Linux')) {
    os = 'Linux';
  } else if (ua.includes('Android')) {
    os = 'Android';
    osVersion = ua.match(/Android (\d+\.\d+)/)?.[1] || '';
  } else if (ua.includes('iPhone') || ua.includes('iPad')) {
    os = ua.includes('iPad') ? 'iPad' : 'iPhone';
    osVersion = ua.match(/OS (\d+_\d+)/)?.[1]?.replace('_', '.') || '';
  }

  // Device type detection
  let deviceType = 'Desktop';
  if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
    deviceType = 'Tablet';
  } else if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(ua)) {
    deviceType = 'Mobile';
  }

  // Screen details
  const screenWidth = window.screen.width;
  const screenHeight = window.screen.height;
  const screenRes = `${screenWidth}x${screenHeight}`;
  const colorDepth = window.screen.colorDepth;
  const pixelRatio = window.devicePixelRatio || 1;

  // Viewport details
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;

  // Connection type (if available)
  const connection = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection;
  const connectionType = connection?.effectiveType || 'unknown';
  const connectionSpeed = connection?.downlink ? `${connection.downlink} Mbps` : 'unknown';

  // Hardware concurrency (CPU cores)
  const cpuCores = navigator.hardwareConcurrency || 'unknown';

  // Memory (if available)
  const memory = (navigator as any).deviceMemory ? `${(navigator as any).deviceMemory} GB` : 'unknown';

  // Touch support
  const touchSupport = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

  // Time zone
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  // Platform
  const platform = navigator.platform;

  return {
    browser,
    browserVersion,
    browserFull: `${browser} ${browserVersion}`,
    os,
    osVersion,
    osFull: `${os} ${osVersion}`.trim(),
    deviceType,
    screenResolution: screenRes,
    screenWidth,
    screenHeight,
    colorDepth: `${colorDepth}-bit`,
    pixelRatio,
    viewportSize: `${viewportWidth}x${viewportHeight}`,
    viewportWidth,
    viewportHeight,
    connectionType,
    connectionSpeed,
    cpuCores,
    memory,
    touchSupport,
    timezone,
    platform,
    userAgent: ua,
    deviceSummary: `${deviceType} • ${os} ${osVersion} • ${browser} ${browserVersion} • ${screenRes}`,
  };
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

  // Track page view on mount with DEEP REFERRER & DEVICE INTELLIGENCE
  useEffect(() => {
    const utmParams = getUTMParams();
    const referrerIntel = getDeepReferrerIntel();
    const deviceIntel = getDeepDeviceIntel();

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
      // 🔥 DEEP DEVICE INTELLIGENCE
      ...deviceIntel,
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
