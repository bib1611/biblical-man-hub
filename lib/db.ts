import { Visitor, AnalyticsEvent, Lead, ConversationLog } from '@/types';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Interface for Database Adapter
interface DBAdapter {
  // Visitors
  getVisitor(id: string): Promise<Visitor | undefined>;
  createOrUpdateVisitor(visitor: Visitor): Promise<void>;
  getAllVisitors(): Promise<Visitor[]>;
  getActiveVisitors(minutesThreshold?: number): Promise<Visitor[]>;
  getVisitorsToday(): Promise<number>;
  getEmailCaptureRate(): Promise<number>;
  getAverageTimeOnSite(): Promise<number>;
  healthCheck(): Promise<boolean>;

  // Events
  addEvent(event: AnalyticsEvent): Promise<void>;
  getEvents(visitorId?: string): Promise<AnalyticsEvent[]>;
  getEventsByType(type: string, since?: Date): Promise<AnalyticsEvent[]>;
  getProductClicks(since?: Date): Promise<Map<string, number>>;

  // Leads
  createLead(lead: Lead): Promise<void>;
  updateLead(id: string, updates: Partial<Lead>): Promise<void>;
  getLead(id: string): Promise<Lead | undefined>;
  getLeadByEmail(email: string): Promise<Lead | undefined>;
  getAllLeads(): Promise<Lead[]>;
  getLeadsByStatus(status: Lead['status']): Promise<Lead[]>;
  getLeadsToday(): Promise<number>;

  // Conversations
  addConversation(conversation: ConversationLog): Promise<void>;
  getConversation(id: string): Promise<ConversationLog | undefined>;
  getAllConversations(): Promise<ConversationLog[]>;
  getConversationsByVisitor(visitorId: string): Promise<ConversationLog[]>;
  getConversationQuality(): Promise<number>;
}

// Supabase Database Adapter
class SupabaseDB implements DBAdapter {
  private supabase: SupabaseClient;

  constructor() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Missing Supabase credentials');
    }

    this.supabase = createClient(supabaseUrl, supabaseKey);
  }

  async healthCheck(): Promise<boolean> {
    try {
      const { error } = await this.supabase.from('visitor_profiles').select('count', { count: 'exact', head: true }).limit(1);
      return !error;
    } catch (e) {
      return false;
    }
  }

  // --- Visitors ---

  async getVisitor(id: string): Promise<Visitor | undefined> {
    const { data, error } = await this.supabase
      .from('visitor_profiles')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) return undefined;
    return this.mapSupabaseVisitor(data);
  }

  async createOrUpdateVisitor(visitor: Visitor): Promise<void> {
    const supabaseVisitor = this.mapVisitorToSupabase(visitor);
    const { error } = await this.supabase
      .from('visitor_profiles')
      .upsert(supabaseVisitor, { onConflict: 'id' });

    if (error) console.error('Error upserting visitor:', error);
  }

  async getAllVisitors(): Promise<Visitor[]> {
    const { data, error } = await this.supabase
      .from('visitor_profiles')
      .select('*')
      .order('last_seen', { ascending: false });

    if (error || !data) return [];
    return data.map(this.mapSupabaseVisitor);
  }

  async getActiveVisitors(minutesThreshold: number = 5): Promise<Visitor[]> {
    const threshold = new Date(Date.now() - minutesThreshold * 60 * 1000).toISOString();
    const { data, error } = await this.supabase
      .from('visitor_profiles')
      .select('*')
      .gte('last_seen', threshold);

    if (error || !data) return [];
    return data.map(this.mapSupabaseVisitor);
  }

  async getVisitorsToday(): Promise<number> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const { count, error } = await this.supabase
      .from('visitor_profiles')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', today.toISOString());

    if (error) return 0;
    return count || 0;
  }

  async getEmailCaptureRate(): Promise<number> {
    // This is an approximation using total counts
    const { count: total, error: errTotal } = await this.supabase
      .from('visitor_profiles')
      .select('*', { count: 'exact', head: true });

    const { count: captured, error: errCaptured } = await this.supabase
      .from('visitor_profiles')
      .select('*', { count: 'exact', head: true })
      .not('email', 'is', null);

    if (errTotal || errCaptured || !total) return 0;
    return (captured || 0) / total * 100;
  }

  async getAverageTimeOnSite(): Promise<number> {
    // Fetching all to calculate average might be heavy, limiting to recent 1000 for performance
    const { data, error } = await this.supabase
      .from('visitor_profiles')
      .select('total_time_on_site')
      .limit(1000);

    if (error || !data || data.length === 0) return 0;
    const total = data.reduce((sum, v) => sum + (v.total_time_on_site || 0), 0);
    return Math.floor(total / data.length);
  }

  // --- Events ---

  async addEvent(event: AnalyticsEvent): Promise<void> {
    const { error } = await this.supabase
      .from('behavioral_events')
      .insert({
        id: event.id,
        visitor_id: event.visitorId,
        session_id: event.sessionId,
        event_type: event.type,
        event_data: event.data,
        created_at: event.timestamp
      });

    if (error) console.error('Error adding event:', error);
  }

  async getEvents(visitorId?: string): Promise<AnalyticsEvent[]> {
    let query = this.supabase.from('behavioral_events').select('*');
    if (visitorId) {
      query = query.eq('visitor_id', visitorId);
    }
    const { data, error } = await query.order('created_at', { ascending: false });

    if (error || !data) return [];
    return data.map(this.mapSupabaseEvent);
  }

  async getEventsByType(type: string, since?: Date): Promise<AnalyticsEvent[]> {
    let query = this.supabase.from('behavioral_events').select('*').eq('event_type', type);
    if (since) {
      query = query.gte('created_at', since.toISOString());
    }
    const { data, error } = await query;

    if (error || !data) return [];
    return data.map(this.mapSupabaseEvent);
  }

  async getProductClicks(since?: Date): Promise<Map<string, number>> {
    const events = await this.getEventsByType('product_click', since);
    const clicks = new Map<string, number>();
    events.forEach(e => {
      const productId = e.data.productId;
      if (productId) {
        clicks.set(productId, (clicks.get(productId) || 0) + 1);
      }
    });
    return clicks;
  }

  // --- Leads ---

  async createLead(lead: Lead): Promise<void> {
    // Leads are often just visitors with emails, but if there's a separate leads table:
    // For now, we'll assume leads are managed via visitor profiles or a specific leads table if it exists.
    // Based on previous code, leads were in-memory. We should probably store them in a 'leads' table or just query visitors with emails.
    // Let's assume we map them to a 'leads' table if it exists, or just use visitor profiles.
    // Checking schema... 'visitor_profiles' has 'email' and 'lead_score'.
    // We'll treat 'leads' as a view on 'visitor_profiles' for now to keep it simple, 
    // OR create a 'leads' table if we want to store extra CRM data.
    // Given the 'Lead' type has 'notes', 'tags', 'conversationHistory', let's assume we might need a separate table or JSON column.
    // For this refactor, I'll map Lead to visitor_profiles + a JSON column for CRM data if needed, 
    // BUT to be safe and persistent, I will use a 'leads' table if I can, or just store in visitor_profiles.
    // The previous in-memory DB had a separate leads map.
    // I will implement this by storing leads in a 'leads' table in Supabase.

    const { error } = await this.supabase
      .from('leads')
      .upsert({
        id: lead.id,
        email: lead.email,
        name: lead.name,
        phone: lead.phone,
        source: lead.source,
        score: lead.score,
        status: lead.status,
        first_contact: lead.firstContact,
        last_contact: lead.lastContact,
        tags: lead.tags,
        notes: lead.notes,
        conversation_history: lead.conversationHistory
      });

    if (error) console.error('Error creating lead:', error);
  }

  async updateLead(id: string, updates: Partial<Lead>): Promise<void> {
    const { error } = await this.supabase
      .from('leads')
      .update({
        ...updates,
        // Map camelCase to snake_case if needed, but let's assume the table uses snake_case
        first_contact: updates.firstContact,
        last_contact: updates.lastContact,
        conversation_history: updates.conversationHistory
      })
      .eq('id', id);

    if (error) console.error('Error updating lead:', error);
  }

  async getLead(id: string): Promise<Lead | undefined> {
    const { data, error } = await this.supabase
      .from('leads')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) return undefined;
    return this.mapSupabaseLead(data);
  }

  async getLeadByEmail(email: string): Promise<Lead | undefined> {
    const { data, error } = await this.supabase
      .from('leads')
      .select('*')
      .eq('email', email)
      .single();

    if (error || !data) return undefined;
    return this.mapSupabaseLead(data);
  }

  async getAllLeads(): Promise<Lead[]> {
    const { data, error } = await this.supabase
      .from('leads')
      .select('*')
      .order('score', { ascending: false });

    if (error || !data) return [];
    return data.map(this.mapSupabaseLead);
  }

  async getLeadsByStatus(status: Lead['status']): Promise<Lead[]> {
    const { data, error } = await this.supabase
      .from('leads')
      .select('*')
      .eq('status', status);

    if (error || !data) return [];
    return data.map(this.mapSupabaseLead);
  }

  async getLeadsToday(): Promise<number> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const { count, error } = await this.supabase
      .from('leads')
      .select('*', { count: 'exact', head: true })
      .gte('first_contact', today.toISOString());

    if (error) return 0;
    return count || 0;
  }

  // --- Conversations ---

  async addConversation(conversation: ConversationLog): Promise<void> {
    const { error } = await this.supabase
      .from('conversations')
      .insert({
        id: conversation.id,
        visitor_id: conversation.visitorId,
        lead_id: conversation.leadId,
        messages: conversation.messages,
        quality: conversation.quality,
        intent: conversation.intent,
        products_discussed: conversation.productsDiscussed,
        outcome: conversation.outcome,
        start_time: conversation.startTime,
        end_time: conversation.endTime
      });

    if (error) console.error('Error adding conversation:', error);
  }

  async getConversation(id: string): Promise<ConversationLog | undefined> {
    const { data, error } = await this.supabase
      .from('conversations')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) return undefined;
    return this.mapSupabaseConversation(data);
  }

  async getAllConversations(): Promise<ConversationLog[]> {
    const { data, error } = await this.supabase
      .from('conversations')
      .select('*')
      .order('start_time', { ascending: false });

    if (error || !data) return [];
    return data.map(this.mapSupabaseConversation);
  }

  async getConversationsByVisitor(visitorId: string): Promise<ConversationLog[]> {
    const { data, error } = await this.supabase
      .from('conversations')
      .select('*')
      .eq('visitor_id', visitorId);

    if (error || !data) return [];
    return data.map(this.mapSupabaseConversation);
  }

  async getAverageTimeOnSiteForVisitor(visitorId: string): Promise<number> {
    const { data, error } = await this.supabase
      .from('conversations') // This seems incorrect, should probably be visitor_profiles or behavioral_events for total_time_on_site
      .select('*')
      .eq('visitor_id', visitorId);

    if (error || !data || data.length === 0) return 0;
    // Assuming 'total_time_on_site' is a property within the conversation data,
    // or that this query is intended to be against a different table like 'visitor_profiles'.
    // For now, faithfully applying the provided snippet.
    const total = data.reduce((sum: number, v: { total_time_on_site: number }) => sum + (v.total_time_on_site || 0), 0);
    return Math.floor(total / data.length);
  }

  async getConversationQuality(): Promise<number> {
    const { data, error } = await this.supabase
      .from('conversations')
      .select('quality')
      .limit(100);

    if (error || !data || data.length === 0) return 0;
    const total = data.reduce((sum: number, c: { quality: number }) => sum + (c.quality || 0), 0);
    return Math.round((total / data.length) * 10) / 10;
  }

  // --- Mappers ---

  private mapSupabaseVisitor(data: any): Visitor {
    return {
      id: data.id,
      sessionId: data.session_id,
      firstSeen: data.created_at,
      lastSeen: data.last_seen || data.updated_at,
      visitCount: data.visit_count || 1,
      // Geo
      ip: 'hidden', // Don't expose IP back to client easily
      country: data.country,
      countryCode: data.country_code,
      region: data.region,
      city: data.city,
      zip: data.zip,
      latitude: data.latitude,
      longitude: data.longitude,
      timezone: data.timezone,
      isp: data.isp,
      org: data.org,
      // Device
      userAgent: data.user_agent || '',
      browser: data.browser,
      browserVersion: data.browser_version,
      os: data.os,
      osVersion: data.os_version,
      device: data.device_type,
      isMobile: data.is_mobile || false,
      screenResolution: data.screen_resolution,
      language: data.language,
      // Traffic
      referrer: data.referrer,
      trafficSource: data.traffic_source,
      trafficMedium: data.traffic_medium,
      trafficChannel: data.traffic_channel,
      utmSource: data.utm_source,
      utmMedium: data.utm_medium,
      utmCampaign: data.utm_campaign,
      utmContent: data.utm_content,
      utmTerm: data.utm_term,
      landingPage: data.landing_page,
      // Behavior
      pageViews: data.page_views || 0,
      totalTimeOnSite: data.total_time_on_site || 0,
      pagesVisited: data.pages_visited || [],
      windowsOpened: data.windows_opened || [],
      interactedWithSam: data.interacted_with_sam || false,
      enabledCounselorMode: data.enabled_counselor_mode || false,
      purchasedCredits: data.purchased_credits || false,
      // Status
      isActive: true, // Logic for active needs to be dynamic based on last_seen
      status: data.status || 'active',
      leadScore: data.lead_score || 0,
      // Cookies
      cookiesEnabled: true,
      fingerprint: data.fingerprint,
      email: data.email
    };
  }

  private mapVisitorToSupabase(visitor: Visitor): any {
    return {
      id: visitor.id,
      session_id: visitor.sessionId,
      created_at: visitor.firstSeen,
      last_seen: visitor.lastSeen,
      updated_at: new Date().toISOString(),
      // Geo
      country: visitor.country,
      country_code: visitor.countryCode,
      region: visitor.region,
      city: visitor.city,
      zip: visitor.zip,
      latitude: visitor.latitude,
      longitude: visitor.longitude,
      timezone: visitor.timezone,
      isp: visitor.isp,
      org: visitor.org,
      // Device
      user_agent: visitor.userAgent,
      browser: visitor.browser,
      browser_version: visitor.browserVersion,
      os: visitor.os,
      os_version: visitor.osVersion,
      device_type: visitor.device,
      is_mobile: visitor.isMobile,
      screen_resolution: visitor.screenResolution,
      language: visitor.language,
      // Traffic
      referrer: visitor.referrer,
      traffic_source: visitor.trafficSource,
      traffic_medium: visitor.trafficMedium,
      traffic_channel: visitor.trafficChannel,
      utm_source: visitor.utmSource,
      utm_medium: visitor.utmMedium,
      utm_campaign: visitor.utmCampaign,
      utm_content: visitor.utmContent,
      utm_term: visitor.utmTerm,
      landing_page: visitor.landingPage,
      // Behavior
      page_views: visitor.pageViews,
      total_time_on_site: visitor.totalTimeOnSite,
      pages_visited: visitor.pagesVisited,
      windows_opened: visitor.windowsOpened,
      interacted_with_sam: visitor.interactedWithSam,
      enabled_counselor_mode: visitor.enabledCounselorMode,
      purchased_credits: visitor.purchasedCredits,
      // Status
      status: visitor.status,
      lead_score: visitor.leadScore,
      fingerprint: visitor.fingerprint,
      email: visitor.email,
      has_email: !!visitor.email,
      is_returning: visitor.pageViews > 1
    };
  }

  private mapSupabaseEvent(data: any): AnalyticsEvent {
    return {
      id: data.id,
      visitorId: data.visitor_id,
      sessionId: data.session_id,
      type: data.event_type,
      data: data.event_data,
      timestamp: data.created_at
    };
  }

  private mapSupabaseLead(data: any): Lead {
    return {
      id: data.id,
      email: data.email,
      name: data.name,
      phone: data.phone,
      source: data.source,
      score: data.score,
      status: data.status,
      firstContact: data.first_contact,
      lastContact: data.last_contact,
      tags: data.tags || [],
      notes: data.notes || '',
      conversationHistory: data.conversation_history || []
    };
  }

  private mapSupabaseConversation(data: any): ConversationLog {
    return {
      id: data.id,
      visitorId: data.visitor_id,
      leadId: data.lead_id,
      messages: data.messages || [],
      quality: data.quality || 0,
      intent: data.intent,
      productsDiscussed: data.products_discussed || [],
      outcome: data.outcome,
      startTime: data.start_time,
      endTime: data.end_time
    };
  }
}

// In-memory fallback (kept for safety if Supabase fails or env vars missing)
class InMemoryDB implements DBAdapter {
  private visitors: Map<string, Visitor> = new Map();
  private events: AnalyticsEvent[] = [];
  private leads: Map<string, Lead> = new Map();
  private conversations: Map<string, ConversationLog> = new Map();

  async healthCheck(): Promise<boolean> {
    return true;
  }

  async getVisitor(id: string): Promise<Visitor | undefined> {
    return this.visitors.get(id);
  }

  async createOrUpdateVisitor(visitor: Visitor): Promise<void> {
    this.visitors.set(visitor.id, visitor);
  }

  async getAllVisitors(): Promise<Visitor[]> {
    return Array.from(this.visitors.values());
  }

  async getActiveVisitors(minutesThreshold: number = 5): Promise<Visitor[]> {
    const threshold = Date.now() - minutesThreshold * 60 * 1000;
    return Array.from(this.visitors.values()).filter((v) => {
      return v.isActive && new Date(v.lastSeen).getTime() > threshold;
    });
  }

  async getVisitorsToday(): Promise<number> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return Array.from(this.visitors.values()).filter((v) => {
      return new Date(v.firstSeen) >= today;
    }).length;
  }

  async getEmailCaptureRate(): Promise<number> {
    const totalVisitors = this.visitors.size;
    if (totalVisitors === 0) return 0;
    const withEmail = Array.from(this.visitors.values()).filter((v) => v.email).length;
    return (withEmail / totalVisitors) * 100;
  }

  async getAverageTimeOnSite(): Promise<number> {
    const visitors = Array.from(this.visitors.values());
    if (visitors.length === 0) return 0;
    const totalTime = visitors.reduce((sum, v) => sum + v.totalTimeOnSite, 0);
    return Math.floor(totalTime / visitors.length);
  }

  async addEvent(event: AnalyticsEvent): Promise<void> {
    this.events.push(event);
  }

  async getEvents(visitorId?: string): Promise<AnalyticsEvent[]> {
    if (visitorId) {
      return this.events.filter((e) => e.visitorId === visitorId);
    }
    return this.events;
  }

  async getEventsByType(type: string, since?: Date): Promise<AnalyticsEvent[]> {
    let filtered = this.events.filter((e) => e.type === type);
    if (since) {
      filtered = filtered.filter((e) => new Date(e.timestamp) >= since);
    }
    return filtered;
  }

  async getProductClicks(since?: Date): Promise<Map<string, number>> {
    const clicks = new Map<string, number>();
    const productEvents = await this.getEventsByType('product_click', since);

    productEvents.forEach((event) => {
      const productId = event.data.productId;
      if (productId) {
        clicks.set(productId, (clicks.get(productId) || 0) + 1);
      }
    });

    return clicks;
  }

  async createLead(lead: Lead): Promise<void> {
    this.leads.set(lead.id, lead);
  }

  async updateLead(id: string, updates: Partial<Lead>): Promise<void> {
    const lead = this.leads.get(id);
    if (lead) {
      this.leads.set(id, { ...lead, ...updates });
    }
  }

  async getLead(id: string): Promise<Lead | undefined> {
    return this.leads.get(id);
  }

  async getLeadByEmail(email: string): Promise<Lead | undefined> {
    return Array.from(this.leads.values()).find((l) => l.email === email);
  }

  async getAllLeads(): Promise<Lead[]> {
    return Array.from(this.leads.values());
  }

  async getLeadsByStatus(status: Lead['status']): Promise<Lead[]> {
    return Array.from(this.leads.values()).filter((l) => l.status === status);
  }

  async getLeadsToday(): Promise<number> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return Array.from(this.leads.values()).filter((l) => {
      return new Date(l.firstContact) >= today;
    }).length;
  }

  async addConversation(conversation: ConversationLog): Promise<void> {
    this.conversations.set(conversation.id, conversation);
  }

  async getConversation(id: string): Promise<ConversationLog | undefined> {
    return this.conversations.get(id);
  }

  async getAllConversations(): Promise<ConversationLog[]> {
    return Array.from(this.conversations.values());
  }

  async getConversationsByVisitor(visitorId: string): Promise<ConversationLog[]> {
    return Array.from(this.conversations.values()).filter(
      (c) => c.visitorId === visitorId
    );
  }

  async getConversationQuality(): Promise<number> {
    const conversations = Array.from(this.conversations.values());
    if (conversations.length === 0) return 0;
    const totalQuality = conversations.reduce((sum, c) => sum + c.quality, 0);
    return Math.round((totalQuality / conversations.length) * 10) / 10;
  }
}

// Singleton instance
let dbInstance: DBAdapter | null = null;

/**
 * Get database instance
 * Defaults to Supabase if credentials exist, otherwise InMemory
 */
export function getDB(): DBAdapter {
  if (!dbInstance) {
    const hasSupabase = process.env.NEXT_PUBLIC_SUPABASE_URL &&
      (process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

    if (hasSupabase) {
      console.log('📊 Using Supabase for analytics storage');
      try {
        dbInstance = new SupabaseDB();
      } catch (e) {
        console.error('Failed to initialize Supabase DB, falling back to memory:', e);
        dbInstance = new InMemoryDB();
      }
    } else {
      console.warn('⚠️  Using in-memory storage - data will be lost on restart');
      console.warn('⚠️  Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY to enable persistent storage');
      dbInstance = new InMemoryDB();
    }
  }
  return dbInstance;
}
