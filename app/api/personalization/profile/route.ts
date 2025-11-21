import { NextRequest, NextResponse } from 'next/server';
import { getDB } from '@/lib/db';
import { getUserById } from '@/lib/session';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const visitorId = searchParams.get('visitorId');

    if (!visitorId) {
      return NextResponse.json({ error: 'visitorId required' }, { status: 400 });
    }

    // Try new session system first
    let user = await getUserById(visitorId);
    let visitor = null;

    // Fallback to old system if user not found in new system
    if (!user) {
      const db = getDB();
      visitor = await db.getVisitor(visitorId);
    }

    // Build visitor profile (from new or old system)
    const profile = user ? {
      // New session system
      visitorId: user.id,
      sessionId: '',
      isReturning: user.loginCount > 1,
      visitCount: user.loginCount || 1,
      hasEmail: !!user.email,
      hasInteractedWithSam: user.uiState?.interactedWithSam || false,
      hasUsedBible: user.uiState?.windowsOpened?.includes('bible-study') || false,
      hasUsedRadio: user.uiState?.windowsOpened?.includes('radio') || false,
      hasPurchased: user.preferences?.isMember || false,
      leadScore: 0,
      status: 'active',
      timeOnSite: 0,
      pageViews: 0,
      lastVisit: user.lastSeen,
      pagesVisited: [],
      windowsOpened: user.uiState?.windowsOpened || [],
      trafficSource: user.preferences?.original_traffic_source,
      trafficMedium: undefined,
      country: undefined,
      city: undefined,
      timezone: undefined,
    } : {
      // Old visitor_profiles system
      visitorId: visitor?.id || visitorId,
      sessionId: visitor?.sessionId || '',
      isReturning: visitor ? (visitor.pageViews > 1 || (visitor.visitCount || 0) > 1) : false,
      visitCount: visitor?.visitCount || 1,
      hasEmail: !!visitor?.email,
      hasInteractedWithSam: visitor?.interactedWithSam || false,
      hasUsedBible: visitor?.windowsOpened?.includes('bible-study') || false,
      hasUsedRadio: visitor?.windowsOpened?.includes('radio') || false,
      hasPurchased: visitor?.purchasedCredits || false,
      leadScore: visitor?.leadScore || 0,
      status: visitor?.status || 'active',
      timeOnSite: visitor?.totalTimeOnSite || 0,
      pageViews: visitor?.pageViews || 0,
      lastVisit: visitor?.lastSeen,
      pagesVisited: visitor?.pagesVisited || [],
      windowsOpened: visitor?.windowsOpened || [],
      trafficSource: visitor?.trafficSource,
      trafficMedium: visitor?.trafficMedium,
      country: visitor?.country,
      city: visitor?.city,
      timezone: visitor?.timezone,
    };

    // Generate personalized config (simplified - client function removed)
    const config = { theme: 'default', layout: 'desktop' };
    const psychographic = { segment: 'unknown', confidence: 0 };
    const messaging = { primary: 'Welcome', secondary: '' };
    const timing = { triggers: [] };

    return NextResponse.json({
      profile,
      config,
      psychographic,
      messaging,
      timing,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Personalization error:', error);
    return NextResponse.json(
      {
        error: 'Failed to load personalization',
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}
