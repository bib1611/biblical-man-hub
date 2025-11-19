import { NextRequest, NextResponse } from 'next/server';
import { getDB } from '@/lib/db';
import { products } from '@/lib/data/products';
import { AnalyticsSnapshot } from '@/types';

export async function GET(request: NextRequest) {
  try {
    const db = getDB();
    const allVisitors = db.getAllVisitors();

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

    // ENHANCED: Geographic intelligence
    const countriesMap = new Map<string, number>();
    const citiesMap = new Map<string, number>();
    allVisitors.forEach((v) => {
      if (v.country) {
        countriesMap.set(v.country, (countriesMap.get(v.country) || 0) + 1);
      }
      if (v.city) {
        citiesMap.set(v.city, (citiesMap.get(v.city) || 0) + 1);
      }
    });

    const topCountries = Array.from(countriesMap.entries())
      .map(([country, count]) => ({ country, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    const topCities = Array.from(citiesMap.entries())
      .map(([city, count]) => ({ city, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    // ENHANCED: Device/Browser analytics
    const browsersMap = new Map<string, number>();
    const osMap = new Map<string, number>();
    const devicesMap = new Map<string, number>();
    allVisitors.forEach((v) => {
      if (v.browser) browsersMap.set(v.browser, (browsersMap.get(v.browser) || 0) + 1);
      if (v.os) osMap.set(v.os, (osMap.get(v.os) || 0) + 1);
      if (v.device) devicesMap.set(v.device, (devicesMap.get(v.device) || 0) + 1);
    });

    // ENHANCED: Conversion metrics
    const emailCaptures = allVisitors.filter((v) => v.email).length;
    const counselorActivations = allVisitors.filter((v) => v.enabledCounselorMode).length;
    const creditPurchases = allVisitors.filter((v) => v.purchasedCredits).length;
    const totalRevenue = creditPurchases * 37; // $37 per purchase

    // ENHANCED: Lead scoring distribution
    const highQualityLeads = allVisitors.filter((v) => v.leadScore >= 70).length;
    const mediumQualityLeads = allVisitors.filter((v) => v.leadScore >= 40 && v.leadScore < 70).length;
    const lowQualityLeads = allVisitors.filter((v) => v.leadScore < 40).length;

    // ENHANCED: Recent active visitors (with full intel)
    const recentActiveVisitors = allVisitors
      .filter((v) => v.isActive)
      .sort((a, b) => new Date(b.lastSeen).getTime() - new Date(a.lastSeen).getTime())
      .slice(0, 20)
      .map((v) => ({
        id: v.id,
        email: v.email || 'Anonymous',
        country: v.country || 'Unknown',
        city: v.city || 'Unknown',
        ip: v.ip,
        browser: v.browser || 'Unknown',
        os: v.os || 'Unknown',
        device: v.device || 'Unknown',
        isMobile: v.isMobile,
        pageViews: v.pageViews,
        timeOnSite: v.totalTimeOnSite,
        leadScore: v.leadScore,
        status: v.status,
        interactedWithSam: v.interactedWithSam,
        enabledCounselorMode: v.enabledCounselorMode,
        purchasedCredits: v.purchasedCredits,
        lastSeen: v.lastSeen,
        utmSource: v.utmSource,
        utmCampaign: v.utmCampaign,
      }));

    const snapshot: AnalyticsSnapshot & {
      // Extended analytics
      topCountries: Array<{ country: string; count: number }>;
      topCities: Array<{ city: string; count: number }>;
      topBrowsers: Array<{ browser: string; count: number }>;
      topOS: Array<{ os: string; count: number }>;
      deviceBreakdown: { desktop: number; mobile: number };
      counselorModeActivations: number;
      creditPurchases: number;
      totalRevenue: number;
      emailCaptures: number;
      leadScoreDistribution: { high: number; medium: number; low: number };
      recentActiveVisitors: any[];
    } = {
      visitorsToday: db.getVisitorsToday(),
      visitorsOnline: db.getActiveVisitors(5).length,
      emailCaptureRate: db.getEmailCaptureRate(),
      topProducts,
      topPages,
      conversationQuality: db.getConversationQuality(),
      leadsToday: db.getLeadsToday(),
      conversionRate: allVisitors.length > 0 ? (emailCaptures / allVisitors.length) * 100 : 0,
      averageTimeOnSite: db.getAverageTimeOnSite(),
      trafficSources,

      // ENHANCED DATA
      topCountries,
      topCities,
      topBrowsers: Array.from(browsersMap.entries())
        .map(([browser, count]) => ({ browser, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5),
      topOS: Array.from(osMap.entries())
        .map(([os, count]) => ({ os, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5),
      deviceBreakdown: {
        desktop: devicesMap.get('Desktop') || 0,
        mobile: devicesMap.get('Mobile') || 0,
      },
      counselorModeActivations: counselorActivations,
      creditPurchases,
      totalRevenue,
      emailCaptures,
      leadScoreDistribution: {
        high: highQualityLeads,
        medium: mediumQualityLeads,
        low: lowQualityLeads,
      },
      recentActiveVisitors,
    };

    return NextResponse.json(snapshot);
  } catch (error) {
    console.error('Admin analytics error:', error);
    return NextResponse.json({ error: 'Failed to fetch analytics' }, { status: 500 });
  }
}
