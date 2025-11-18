import { NextRequest, NextResponse } from 'next/server';
import { getDB } from '@/lib/db';
import { products } from '@/lib/data/products';
import { AnalyticsSnapshot } from '@/types';

export async function GET(request: NextRequest) {
  try {
    const db = getDB();

    // Get product clicks
    const productClicks = db.getProductClicks();
    const topProducts = Array.from(productClicks.entries())
      .map(([id, clicks]) => {
        const product = products.find((p) => p.id === id);
        return {
          id,
          name: product?.name || id,
          clicks,
          conversions: 0, // Would track from Gumroad webhook in production
        };
      })
      .sort((a, b) => b.clicks - a.clicks)
      .slice(0, 10);

    // Get traffic sources
    const trafficSourcesMap = db.getTrafficSources();
    const trafficSources = Array.from(trafficSourcesMap.entries())
      .map(([source, visitors]) => ({ source, visitors }))
      .sort((a, b) => b.visitors - a.visitors);

    // Get page views
    const pageViewEvents = db.getEventsByType('page_view');
    const pageViewsMap = new Map<string, number>();
    pageViewEvents.forEach((event) => {
      const path = event.data.path || '/';
      pageViewsMap.set(path, (pageViewsMap.get(path) || 0) + 1);
    });
    const topPages = Array.from(pageViewsMap.entries())
      .map(([path, views]) => ({ path, views }))
      .sort((a, b) => b.views - a.views)
      .slice(0, 10);

    const snapshot: AnalyticsSnapshot = {
      visitorsToday: db.getVisitorsToday(),
      visitorsOnline: db.getActiveVisitors(5).length,
      emailCaptureRate: db.getEmailCaptureRate(),
      topProducts,
      topPages,
      conversationQuality: db.getConversationQuality(),
      leadsToday: db.getLeadsToday(),
      conversionRate: 0, // Would calculate from actual purchases
      averageTimeOnSite: db.getAverageTimeOnSite(),
      trafficSources,
    };

    return NextResponse.json(snapshot);
  } catch (error) {
    console.error('Admin analytics error:', error);
    return NextResponse.json({ error: 'Failed to fetch analytics' }, { status: 500 });
  }
}
