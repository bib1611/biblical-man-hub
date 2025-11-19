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

export function useAnalytics() {
  const [visitorId] = useState(getVisitorId);
  const [sessionId] = useState(getSessionId);
  const startTime = useRef(Date.now());
  const heartbeatInterval = useRef<NodeJS.Timeout | undefined>(undefined);

  // Track page view on mount
  useEffect(() => {
    const utmParams = getUTMParams();

    trackEvent('page_view', {
      page: window.location.pathname,
      referrer: document.referrer || 'direct',
      screenResolution: `${window.screen.width}x${window.screen.height}`,
      language: navigator.language,
      cookiesEnabled: navigator.cookieEnabled,
      fingerprint: getDeviceFingerprint(),
      ...utmParams,
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
