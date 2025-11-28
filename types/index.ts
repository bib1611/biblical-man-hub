// Core type definitions for Biblical Man Hub

export type AppId =
  | 'content-feed'
  | 'bible-study'
  | 'sam'
  | 'products'
  | 'radio'
  | 'counseling'
  | 'contact'
  | 'admin'
  | 'about'
  | 'start-here'
  | 'community';

export interface WindowState {
  id: AppId;
  title: string;
  isOpen: boolean;
  isMinimized: boolean;
  isMaximized: boolean;
  position: { x: number; y: number };
  size: { width: number; height: number };
  zIndex: number;
}

export interface ContentFeedItem {
  id: string;
  title: string;
  platform: 'Substack' | 'Beehiiv' | 'Gumroad' | 'Twitter';
  preview: string;
  url: string;
  date: string;
  content?: string;
  imageUrl?: string | null;
  author?: string;
}

export interface BibleVerse {
  book: string;
  chapter: number;
  verse: number;
  text: string;
}

export interface BibleBook {
  name: string;
  chapters: number;
  testament: 'OT' | 'NT';
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: 'marriage' | 'men' | 'women' | 'parenting' | 'devotionals' | 'courses';
  gumroadUrl: string;
  coverImage?: string;
  features: string[];
  isFeatured?: boolean;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai' | 'adam';
  content: string;
  timestamp: string;
  attachments?: string[];
}

export interface Bookmark {
  id: string;
  book: string;
  chapter: number;
  verse: number;
  note?: string;
  createdAt: string;
}

export interface Highlight {
  id: string;
  book: string;
  chapter: number;
  verse: number;
  color: string;
  createdAt: string;
}

// Analytics & Admin Types
export interface Visitor {
  id: string;
  sessionId: string;
  email?: string;
  name?: string;
  firstSeen: string;
  lastSeen: string;
  visitCount: number;

  // Geographic Intelligence
  ip: string;
  country?: string;
  countryCode?: string;
  region?: string;
  city?: string;
  zip?: string;
  latitude?: number;
  longitude?: number;
  timezone?: string;
  isp?: string;
  org?: string;

  // Device & Browser Intelligence
  userAgent: string;
  browser?: string;
  browserVersion?: string;
  os?: string;
  osVersion?: string;
  device?: string;
  isMobile: boolean;
  screenResolution?: string;
  language?: string;

  // Traffic Source Intelligence (Facebook/Meta level precision)
  referrer?: string;
  trafficSource?: string; // Parsed source name (e.g., "Facebook", "Google", "Direct")
  trafficMedium?: string; // Parsed medium (e.g., "social", "organic", "referral")
  trafficChannel?: string; // High-level channel grouping (e.g., "Social", "Organic Search", "Direct")
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmContent?: string;
  utmTerm?: string;
  landingPage?: string;

  // Behavioral Intelligence
  pageViews: number;
  totalTimeOnSite: number;
  pagesVisited: string[];
  windowsOpened: string[];
  interactedWithSam: boolean;
  enabledCounselorMode: boolean;
  purchasedCredits: boolean;

  // Status & Engagement
  isActive: boolean;
  status: 'active' | 'bounced' | 'converted' | 'abandoned';
  leadScore: number; // 0-100

  // Cookies & Tracking
  cookiesEnabled: boolean;
  fingerprint?: string; // Browser fingerprint
}

export interface AnalyticsEvent {
  id: string;
  visitorId: string;
  sessionId: string;
  type: 'page_view' | 'product_click' | 'email_capture' | 'sam_chat' | 'window_open' | 'external_link';
  data: Record<string, any>;
  timestamp: string;
}

export interface Lead {
  id: string;
  email: string;
  name?: string;
  phone?: string;
  source: 'email_capture' | 'sam_chat' | 'counseling_inquiry';
  score: number;
  status: 'new' | 'contacted' | 'converted' | 'lost';
  firstContact: string;
  lastContact: string;
  tags: string[];
  notes: string;
  conversationHistory?: ChatMessage[];
}

export interface ConversationLog {
  id: string;
  visitorId: string;
  leadId?: string;
  messages: ChatMessage[];
  quality: number;
  intent: 'browsing' | 'interested' | 'ready_to_buy' | 'needs_help';
  productsDiscussed: string[];
  outcome?: 'purchased' | 'escalated' | 'abandoned';
  startTime: string;
  endTime?: string;
}

export interface AnalyticsSnapshot {
  visitorsToday: number;
  visitorsOnline: number;
  emailCaptureRate: number;
  topProducts: { id: string; name: string; clicks: number; conversions: number }[];
  topPages: { path: string; views: number }[];
  conversationQuality: number;
  leadsToday: number;
  conversionRate: number;
  averageTimeOnSite: number;
  trafficSources: { source: string; visitors: number }[];
  // Enhanced analytics fields
  emailCaptures?: number;
  recentActiveVisitors?: any[];
  hotLeads?: any[];
  dbStatus?: boolean;
}

// Plugin Marketplace Types
export interface PluginMarketplaceSource {
  id: string;
  owner: string;
  repo: string;
  url: string;
  addedAt: string;
}

export interface PluginManifest {
  name: string;
  version: string;
  description: string;
  author: string;
  homepage?: string;
  repository?: string;
  keywords?: string[];
  license?: string;
  main?: string;
  type: 'window' | 'command' | 'hook' | 'resource';
  config?: Record<string, any>;
  dependencies?: Record<string, string>;
  resources?: PluginResource[];
}

export interface PluginResource {
  name: string;
  type: 'prompt' | 'template' | 'config' | 'data';
  path: string;
  description?: string;
}

export interface InstalledPlugin {
  id: string;
  name: string;
  version: string;
  source: string;
  installedAt: string;
  enabled: boolean;
  manifest: PluginManifest;
  localPath: string;
}

export interface MarketplaceConfig {
  version: string;
  sources: PluginMarketplaceSource[];
  lastUpdated: string | null;
}

export interface InstalledPluginsConfig {
  version: string;
  plugins: InstalledPlugin[];
  lastUpdated: string | null;
}
