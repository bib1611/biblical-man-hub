import { NextRequest, NextResponse } from 'next/server';
import { getDB } from '@/lib/db';

/**
 * GET /api/admin/engagement
 *
 * Returns deep engagement analytics for all visitors
 * Aggregates Bible, Radio, Sam, and psychographic data
 */
export async function GET(request: NextRequest) {
  try {
    const db = getDB();
    const visitors = await db.getAllVisitors();
    const events = await db.getEvents();

    // Aggregate engagement metrics by visitor
    const engagementProfiles = visitors.map((visitor: any) => {
      const visitorEvents = events.filter((e: any) => e.visitorId === visitor.id);

      // Bible engagement metrics
      const bibleEvents = visitorEvents.filter((e: any) =>
        e.type === 'custom' && e.data.eventName?.startsWith('bible_')
      );

      const versesRead = new Set(
        bibleEvents
          .filter((e: any) => e.data.eventName === 'bible_verse_read')
          .map((e: any) => e.data.verseRef)
      ).size;

      const highlightCount = bibleEvents.filter(
        (e: any) => e.data.eventName === 'bible_verse_highlighted'
      ).length;

      const noteCount = bibleEvents.filter(
        (e: any) => e.data.eventName === 'bible_note_added'
      ).length;

      const bibleReadingTime = bibleEvents
        .filter((e: any) => e.data.eventName === 'bible_chapter_closed')
        .reduce((sum: number, e: any) => sum + (e.data.readingTime || 0), 0);

      const bibleAudioTime = bibleEvents
        .filter((e: any) => e.data.eventName === 'bible_audio_completed')
        .reduce((sum: number, e: any) => sum + (e.data.listeningTime || 0), 0);

      const chaptersOpened = new Set(
        bibleEvents
          .filter((e: any) => e.data.eventName === 'bible_chapter_opened')
          .map((e: any) => `${e.data.book} ${e.data.chapter}`)
      ).size;

      // Radio engagement metrics
      const radioEvents = visitorEvents.filter((e: any) =>
        e.type === 'custom' && e.data.eventName?.startsWith('radio_')
      );

      const radioListeningTime = radioEvents
        .filter((e: any) => e.data.eventName === 'radio_total_session')
        .reduce((sum: number, e: any) => sum + (e.data.totalListeningTime || 0), 0);

      const radioSessions = radioEvents.filter(
        (e: any) => e.data.eventName === 'radio_play_started'
      ).length;

      const radioSkips = radioEvents
        .filter((e: any) => e.data.eventName === 'radio_total_session')
        .reduce((sum: number, e: any) => sum + (e.data.skips || 0), 0);

      const bingeSessions = radioEvents.filter(
        (e: any) => e.data.eventName === 'radio_binge_session'
      ).length;

      const avgRadioSession =
        radioSessions > 0 ? Math.floor(radioListeningTime / radioSessions) : 0;

      // Sam engagement metrics - get actual conversation details
      const samEvents = visitorEvents.filter((e: any) => e.type === 'sam_chat');
      const counselorModeEvents = visitorEvents.filter((e: any) => e.type === 'counselor_mode_enabled');

      const samMessageCount = samEvents.reduce((sum: number, e: any) => {
        return Math.max(sum, e.data.messageCount || 0);
      }, 0);

      const counselorModeUsed = counselorModeEvents.length > 0 || visitor.counselorModeEnabled;

      const counselorMessageCount = samEvents
        .filter((e: any) => e.data.mode === 'counselor')
        .reduce((sum: number, e: any) => Math.max(sum, e.data.messageCount || 0), 0);

      const standardMessageCount = samEvents
        .filter((e: any) => e.data.mode === 'standard')
        .reduce((sum: number, e: any) => Math.max(sum, e.data.messageCount || 0), 0);

      // Exit intent metrics
      const exitIntentShown = visitorEvents.some(
        (e: any) => e.type === 'custom' && e.data.eventName === 'exit_intent_shown'
      );

      const exitIntentConverted = visitorEvents.some(
        (e: any) => e.type === 'custom' && e.data.eventName === 'exit_intent_converted'
      );

      // Calculate overall engagement score
      let engagementScore = 0;

      // Bible engagement (30 points max)
      engagementScore += Math.min((versesRead / 50) * 15, 15);
      engagementScore += Math.min((bibleReadingTime / 600) * 10, 10);
      engagementScore += Math.min(highlightCount * 1, 5);

      // Radio engagement (30 points max)
      engagementScore += Math.min((radioListeningTime / 1800) * 20, 20);
      engagementScore += Math.min(radioSessions * 2, 10);

      // Sam engagement (20 points max)
      if (visitor.interactedWithSam) engagementScore += 10;
      if (counselorModeUsed) engagementScore += 10;

      // Conversion signals (20 points max)
      if (visitor.email) engagementScore += 10;
      if (visitor.purchasedCredits) engagementScore += 10;

      engagementScore = Math.min(Math.round(engagementScore), 100);

      // Extract device & referrer intel from first page_view event
      const firstPageView = visitorEvents.find((e: any) => e.type === 'page_view');
      const deviceIntel = firstPageView?.data || {};

      return {
        visitorId: visitor.id,
        email: visitor.email,
        leadScore: visitor.leadScore,
        status: visitor.status,

        // Device intelligence
        browser: deviceIntel.browser,
        browserVersion: deviceIntel.browserVersion,
        browserFull: deviceIntel.browserFull,
        os: deviceIntel.os,
        osVersion: deviceIntel.osVersion,
        osFull: deviceIntel.osFull,
        deviceType: deviceIntel.deviceType,
        deviceSummary: deviceIntel.deviceSummary,
        screenResolution: deviceIntel.screenResolution,
        timezone: deviceIntel.timezone,
        connectionType: deviceIntel.connectionType,
        cpuCores: deviceIntel.cpuCores,
        memory: deviceIntel.memory,
        touchSupport: deviceIntel.touchSupport,

        // Referrer intelligence
        referrerType: deviceIntel.referrerType,
        referrerCategory: deviceIntel.referrerCategory,
        referrerDomain: deviceIntel.referrerDomain,
        socialPlatform: deviceIntel.socialPlatform,
        searchQuery: deviceIntel.searchQuery,
        intelSummary: deviceIntel.intelSummary,

        // Bible metrics
        bible: {
          versesRead,
          readingTime: bibleReadingTime,
          audioTime: bibleAudioTime,
          chaptersOpened,
          highlightCount,
          noteCount,
        },

        // Radio metrics
        radio: {
          totalListeningTime: radioListeningTime,
          sessionsCount: radioSessions,
          averageSessionLength: avgRadioSession,
          skips: radioSkips,
          bingeSessions,
          returnListener: radioSessions > 1,
        },

        // Sam metrics
        sam: {
          hasInteracted: samMessageCount > 0 || visitor.interactedWithSam || false,
          totalMessages: samMessageCount,
          counselorMode: counselorModeUsed,
          counselorMessages: counselorMessageCount,
          standardMessages: standardMessageCount,
          conversationDepth: samMessageCount > 0 ? 'deep' : samMessageCount > 10 ? 'engaged' : 'surface',
        },

        // Conversion metrics
        conversion: {
          hasEmail: !!visitor.email,
          hasPurchased: visitor.purchasedCredits || false,
          exitIntentShown,
          exitIntentConverted,
        },

        // Overall metrics
        engagementScore,
        timeOnSite: visitor.totalTimeOnSite,
        pageViews: visitor.pageViews,
        visitCount: visitor.visitCount,
        trafficSource: visitor.trafficSource,
        country: visitor.country,
        lastSeen: visitor.lastSeen,
      };
    });

    // Sort by engagement score descending
    engagementProfiles.sort((a: any, b: any) => b.engagementScore - a.engagementScore);

    // Calculate aggregate metrics
    const totalVisitors = engagementProfiles.length;

    const avgEngagementScore =
      totalVisitors > 0
        ? Math.round(
            engagementProfiles.reduce((sum: number, p: any) => sum + p.engagementScore, 0) /
              totalVisitors
          )
        : 0;

    const bibleUsers = engagementProfiles.filter(
      (p: any) => p.bible.versesRead > 0
    ).length;

    const radioUsers = engagementProfiles.filter(
      (p: any) => p.radio.sessionsCount > 0
    ).length;

    const samUsers = engagementProfiles.filter((p: any) => p.sam.hasInteracted).length;

    const highEngagement = engagementProfiles.filter(
      (p: any) => p.engagementScore >= 70
    ).length;

    const mediumEngagement = engagementProfiles.filter(
      (p: any) => p.engagementScore >= 40 && p.engagementScore < 70
    ).length;

    const lowEngagement = engagementProfiles.filter(
      (p: any) => p.engagementScore < 40
    ).length;

    const totalBibleTime = engagementProfiles.reduce(
      (sum: number, p: any) => sum + p.bible.readingTime + p.bible.audioTime,
      0
    );

    const totalRadioTime = engagementProfiles.reduce(
      (sum: number, p: any) => sum + p.radio.totalListeningTime,
      0
    );

    const avgBibleTime = bibleUsers > 0 ? Math.floor(totalBibleTime / bibleUsers) : 0;
    const avgRadioTime = radioUsers > 0 ? Math.floor(totalRadioTime / radioUsers) : 0;

    // Top engaged visitors
    const topEngaged = engagementProfiles.slice(0, 10);

    // Conversion funnel
    const exitIntentShownCount = engagementProfiles.filter(
      (p: any) => p.conversion.exitIntentShown
    ).length;

    const exitIntentConvertedCount = engagementProfiles.filter(
      (p: any) => p.conversion.exitIntentConverted
    ).length;

    const exitIntentConversionRate =
      exitIntentShownCount > 0
        ? ((exitIntentConvertedCount / exitIntentShownCount) * 100).toFixed(1)
        : 0;

    return NextResponse.json({
      summary: {
        totalVisitors,
        avgEngagementScore,
        bibleUsers,
        radioUsers,
        samUsers,
        highEngagement,
        mediumEngagement,
        lowEngagement,
        avgBibleTime,
        avgRadioTime,
        exitIntentConversionRate,
      },
      topEngaged,
      allProfiles: engagementProfiles,
    });
  } catch (error) {
    console.error('Engagement analytics error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch engagement analytics' },
      { status: 500 }
    );
  }
}
