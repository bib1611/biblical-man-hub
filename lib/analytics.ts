import { v4 as uuidv4 } from 'uuid';

// Client-side analytics tracker
export class AnalyticsTracker {
  private visitorId: string;
  private sessionId: string;
  private startTime: number;

  constructor() {
    this.visitorId = this.getOrCreateVisitorId();
    this.sessionId = this.getOrCreateSessionId();
    this.startTime = Date.now();
    this.initializeTracking();
  }

  private getOrCreateVisitorId(): string {
    let visitorId = localStorage.getItem('biblical_man_visitor_id');
    if (!visitorId) {
      visitorId = uuidv4();
      localStorage.setItem('biblical_man_visitor_id', visitorId);
    }
    return visitorId;
  }

  private getOrCreateSessionId(): string {
    let sessionId = sessionStorage.getItem('biblical_man_session_id');
    if (!sessionId) {
      sessionId = uuidv4();
      sessionStorage.setItem('biblical_man_session_id', sessionId);
    }
    return sessionId;
  }

  private initializeTracking() {
    // Track page view on initialization
    this.trackEvent('page_view', {
      path: window.location.pathname,
      referrer: document.referrer,
      ...this.getUtmParams(),
    });

    // Track time on site
    window.addEventListener('beforeunload', () => {
      const timeOnSite = Math.floor((Date.now() - this.startTime) / 1000);
      this.trackEvent('session_end', { timeOnSite });
    });

    // Track active session heartbeat
    setInterval(() => {
      this.sendHeartbeat();
    }, 30000); // Every 30 seconds
  }

  private getUtmParams() {
    const params = new URLSearchParams(window.location.search);
    return {
      utmSource: params.get('utm_source') || undefined,
      utmMedium: params.get('utm_medium') || undefined,
      utmCampaign: params.get('utm_campaign') || undefined,
    };
  }

  private async sendHeartbeat() {
    await fetch('/api/analytics/heartbeat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        visitorId: this.visitorId,
        sessionId: this.sessionId,
      }),
    });
  }

  async trackEvent(
    type: 'page_view' | 'product_click' | 'email_capture' | 'sam_chat' | 'window_open' | 'external_link',
    data: Record<string, any> = {}
  ) {
    try {
      await fetch('/api/analytics/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          visitorId: this.visitorId,
          sessionId: this.sessionId,
          type,
          data,
          timestamp: new Date().toISOString(),
        }),
      });
    } catch (error) {
      console.error('Analytics tracking error:', error);
    }
  }

  async captureEmail(email: string, name?: string, source: string = 'email_capture') {
    try {
      const response = await fetch('/api/analytics/capture-lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          visitorId: this.visitorId,
          sessionId: this.sessionId,
          email,
          name,
          source,
        }),
      });
      return await response.json();
    } catch (error) {
      console.error('Email capture error:', error);
      throw error;
    }
  }

  async logConversation(messages: any[], intent: string, productsDiscussed: string[]) {
    try {
      await fetch('/api/analytics/log-conversation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          visitorId: this.visitorId,
          sessionId: this.sessionId,
          messages,
          intent,
          productsDiscussed,
        }),
      });
    } catch (error) {
      console.error('Conversation logging error:', error);
    }
  }

  getVisitorId(): string {
    return this.visitorId;
  }

  getSessionId(): string {
    return this.sessionId;
  }
}

// Global analytics instance
let analytics: AnalyticsTracker | null = null;

export function getAnalytics(): AnalyticsTracker {
  if (typeof window === 'undefined') {
    throw new Error('Analytics can only be used in browser');
  }
  if (!analytics) {
    analytics = new AnalyticsTracker();
  }
  return analytics;
}
