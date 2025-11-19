import { NextRequest, NextResponse } from 'next/server';
import { getDB } from '@/lib/db';
import { generatePersonalizationConfig } from '@/hooks/usePersonalization';
import {
  buildPsychographicProfile,
  generateTargetedMessaging,
  getTimingTriggers,
} from '@/lib/psychographics';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const visitorId = searchParams.get('visitorId');

    if (!visitorId) {
      return NextResponse.json({ error: 'visitorId required' }, { status: 400 });
    }

    const db = getDB();
    const visitor = await db.getVisitor(visitorId);

    // Build visitor profile
    const profile = {
      visitorId: visitor?.id || visitorId,
      sessionId: visitor?.sessionId || '',
      isReturning: visitor ? visitor.pageViews > 1 || visitor.visitCount > 1 : false,
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

    // Generate personalized config
    const config = generatePersonalizationConfig(profile);

    // 🔥 ADVANCED: Build psychographic profile
    const psychographic = buildPsychographicProfile(profile);

    // 🔥 ADVANCED: Generate targeted messaging
    const messaging = generateTargetedMessaging(psychographic);

    // 🔥 ADVANCED: Get timing triggers
    const timing = getTimingTriggers(profile);

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
      { error: 'Failed to load personalization' },
      { status: 500 }
    );
  }
}
