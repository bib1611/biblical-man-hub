import 'server-only';
import { sql } from '@vercel/postgres';
import { Visitor, AnalyticsEvent, Lead, ConversationLog } from '@/types';

/**
 * PostgreSQL Database Adapter
 * Replaces the in-memory database with persistent Postgres storage
 */
class PostgresDB {
  // Visitors
  async getVisitor(id: string): Promise<Visitor | undefined> {
    try {
      const result = await sql`
        SELECT * FROM visitors WHERE id = ${id}
      `;
      if (result.rows.length === 0) return undefined;
      return this.rowToVisitor(result.rows[0]);
    } catch (error) {
      console.error('Error fetching visitor:', error);
      return undefined;
    }
  }

  async createOrUpdateVisitor(visitor: Visitor): Promise<void> {
    try {
      await sql`
        INSERT INTO visitors (
          id, session_id, first_seen, last_seen,
          ip, country, city, region, timezone,
          user_agent, browser, browser_version, os, os_version, device,
          is_mobile, screen_resolution, language, cookies_enabled,
          referrer, traffic_source, traffic_medium, traffic_channel,
          utm_source, utm_medium, utm_campaign, utm_content, utm_term,
          landing_page, page_views, total_time_on_site,
          pages_visited, windows_opened,
          interacted_with_sam, counselor_mode_enabled, email, purchased_credits,
          lead_score, status, is_active
        ) VALUES (
          ${visitor.id}, ${visitor.sessionId}, ${visitor.firstSeen}, ${visitor.lastSeen},
          ${visitor.ip}, ${visitor.country}, ${visitor.city}, ${visitor.region}, ${visitor.timezone},
          ${visitor.userAgent}, ${visitor.browser}, ${visitor.browserVersion}, ${visitor.os}, ${visitor.osVersion}, ${visitor.device},
          ${visitor.isMobile}, ${visitor.screenResolution}, ${visitor.language}, ${visitor.cookiesEnabled},
          ${visitor.referrer}, ${visitor.trafficSource}, ${visitor.trafficMedium}, ${visitor.trafficChannel},
          ${visitor.utmSource}, ${visitor.utmMedium}, ${visitor.utmCampaign}, ${visitor.utmContent}, ${visitor.utmTerm},
          ${visitor.landingPage}, ${visitor.pageViews}, ${visitor.totalTimeOnSite},
          ${JSON.stringify(visitor.pagesVisited)}, ${JSON.stringify(visitor.windowsOpened)},
          ${visitor.interactedWithSam}, ${visitor.enabledCounselorMode}, ${visitor.email}, ${visitor.purchasedCredits},
          ${visitor.leadScore}, ${visitor.status}, ${visitor.isActive}
        )
        ON CONFLICT (id) DO UPDATE SET
          last_seen = ${visitor.lastSeen},
          user_agent = ${visitor.userAgent},
          cookies_enabled = ${visitor.cookiesEnabled},
          page_views = ${visitor.pageViews},
          total_time_on_site = ${visitor.totalTimeOnSite},
          pages_visited = ${JSON.stringify(visitor.pagesVisited)},
          windows_opened = ${JSON.stringify(visitor.windowsOpened)},
          interacted_with_sam = ${visitor.interactedWithSam},
          counselor_mode_enabled = ${visitor.enabledCounselorMode},
          email = ${visitor.email},
          purchased_credits = ${visitor.purchasedCredits},
          lead_score = ${visitor.leadScore},
          status = ${visitor.status},
          is_active = ${visitor.isActive}
      `;
    } catch (error) {
      console.error('Error creating/updating visitor:', error);
      throw error;
    }
  }

  async getAllVisitors(): Promise<Visitor[]> {
    try {
      const result = await sql`SELECT * FROM visitors ORDER BY last_seen DESC`;
      return result.rows.map(row => this.rowToVisitor(row));
    } catch (error) {
      console.error('Error fetching all visitors:', error);
      return [];
    }
  }

  async getActiveVisitors(minutesThreshold: number = 5): Promise<Visitor[]> {
    try {
      const thresholdDate = new Date(Date.now() - minutesThreshold * 60 * 1000);
      const result = await sql`
        SELECT * FROM visitors
        WHERE is_active = true AND last_seen > ${thresholdDate.toISOString()}
        ORDER BY last_seen DESC
      `;
      return result.rows.map(row => this.rowToVisitor(row));
    } catch (error) {
      console.error('Error fetching active visitors:', error);
      return [];
    }
  }

  // Events
  async addEvent(event: AnalyticsEvent): Promise<void> {
    try {
      await sql`
        INSERT INTO events (id, visitor_id, session_id, type, data, timestamp)
        VALUES (
          ${event.id}, ${event.visitorId}, ${event.sessionId},
          ${event.type}, ${JSON.stringify(event.data)}, ${event.timestamp}
        )
      `;
    } catch (error) {
      console.error('Error adding event:', error);
      throw error;
    }
  }

  async getEvents(visitorId?: string): Promise<AnalyticsEvent[]> {
    try {
      const result = visitorId
        ? await sql`SELECT * FROM events WHERE visitor_id = ${visitorId} ORDER BY timestamp DESC`
        : await sql`SELECT * FROM events ORDER BY timestamp DESC`;

      return result.rows.map(row => this.rowToEvent(row));
    } catch (error) {
      console.error('Error fetching events:', error);
      return [];
    }
  }

  async getEventsByType(type: string, since?: Date): Promise<AnalyticsEvent[]> {
    try {
      const result = since
        ? await sql`SELECT * FROM events WHERE type = ${type} AND timestamp >= ${since.toISOString()} ORDER BY timestamp DESC`
        : await sql`SELECT * FROM events WHERE type = ${type} ORDER BY timestamp DESC`;

      return result.rows.map(row => this.rowToEvent(row));
    } catch (error) {
      console.error('Error fetching events by type:', error);
      return [];
    }
  }

  // Leads
  async createLead(lead: Lead): Promise<void> {
    try {
      await sql`
        INSERT INTO leads (
          id, email, name, phone,
          source, status, lead_score,
          last_interaction, notes, tags
        ) VALUES (
          ${lead.id}, ${lead.email}, ${lead.name}, ${lead.phone},
          ${lead.source}, ${lead.status}, ${lead.score},
          ${lead.lastContact}, ${lead.notes}, ${JSON.stringify(lead.tags)}
        )
        ON CONFLICT (email) DO NOTHING
      `;
    } catch (error) {
      console.error('Error creating lead:', error);
      throw error;
    }
  }

  async updateLead(id: string, updates: Partial<Lead>): Promise<void> {
    try {
      const fields = Object.keys(updates);
      if (fields.length === 0) return;

      // Build dynamic SQL update - safe because we control the field names
      const setClauses = fields
        .map(field => {
          const dbField = this.camelToSnake(field);
          return `${dbField} = $${fields.indexOf(field) + 2}`;
        })
        .join(', ');

      const values = [id, ...fields.map(f => (updates as any)[f])];

      await sql.query(`UPDATE leads SET ${setClauses} WHERE id = $1`, values);
    } catch (error) {
      console.error('Error updating lead:', error);
      throw error;
    }
  }

  async getLead(id: string): Promise<Lead | undefined> {
    try {
      const result = await sql`SELECT * FROM leads WHERE id = ${id}`;
      if (result.rows.length === 0) return undefined;
      return this.rowToLead(result.rows[0]);
    } catch (error) {
      console.error('Error fetching lead:', error);
      return undefined;
    }
  }

  async getLeadByEmail(email: string): Promise<Lead | undefined> {
    try {
      const result = await sql`SELECT * FROM leads WHERE email = ${email}`;
      if (result.rows.length === 0) return undefined;
      return this.rowToLead(result.rows[0]);
    } catch (error) {
      console.error('Error fetching lead by email:', error);
      return undefined;
    }
  }

  async getAllLeads(): Promise<Lead[]> {
    try {
      const result = await sql`SELECT * FROM leads ORDER BY created_at DESC`;
      return result.rows.map(row => this.rowToLead(row));
    } catch (error) {
      console.error('Error fetching all leads:', error);
      return [];
    }
  }

  async getLeadsByStatus(status: Lead['status']): Promise<Lead[]> {
    try {
      const result = await sql`SELECT * FROM leads WHERE status = ${status} ORDER BY created_at DESC`;
      return result.rows.map(row => this.rowToLead(row));
    } catch (error) {
      console.error('Error fetching leads by status:', error);
      return [];
    }
  }

  // Conversations
  async addConversation(conversation: ConversationLog): Promise<void> {
    try {
      await sql`
        INSERT INTO conversations (
          id, visitor_id, messages, quality_score,
          started_at, ended_at
        ) VALUES (
          ${conversation.id}, ${conversation.visitorId},
          ${JSON.stringify(conversation.messages)}, ${conversation.quality},
          ${conversation.startTime}, ${conversation.endTime}
        )
      `;
    } catch (error) {
      console.error('Error adding conversation:', error);
      throw error;
    }
  }

  async getConversation(id: string): Promise<ConversationLog | undefined> {
    try {
      const result = await sql`SELECT * FROM conversations WHERE id = ${id}`;
      if (result.rows.length === 0) return undefined;
      return this.rowToConversation(result.rows[0]);
    } catch (error) {
      console.error('Error fetching conversation:', error);
      return undefined;
    }
  }

  async getAllConversations(): Promise<ConversationLog[]> {
    try {
      const result = await sql`SELECT * FROM conversations ORDER BY started_at DESC`;
      return result.rows.map(row => this.rowToConversation(row));
    } catch (error) {
      console.error('Error fetching all conversations:', error);
      return [];
    }
  }

  async getConversationsByVisitor(visitorId: string): Promise<ConversationLog[]> {
    try {
      const result = await sql`
        SELECT * FROM conversations WHERE visitor_id = ${visitorId} ORDER BY started_at DESC
      `;
      return result.rows.map(row => this.rowToConversation(row));
    } catch (error) {
      console.error('Error fetching conversations by visitor:', error);
      return [];
    }
  }

  // Analytics queries
  async getVisitorsToday(): Promise<number> {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const result = await sql`
        SELECT COUNT(*) as count FROM visitors WHERE first_seen >= ${today.toISOString()}
      `;
      return parseInt(result.rows[0].count) || 0;
    } catch (error) {
      console.error('Error fetching visitors today:', error);
      return 0;
    }
  }

  async getLeadsToday(): Promise<number> {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const result = await sql`
        SELECT COUNT(*) as count FROM leads WHERE created_at >= ${today.toISOString()}
      `;
      return parseInt(result.rows[0].count) || 0;
    } catch (error) {
      console.error('Error fetching leads today:', error);
      return 0;
    }
  }

  async getEmailCaptureRate(): Promise<number> {
    try {
      const totalResult = await sql`SELECT COUNT(*) as count FROM visitors`;
      const emailResult = await sql`SELECT COUNT(*) as count FROM visitors WHERE email IS NOT NULL`;

      const total = parseInt(totalResult.rows[0].count) || 0;
      const withEmail = parseInt(emailResult.rows[0].count) || 0;

      if (total === 0) return 0;
      return (withEmail / total) * 100;
    } catch (error) {
      console.error('Error calculating email capture rate:', error);
      return 0;
    }
  }

  async getProductClicks(since?: Date): Promise<Map<string, number>> {
    const clicks = new Map<string, number>();
    try {
      const events = await this.getEventsByType('product_click', since);
      events.forEach(event => {
        const productId = event.data?.productId;
        if (productId) {
          clicks.set(productId, (clicks.get(productId) || 0) + 1);
        }
      });
    } catch (error) {
      console.error('Error fetching product clicks:', error);
    }
    return clicks;
  }

  async getTrafficSources(): Promise<Map<string, number>> {
    const sources = new Map<string, number>();
    try {
      const result = await sql`
        SELECT traffic_source, COUNT(*) as count
        FROM visitors
        GROUP BY traffic_source
      `;
      result.rows.forEach(row => {
        sources.set(row.traffic_source || 'direct', parseInt(row.count));
      });
    } catch (error) {
      console.error('Error fetching traffic sources:', error);
    }
    return sources;
  }

  async getAverageTimeOnSite(): Promise<number> {
    try {
      const result = await sql`
        SELECT AVG(total_time_on_site) as avg_time FROM visitors
      `;
      return Math.floor(parseFloat(result.rows[0].avg_time) || 0);
    } catch (error) {
      console.error('Error calculating average time on site:', error);
      return 0;
    }
  }

  async getConversationQuality(): Promise<number> {
    try {
      const result = await sql`
        SELECT AVG(quality_score) as avg_quality FROM conversations
      `;
      const avgQuality = parseFloat(result.rows[0].avg_quality) || 0;
      return Math.round(avgQuality * 10) / 10;
    } catch (error) {
      console.error('Error calculating conversation quality:', error);
      return 0;
    }
  }

  // Helper functions to convert database rows to TypeScript objects
  private rowToVisitor(row: any): Visitor {
    return {
      id: row.id,
      sessionId: row.session_id,
      firstSeen: row.first_seen,
      lastSeen: row.last_seen,
      ip: row.ip,
      country: row.country,
      city: row.city,
      region: row.region,
      timezone: row.timezone,
      userAgent: row.user_agent || '', // Required field
      browser: row.browser,
      browserVersion: row.browser_version,
      os: row.os,
      osVersion: row.os_version,
      device: row.device,
      isMobile: row.is_mobile,
      screenResolution: row.screen_resolution,
      language: row.language,
      referrer: row.referrer,
      trafficSource: row.traffic_source,
      trafficMedium: row.traffic_medium,
      trafficChannel: row.traffic_channel,
      utmSource: row.utm_source,
      utmMedium: row.utm_medium,
      utmCampaign: row.utm_campaign,
      utmContent: row.utm_content,
      utmTerm: row.utm_term,
      landingPage: row.landing_page,
      pageViews: row.page_views,
      totalTimeOnSite: row.total_time_on_site,
      pagesVisited: row.pages_visited || [],
      windowsOpened: row.windows_opened || [],
      interactedWithSam: row.interacted_with_sam,
      enabledCounselorMode: row.counselor_mode_enabled,
      email: row.email,
      purchasedCredits: row.purchased_credits,
      leadScore: row.lead_score,
      status: row.status,
      isActive: row.is_active,
      cookiesEnabled: row.cookies_enabled !== false, // Required field, default true
    };
  }

  private rowToEvent(row: any): AnalyticsEvent {
    return {
      id: row.id,
      visitorId: row.visitor_id,
      sessionId: row.session_id,
      type: row.type,
      data: row.data || {},
      timestamp: row.timestamp,
    };
  }

  private rowToLead(row: any): Lead {
    return {
      id: row.id,
      email: row.email,
      name: row.name,
      phone: row.phone,
      source: row.source,
      status: row.status,
      score: row.lead_score,
      firstContact: row.created_at,
      lastContact: row.last_interaction || row.created_at,
      notes: row.notes || '',
      tags: row.tags || [],
    };
  }

  private rowToConversation(row: any): ConversationLog {
    return {
      id: row.id,
      visitorId: row.visitor_id,
      leadId: row.lead_id,
      messages: row.messages || [],
      quality: row.quality_score,
      intent: 'browsing', // Default value since not stored in DB
      productsDiscussed: [], // Default value since not stored in DB
      outcome: row.outcome,
      startTime: row.started_at,
      endTime: row.ended_at,
    };
  }

  private camelToSnake(str: string): string {
    return str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
  }
}

// Singleton instance
let dbInstance: PostgresDB | null = null;

export function getDB(): PostgresDB {
  if (!dbInstance) {
    dbInstance = new PostgresDB();
  }
  return dbInstance;
}
