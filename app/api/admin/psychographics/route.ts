import { NextRequest, NextResponse } from 'next/server';
import { getDB } from '@/lib/db';
import { buildPsychographicProfile } from '@/lib/psychographics';
import { VisitorProfile } from '@/hooks/usePersonalization';

/**
 * GET /api/admin/psychographics
 *
 * Returns psychographic profiling data for all visitors
 * Shows personality types, conversion readiness, message framing effectiveness
 */
export async function GET(request: NextRequest) {
  try {
    const db = getDB();
    const visitors = db.getAllVisitors();

    // Build psychographic profiles for all visitors
    const psychographicProfiles = visitors.map((visitor) => {
      const profile: VisitorProfile = {
        visitorId: visitor.id,
        sessionId: visitor.sessionId || '',
        isReturning: visitor.pageViews > 1 || visitor.visitCount > 1,
        visitCount: visitor.visitCount,
        hasEmail: !!visitor.email,
        hasInteractedWithSam: visitor.interactedWithSam || false,
        hasUsedBible: visitor.windowsOpened?.includes('bible-study') || false,
        hasUsedRadio: visitor.windowsOpened?.includes('radio') || false,
        hasPurchased: visitor.purchasedCredits || false,
        leadScore: visitor.leadScore,
        status: visitor.status,
        timeOnSite: visitor.totalTimeOnSite,
        pageViews: visitor.pageViews,
        lastVisit: visitor.lastSeen,
        pagesVisited: visitor.pagesVisited || [],
        windowsOpened: visitor.windowsOpened || [],
        trafficSource: visitor.trafficSource,
        trafficMedium: visitor.trafficMedium,
        country: visitor.country,
        city: visitor.city,
        timezone: visitor.timezone,
      };

      const psychographic = buildPsychographicProfile(profile);

      return {
        visitorId: visitor.id,
        email: visitor.email,
        leadScore: visitor.leadScore,
        status: visitor.status,
        psychographic,
        profile: {
          visitCount: visitor.visitCount,
          timeOnSite: visitor.totalTimeOnSite,
          trafficSource: visitor.trafficSource,
          country: visitor.country,
          lastSeen: visitor.lastSeen,
        },
      };
    });

    // Aggregate psychographic statistics
    const personalityTypes = psychographicProfiles.reduce((acc, p) => {
      acc[p.psychographic.personalityType] =
        (acc[p.psychographic.personalityType] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const messageFramingStats = psychographicProfiles.reduce((acc, p) => {
      acc[p.psychographic.messageFraming] =
        (acc[p.psychographic.messageFraming] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const copyToneStats = psychographicProfiles.reduce((acc, p) => {
      acc[p.psychographic.copyTone] = (acc[p.psychographic.copyTone] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const avgConversionReadiness =
      psychographicProfiles.length > 0
        ? Math.round(
            psychographicProfiles.reduce(
              (sum, p) => sum + p.psychographic.conversionReadiness,
              0
            ) / psychographicProfiles.length
          )
        : 0;

    const highReadiness = psychographicProfiles.filter(
      (p) => p.psychographic.conversionReadiness >= 70
    ).length;

    const mediumReadiness = psychographicProfiles.filter(
      (p) =>
        p.psychographic.conversionReadiness >= 40 &&
        p.psychographic.conversionReadiness < 70
    ).length;

    const lowReadiness = psychographicProfiles.filter(
      (p) => p.psychographic.conversionReadiness < 40
    ).length;

    // Resistance levels
    const resistanceStats = psychographicProfiles.reduce((acc, p) => {
      acc[p.psychographic.resistanceLevel] =
        (acc[p.psychographic.resistanceLevel] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Urgency levels
    const urgencyStats = psychographicProfiles.reduce((acc, p) => {
      acc[p.psychographic.urgencyLevel] =
        (acc[p.psychographic.urgencyLevel] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Top pain points
    const painPointsMap = new Map<string, number>();
    psychographicProfiles.forEach((p) => {
      p.psychographic.painPoints.forEach((point) => {
        painPointsMap.set(point, (painPointsMap.get(point) || 0) + 1);
      });
    });

    const topPainPoints = Array.from(painPointsMap.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([point, count]) => ({ point, count }));

    // Top motivators
    const motivatorsMap = new Map<string, number>();
    psychographicProfiles.forEach((p) => {
      p.psychographic.motivators.forEach((motivator) => {
        motivatorsMap.set(motivator, (motivatorsMap.get(motivator) || 0) + 1);
      });
    });

    const topMotivators = Array.from(motivatorsMap.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([motivator, count]) => ({ motivator, count }));

    // High-value targets (high readiness, haven't converted)
    const highValueTargets = psychographicProfiles
      .filter(
        (p) =>
          p.psychographic.conversionReadiness >= 70 &&
          !p.email &&
          p.leadScore >= 50
      )
      .sort((a, b) => b.psychographic.conversionReadiness - a.psychographic.conversionReadiness)
      .slice(0, 20);

    // Sort profiles by conversion readiness
    psychographicProfiles.sort(
      (a, b) => b.psychographic.conversionReadiness - a.psychographic.conversionReadiness
    );

    return NextResponse.json({
      summary: {
        totalVisitors: psychographicProfiles.length,
        avgConversionReadiness,
        highReadiness,
        mediumReadiness,
        lowReadiness,
        personalityTypes,
        messageFramingStats,
        copyToneStats,
        resistanceStats,
        urgencyStats,
      },
      topPainPoints,
      topMotivators,
      highValueTargets,
      allProfiles: psychographicProfiles,
    });
  } catch (error) {
    console.error('Psychographic analytics error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch psychographic analytics' },
      { status: 500 }
    );
  }
}
