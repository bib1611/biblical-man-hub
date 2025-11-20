import { NextRequest, NextResponse } from 'next/server';
import { getDB } from '@/lib/db';
import { products } from '@/lib/data/products';
import { AnalyticsSnapshot, Visitor, AnalyticsEvent } from '@/types';
import { verifyAdminAuth } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    // SECURITY: Verify admin authentication
    const isAuthenticated = await verifyAdminAuth(request);
    if (!isAuthenticated) {
      return NextResponse.json(
        { error: 'Unauthorized - Admin access required' },
        { status: 401 }
      );
    }

    const db = getDB();
    const allVisitors: Visitor[] = await db.getAllVisitors();

    // Get product clicks
    const productClicks = await db.getProductClicks();
    const topProducts = (Array.from(productClicks.entries()) as [string, number][])
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

    // ENHANCED: Traffic sources by channel, medium, and source (Facebook/Meta level)
    const trafficChannels = new Map<string, number>();
    const trafficMediums = new Map<string, number>();
    const trafficSourcesMap = new Map<string, number>();
    const campaignPerformance = new Map<string, { visitors: number; conversions: number; revenue: number }>();

    allVisitors.forEach((v) => {
      // Channel grouping (highest level)
      const channel = v.trafficChannel || 'Unknown';
      trafficChannels.set(channel, (trafficChannels.get(channel) || 0) + 1);

      // Medium
      const medium = v.trafficMedium || 'none';
      trafficMediums.set(medium, (trafficMediums.get(medium) || 0) + 1);

      // Source (most granular)
      const source = v.trafficSource || v.utmSource || v.referrer || 'direct';
      trafficSourcesMap.set(source, (trafficSourcesMap.get(source) || 0) + 1);

      // Campaign performance (if UTM campaign exists)
      if (v.utmCampaign) {
        const existing = campaignPerformance.get(v.utmCampaign) || { visitors: 0, conversions: 0, revenue: 0 };
        existing.visitors++;
        if (v.email) existing.conversions++;
        if (v.purchasedCredits) existing.revenue += 37;
        campaignPerformance.set(v.utmCampaign, existing);
      }
    });

    const trafficSources = Array.from(trafficSourcesMap.entries())
      .map(([source, visitors]) => ({ source, visitors }))
      .sort((a, b) => b.visitors - a.visitors);

    // Get page views
    const pageViewEvents: AnalyticsEvent[] = await db.getEventsByType('page_view');
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
        // PRIVACY: IP removed from response - only stored server-side
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
        // Enhanced traffic source data
        trafficSource: v.trafficSource || 'Direct',
        trafficChannel: v.trafficChannel || 'Direct',
        utmSource: v.utmSource,
        utmCampaign: v.utmCampaign,
        landingPage: v.landingPage || '/',
      }));

    // 🔥 GARY VEE LEVEL: CONVERSION FUNNEL TRACKING
    const funnelMetrics = {
      step1_visited: allVisitors.length,
      step2_engaged: allVisitors.filter(v => v.pageViews > 1 || v.windowsOpened.length > 0).length,
      step3_deepEngagement: allVisitors.filter(v => v.totalTimeOnSite > 60 || v.windowsOpened.length >= 2).length,
      step4_samInteraction: allVisitors.filter(v => v.interactedWithSam).length,
      step5_emailCapture: emailCaptures,
      step6_counselorMode: counselorActivations,
      step7_purchase: creditPurchases,
    };

    const conversionFunnel = [
      { step: 'Landed', count: funnelMetrics.step1_visited, rate: 100 },
      { step: 'Engaged (2+ pages/windows)', count: funnelMetrics.step2_engaged, rate: (funnelMetrics.step2_engaged / funnelMetrics.step1_visited) * 100 },
      { step: 'Deep Engagement (60s+ or 2+ windows)', count: funnelMetrics.step3_deepEngagement, rate: (funnelMetrics.step3_deepEngagement / funnelMetrics.step1_visited) * 100 },
      { step: 'Talked to Sam', count: funnelMetrics.step4_samInteraction, rate: (funnelMetrics.step4_samInteraction / funnelMetrics.step1_visited) * 100 },
      { step: 'Gave Email', count: funnelMetrics.step5_emailCapture, rate: (funnelMetrics.step5_emailCapture / funnelMetrics.step1_visited) * 100 },
      { step: 'Enabled Counselor Mode', count: funnelMetrics.step6_counselorMode, rate: (funnelMetrics.step6_counselorMode / funnelMetrics.step1_visited) * 100 },
      { step: 'PURCHASED', count: funnelMetrics.step7_purchase, rate: (funnelMetrics.step7_purchase / funnelMetrics.step1_visited) * 100 },
    ];

    // 🔥 GARY VEE LEVEL: CONTENT PERFORMANCE (which windows drive conversions)
    const windowEngagement = new Map<string, { opens: number; emailsCapture: number; purchases: number; avgTimeAfter: number }>();
    allVisitors.forEach(v => {
      v.windowsOpened.forEach(windowId => {
        const existing = windowEngagement.get(windowId) || { opens: 0, emailsCapture: 0, purchases: 0, avgTimeAfter: 0 };
        existing.opens++;
        if (v.email) existing.emailsCapture++;
        if (v.purchasedCredits) existing.purchases++;
        windowEngagement.set(windowId, existing);
      });
    });

    const contentPerformance = Array.from(windowEngagement.entries())
      .map(([windowId, data]) => ({
        window: windowId,
        opens: data.opens,
        emailConversionRate: data.opens > 0 ? (data.emailsCapture / data.opens) * 100 : 0,
        purchaseConversionRate: data.opens > 0 ? (data.purchases / data.opens) * 100 : 0,
        totalRevenue: data.purchases * 37,
        revenuePerOpen: data.opens > 0 ? (data.purchases * 37) / data.opens : 0,
      }))
      .sort((a, b) => b.revenuePerOpen - a.revenuePerOpen);

    // 🔥 GARY VEE LEVEL: HOT LEADS (people who are active RIGHT NOW with high scores)
    const now = Date.now();
    const hotLeads = allVisitors
      .filter(v => {
        const lastSeenTime = new Date(v.lastSeen).getTime();
        const minutesAgo = (now - lastSeenTime) / (1000 * 60);
        return minutesAgo <= 30 && v.leadScore >= 50; // Active in last 30 min + score 50+
      })
      .map(v => ({
        email: v.email || 'Anonymous',
        leadScore: v.leadScore,
        minutesAgo: Math.round((now - new Date(v.lastSeen).getTime()) / (1000 * 60)),
        trafficSource: v.trafficSource || 'Direct',
        pageViews: v.pageViews,
        timeOnSite: Math.round(v.totalTimeOnSite / 60), // minutes
        interactedWithSam: v.interactedWithSam,
        status: v.status,
      }))
      .sort((a, b) => b.leadScore - a.leadScore);

    // 🔥 GARY VEE LEVEL: REVENUE ATTRIBUTION (which sources actually make $$$)
    const sourceRevenue = new Map<string, { visitors: number; emails: number; purchases: number; revenue: number }>();
    allVisitors.forEach(v => {
      const source = v.trafficSource || v.utmSource || 'Direct';
      const existing = sourceRevenue.get(source) || { visitors: 0, emails: 0, purchases: 0, revenue: 0 };
      existing.visitors++;
      if (v.email) existing.emails++;
      if (v.purchasedCredits) {
        existing.purchases++;
        existing.revenue += 37;
      }
      sourceRevenue.set(source, existing);
    });

    const revenueBySource = Array.from(sourceRevenue.entries())
      .map(([source, data]) => ({
        source,
        visitors: data.visitors,
        emailCaptureRate: data.visitors > 0 ? (data.emails / data.visitors) * 100 : 0,
        purchaseRate: data.visitors > 0 ? (data.purchases / data.visitors) * 100 : 0,
        revenue: data.revenue,
        revenuePerVisitor: data.visitors > 0 ? data.revenue / data.visitors : 0,
        ltv: data.revenue > 0 ? data.revenue / data.purchases : 0, // Lifetime value per customer
      }))
      .filter(s => s.visitors > 0)
      .sort((a, b) => b.revenue - a.revenue);

    // 🔥 GARY VEE LEVEL: ENGAGEMENT SCORING (hot/warm/cold breakdown)
    const leadTemperature = {
      hot: allVisitors.filter(v => {
        const minutesAgo = (now - new Date(v.lastSeen).getTime()) / (1000 * 60);
        return minutesAgo <= 30 && v.leadScore >= 60;
      }).length,
      warm: allVisitors.filter(v => {
        const hoursAgo = (now - new Date(v.lastSeen).getTime()) / (1000 * 60 * 60);
        return hoursAgo <= 24 && v.leadScore >= 40 && v.leadScore < 60;
      }).length,
      cold: allVisitors.filter(v => {
        const hoursAgo = (now - new Date(v.lastSeen).getTime()) / (1000 * 60 * 60);
        return hoursAgo > 24 || v.leadScore < 40;
      }).length,
    };

    // 🔥 GARY VEE LEVEL: TIME DECAY ANALYSIS (leads getting cold)
    const leadsGoingCold = allVisitors
      .filter(v => {
        const hoursAgo = (now - new Date(v.lastSeen).getTime()) / (1000 * 60 * 60);
        return v.leadScore >= 50 && hoursAgo >= 4 && hoursAgo <= 48 && !v.email; // High score but no email yet
      })
      .map(v => ({
        id: v.id,
        leadScore: v.leadScore,
        hoursAgo: Math.round((now - new Date(v.lastSeen).getTime()) / (1000 * 60 * 60)),
        trafficSource: v.trafficSource || 'Direct',
        pagesVisited: v.pagesVisited,
        windowsOpened: v.windowsOpened,
        lastPage: v.pagesVisited[v.pagesVisited.length - 1] || '/',
      }))
      .sort((a, b) => b.leadScore - a.leadScore)
      .slice(0, 10);

    // Calculate bounce rate (visitors with 1 page view and <30s on site)
    const bouncedVisitors = allVisitors.filter(v => v.pageViews <= 1 && v.totalTimeOnSite < 30).length;
    const bounceRate = allVisitors.length > 0 ? (bouncedVisitors / allVisitors.length) * 100 : 0;

    // Calculate pages visited intel
    const pagesVisitedBreakdown = new Map<string, number>();
    allVisitors.forEach(v => {
      v.pagesVisited.forEach(page => {
        pagesVisitedBreakdown.set(page, (pagesVisitedBreakdown.get(page) || 0) + 1);
      });
    });

    const topPagesVisited = Array.from(pagesVisitedBreakdown.entries())
      .map(([page, visits]) => ({ page, visits }))
      .sort((a, b) => b.visits - a.visits)
      .slice(0, 10);

    const dbStatus = await db.healthCheck();

    const snapshot: AnalyticsSnapshot & {
      dbStatus: boolean;
      bounceRate: number;
      topPagesVisited: Array<{ page: string; visits: number }>;
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
      // Traffic intelligence (Facebook/Meta level)
      trafficChannels: Array<{ channel: string; visitors: number }>;
      trafficMediums: Array<{ medium: string; visitors: number }>;
      campaignPerformance: Array<{ campaign: string; visitors: number; conversions: number; revenue: number; roi: number }>;
      // 🔥 GARY VEE LEVEL ANALYTICS
      conversionFunnel: Array<{ step: string; count: number; rate: number }>;
      contentPerformance: Array<{ window: string; opens: number; emailConversionRate: number; purchaseConversionRate: number; totalRevenue: number; revenuePerOpen: number }>;
      hotLeads: Array<{ email: string; leadScore: number; minutesAgo: number; trafficSource: string; pageViews: number; timeOnSite: number; interactedWithSam: boolean; status: string }>;
      revenueBySource: Array<{ source: string; visitors: number; emailCaptureRate: number; purchaseRate: number; revenue: number; revenuePerVisitor: number; ltv: number }>;
      leadTemperature: { hot: number; warm: number; cold: number };
      leadsGoingCold: Array<{ id: string; leadScore: number; hoursAgo: number; trafficSource: string; pagesVisited: string[]; windowsOpened: string[]; lastPage: string }>;
    } = {
      dbStatus,
      visitorsToday: await db.getVisitorsToday(),
      visitorsOnline: (await db.getActiveVisitors(5)).length,
      emailCaptureRate: await db.getEmailCaptureRate(),
      topProducts,
      topPages,
      conversationQuality: await db.getConversationQuality(),
      leadsToday: await db.getLeadsToday(),
      conversionRate: allVisitors.length > 0 ? (emailCaptures / allVisitors.length) * 100 : 0,
      averageTimeOnSite: await db.getAverageTimeOnSite(),
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

      // TRAFFIC INTELLIGENCE (Zuckerberg level)
      trafficChannels: Array.from(trafficChannels.entries())
        .map(([channel, visitors]) => ({ channel, visitors }))
        .sort((a, b) => b.visitors - a.visitors),
      trafficMediums: Array.from(trafficMediums.entries())
        .map(([medium, visitors]) => ({ medium, visitors }))
        .sort((a, b) => b.visitors - a.visitors),
      campaignPerformance: Array.from(campaignPerformance.entries())
        .map(([campaign, data]) => ({
          campaign,
          visitors: data.visitors,
          conversions: data.conversions,
          revenue: data.revenue,
          roi: data.revenue > 0 ? ((data.revenue / data.visitors) * 100) : 0,
        }))
        .sort((a, b) => b.revenue - a.revenue),

      // 🔥 GARY VEE LEVEL ANALYTICS
      conversionFunnel,
      contentPerformance,
      hotLeads,
      revenueBySource,
      leadTemperature,
      leadsGoingCold,

      // BOUNCE RATE & PAGE INTEL
      bounceRate,
      topPagesVisited,
    };

    return NextResponse.json(snapshot);
  } catch (error) {
    console.error('Admin analytics error:', error);
    return NextResponse.json({ error: 'Failed to fetch analytics' }, { status: 500 });
  }
}
