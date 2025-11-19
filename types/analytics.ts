// Deep analytics tracking types

export interface VisitorSession {
  id: string;
  sessionId: string;
  userId?: string; // email if provided

  // Identity & Device
  ip: string;
  country?: string;
  region?: string;
  city?: string;
  timezone?: string;
  userAgent: string;
  browser: string;
  os: string;
  device: string;
  isMobile: boolean;

  // Referral & Marketing
  referrer?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmContent?: string;
  utmTerm?: string;
  landingPage: string;

  // Session Data
  firstSeen: string;
  lastSeen: string;
  totalPageViews: number;
  totalTimeOnSite: number; // seconds
  pagesVisited: string[];

  // Behavior Tracking
  clickedWindows: string[]; // which apps they opened
  interactedWithSam: boolean;
  enabledCounselorMode: boolean;
  purchasedCredits: boolean;

  // Conversion Tracking
  status: 'active' | 'bounced' | 'converted' | 'abandoned';
  conversionType?: 'email_captured' | 'credits_purchased' | 'resource_clicked';
  conversionValue?: number;

  // Technical
  screenResolution?: string;
  language?: string;
  cookiesEnabled: boolean;

  metadata?: {
    [key: string]: any;
  };
}

export interface PageView {
  id: string;
  sessionId: string;
  page: string;
  timestamp: string;
  timeOnPage: number; // seconds
  scrollDepth: number; // percentage
  clicks: number;
}

export interface VisitorEvent {
  id: string;
  sessionId: string;
  eventType: 'click' | 'scroll' | 'window_open' | 'form_submit' | 'purchase' | 'custom';
  eventName: string;
  eventData?: {
    [key: string]: any;
  };
  timestamp: string;
}

export interface RealtimeAnalytics {
  // Current Activity
  activeVisitors: number;
  visitorsLast5Minutes: number;
  visitorsLast1Hour: number;
  visitorsToday: number;

  // Geographic Distribution
  topCountries: Array<{ country: string; count: number }>;
  topCities: Array<{ city: string; count: number }>;

  // Traffic Sources
  topReferrers: Array<{ source: string; count: number }>;
  topUTMCampaigns: Array<{ campaign: string; conversions: number }>;

  // Behavior
  mostViewedPages: Array<{ page: string; views: number }>;
  mostOpenedWindows: Array<{ window: string; opens: number }>;

  // Conversion Metrics
  emailCaptureRate: number;
  counselorModeActivations: number;
  creditPurchases: number;
  totalRevenue: number;

  // Engagement
  averageSessionDuration: number;
  averagePageViews: number;
  bounceRate: number;
}

export interface AnalyticsDashboard {
  realtime: RealtimeAnalytics;
  sessions: VisitorSession[];
  recentEvents: VisitorEvent[];

  // Filters
  dateRange: { start: string; end: string };
  filters?: {
    country?: string;
    device?: string;
    utmSource?: string;
  };
}
