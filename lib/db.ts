import { Visitor, AnalyticsEvent, Lead, ConversationLog } from '@/types';

// In-memory database (for demo - replace with real DB in production)
class InMemoryDB {
  private visitors: Map<string, Visitor> = new Map();
  private events: AnalyticsEvent[] = [];
  private leads: Map<string, Lead> = new Map();
  private conversations: Map<string, ConversationLog> = new Map();

  // Visitors
  getVisitor(id: string): Visitor | undefined {
    return this.visitors.get(id);
  }

  createOrUpdateVisitor(visitor: Visitor): void {
    this.visitors.set(visitor.id, visitor);
  }

  getAllVisitors(): Visitor[] {
    return Array.from(this.visitors.values());
  }

  getActiveVisitors(minutesThreshold: number = 5): Visitor[] {
    const threshold = Date.now() - minutesThreshold * 60 * 1000;
    return Array.from(this.visitors.values()).filter((v) => {
      return v.isActive && new Date(v.lastSeen).getTime() > threshold;
    });
  }

  // Events
  addEvent(event: AnalyticsEvent): void {
    this.events.push(event);
  }

  getEvents(visitorId?: string): AnalyticsEvent[] {
    if (visitorId) {
      return this.events.filter((e) => e.visitorId === visitorId);
    }
    return this.events;
  }

  getEventsByType(type: string, since?: Date): AnalyticsEvent[] {
    let filtered = this.events.filter((e) => e.type === type);
    if (since) {
      filtered = filtered.filter((e) => new Date(e.timestamp) >= since);
    }
    return filtered;
  }

  // Leads
  createLead(lead: Lead): void {
    this.leads.set(lead.id, lead);
  }

  updateLead(id: string, updates: Partial<Lead>): void {
    const lead = this.leads.get(id);
    if (lead) {
      this.leads.set(id, { ...lead, ...updates });
    }
  }

  getLead(id: string): Lead | undefined {
    return this.leads.get(id);
  }

  getLeadByEmail(email: string): Lead | undefined {
    return Array.from(this.leads.values()).find((l) => l.email === email);
  }

  getAllLeads(): Lead[] {
    return Array.from(this.leads.values());
  }

  getLeadsByStatus(status: Lead['status']): Lead[] {
    return Array.from(this.leads.values()).filter((l) => l.status === status);
  }

  // Conversations
  addConversation(conversation: ConversationLog): void {
    this.conversations.set(conversation.id, conversation);
  }

  getConversation(id: string): ConversationLog | undefined {
    return this.conversations.get(id);
  }

  getAllConversations(): ConversationLog[] {
    return Array.from(this.conversations.values());
  }

  getConversationsByVisitor(visitorId: string): ConversationLog[] {
    return Array.from(this.conversations.values()).filter(
      (c) => c.visitorId === visitorId
    );
  }

  // Analytics queries
  getVisitorsToday(): number {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return Array.from(this.visitors.values()).filter((v) => {
      return new Date(v.firstSeen) >= today;
    }).length;
  }

  getLeadsToday(): number {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return Array.from(this.leads.values()).filter((l) => {
      return new Date(l.firstContact) >= today;
    }).length;
  }

  getEmailCaptureRate(): number {
    const totalVisitors = this.visitors.size;
    if (totalVisitors === 0) return 0;
    const withEmail = Array.from(this.visitors.values()).filter((v) => v.email).length;
    return (withEmail / totalVisitors) * 100;
  }

  getProductClicks(since?: Date): Map<string, number> {
    const clicks = new Map<string, number>();
    const productEvents = this.getEventsByType('product_click', since);

    productEvents.forEach((event) => {
      const productId = event.data.productId;
      if (productId) {
        clicks.set(productId, (clicks.get(productId) || 0) + 1);
      }
    });

    return clicks;
  }

  getTrafficSources(): Map<string, number> {
    const sources = new Map<string, number>();
    Array.from(this.visitors.values()).forEach((visitor) => {
      const source = visitor.utmSource || visitor.referrer || 'direct';
      sources.set(source, (sources.get(source) || 0) + 1);
    });
    return sources;
  }

  getAverageTimeOnSite(): number {
    const visitors = Array.from(this.visitors.values());
    if (visitors.length === 0) return 0;
    const totalTime = visitors.reduce((sum, v) => sum + v.totalTimeOnSite, 0);
    return Math.floor(totalTime / visitors.length);
  }

  getConversationQuality(): number {
    const conversations = Array.from(this.conversations.values());
    if (conversations.length === 0) return 0;
    const totalQuality = conversations.reduce((sum, c) => sum + c.quality, 0);
    return Math.round((totalQuality / conversations.length) * 10) / 10;
  }
}

// Singleton instance
let dbInstance: InMemoryDB | null = null;

export function getDB(): InMemoryDB {
  if (!dbInstance) {
    dbInstance = new InMemoryDB();
  }
  return dbInstance;
}
