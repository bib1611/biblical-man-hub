import { NextRequest, NextResponse } from 'next/server';
import { getDB } from '@/lib/db';

/**
 * GET /api/admin/behavioral
 *
 * Returns behavioral analytics data for stalker-level insights:
 * - Rage clicks, dead clicks
 * - Mouse heatmap data
 * - Scroll depth per page
 * - Form abandonment
 * - Tab visibility patterns
 * - Element visibility
 * - Error tracking
 */
export async function GET(request: NextRequest) {
  try {
    const db = getDB();
    const events = await db.getEvents();

    // Filter for behavioral events only
    const behavioralEvents = events.filter((e: any) => e.type === 'custom');

    // RAGE CLICKS ANALYSIS
    const rageClicks = behavioralEvents.filter((e: any) => e.data.eventName === 'rage_click');
    const rageClicksByPage: Record<string, number> = {};
    const rageClickHotspots: any[] = [];

    rageClicks.forEach((event: any) => {
      const page = event.data.page || '/';
      rageClicksByPage[page] = (rageClicksByPage[page] || 0) + 1;

      rageClickHotspots.push({
        page: event.data.page,
        x: event.data.x,
        y: event.data.y,
        element: event.data.element,
        clickCount: event.data.clickCount,
        visitorId: event.visitorId,
        timestamp: event.timestamp,
      });
    });

    // DEAD CLICKS ANALYSIS
    const deadClicks = behavioralEvents.filter((e: any) => e.data.eventName === 'dead_click');
    const deadClicksByPage: Record<string, number> = {};
    const deadClickHotspots: any[] = [];

    deadClicks.forEach((event: any) => {
      const page = event.data.page || '/';
      deadClicksByPage[page] = (deadClicksByPage[page] || 0) + 1;

      deadClickHotspots.push({
        page: event.data.page,
        x: event.data.x,
        y: event.data.y,
        element: event.data.element,
        visitorId: event.visitorId,
        timestamp: event.timestamp,
      });
    });

    // CLICK HEATMAP DATA
    const allClicks = behavioralEvents.filter((e: any) => e.data.eventName === 'click');
    const clickHeatmapByPage: Record<string, any[]> = {};

    allClicks.forEach((event: any) => {
      const page = event.data.page || '/';
      if (!clickHeatmapByPage[page]) {
        clickHeatmapByPage[page] = [];
      }
      clickHeatmapByPage[page].push({
        x: event.data.x,
        y: event.data.y,
        element: event.data.element,
      });
    });

    // SCROLL DEPTH ANALYSIS
    const scrollEvents = behavioralEvents.filter((e: any) => e.data.eventName === 'scroll_depth');
    const scrollDepthByPage: Record<string, { avg: number; distribution: Record<number, number> }> = {};

    scrollEvents.forEach((event: any) => {
      const page = event.data.page || '/';
      if (!scrollDepthByPage[page]) {
        scrollDepthByPage[page] = { avg: 0, distribution: { 25: 0, 50: 0, 75: 0, 100: 0 } };
      }

      const depth = event.data.depth;
      if (depth >= 25) scrollDepthByPage[page].distribution[25]++;
      if (depth >= 50) scrollDepthByPage[page].distribution[50]++;
      if (depth >= 75) scrollDepthByPage[page].distribution[75]++;
      if (depth >= 100) scrollDepthByPage[page].distribution[100]++;
    });

    // Calculate average scroll depth
    Object.keys(scrollDepthByPage).forEach((page) => {
      const dist = scrollDepthByPage[page].distribution;
      const total = dist[25] + dist[50] + dist[75] + dist[100];
      if (total > 0) {
        scrollDepthByPage[page].avg = Math.round(
          ((dist[25] * 25 + dist[50] * 50 + dist[75] * 75 + dist[100] * 100) / total)
        );
      }
    });

    // FORM ABANDONMENT ANALYSIS
    const formFocusEvents = behavioralEvents.filter((e: any) => e.data.eventName === 'form_field_focus');
    const formBlurEvents = behavioralEvents.filter((e: any) => e.data.eventName === 'form_field_blur');

    const formAbandonmentByField: Record<string, { focused: number; abandoned: number; abandonmentRate: number }> = {};

    formBlurEvents.forEach((event: any) => {
      const field = event.data.fieldName || 'unknown';
      if (!formAbandonmentByField[field]) {
        formAbandonmentByField[field] = { focused: 0, abandoned: 0, abandonmentRate: 0 };
      }

      if (event.data.wasAbandoned) {
        formAbandonmentByField[field].abandoned++;
      }
    });

    formFocusEvents.forEach((event: any) => {
      const field = event.data.fieldName || 'unknown';
      if (!formAbandonmentByField[field]) {
        formAbandonmentByField[field] = { focused: 0, abandoned: 0, abandonmentRate: 0 };
      }
      formAbandonmentByField[field].focused++;
    });

    // Calculate abandonment rate
    Object.keys(formAbandonmentByField).forEach((field) => {
      const data = formAbandonmentByField[field];
      data.abandonmentRate = data.focused > 0 ? Math.round((data.abandoned / data.focused) * 100) : 0;
    });

    // TAB VISIBILITY PATTERNS
    const tabHiddenEvents = behavioralEvents.filter((e: any) => e.data.eventName === 'tab_hidden');
    const tabVisibleEvents = behavioralEvents.filter((e: any) => e.data.eventName === 'tab_visible');

    const tabSwitchRate = tabHiddenEvents.length;
    const avgTimeBeforeTabSwitch = tabHiddenEvents.length > 0
      ? Math.round(
          tabHiddenEvents.reduce((sum: number, e: any) => sum + (e.data.timeOnPage || 0), 0) /
            tabHiddenEvents.length / 1000
        )
      : 0;

    // USER IDLE PATTERNS
    const idleEvents = behavioralEvents.filter((e: any) => e.data.eventName === 'user_idle');
    const idleRate = idleEvents.length;
    const avgIdleTime = idleEvents.length > 0
      ? Math.round(
          idleEvents.reduce((sum: number, e: any) => sum + (e.data.idleTime || 0), 0) / idleEvents.length
        )
      : 0;

    // ELEMENT VISIBILITY (what content users actually see)
    const elementVisibilityEvents = behavioralEvents.filter((e: any) => e.data.eventName === 'element_visible');
    const visibleElementsByPage: Record<string, Record<string, number>> = {};

    elementVisibilityEvents.forEach((event: any) => {
      const page = event.data.page || '/';
      const element = event.data.element || 'unknown';

      if (!visibleElementsByPage[page]) {
        visibleElementsByPage[page] = {};
      }

      visibleElementsByPage[page][element] = (visibleElementsByPage[page][element] || 0) + 1;
    });

    // ERROR TRACKING
    const jsErrors = behavioralEvents.filter((e: any) => e.data.eventName === 'javascript_error');
    const promiseRejections = behavioralEvents.filter((e: any) => e.data.eventName === 'promise_rejection');

    const errorsByPage: Record<string, number> = {};
    const errorMessages: any[] = [];

    [...jsErrors, ...promiseRejections].forEach((event: any) => {
      const page = event.data.page || '/';
      errorsByPage[page] = (errorsByPage[page] || 0) + 1;

      errorMessages.push({
        type: event.data.eventName === 'javascript_error' ? 'JS Error' : 'Promise Rejection',
        message: event.data.message || event.data.reason || 'Unknown error',
        page: event.data.page,
        timestamp: event.timestamp,
        visitorId: event.visitorId,
      });
    });

    // COPY/PASTE BEHAVIOR
    const copyEvents = behavioralEvents.filter((e: any) => e.data.eventName === 'copy');
    const pasteEvents = behavioralEvents.filter((e: any) => e.data.eventName === 'paste');

    const copyBehavior = {
      totalCopies: copyEvents.length,
      totalPastes: pasteEvents.length,
      copyByPage: {} as Record<string, number>,
      pasteByPage: {} as Record<string, number>,
    };

    copyEvents.forEach((e: any) => {
      const page = e.data.page || '/';
      copyBehavior.copyByPage[page] = (copyBehavior.copyByPage[page] || 0) + 1;
    });

    pasteEvents.forEach((e: any) => {
      const page = e.data.page || '/';
      copyBehavior.pasteByPage[page] = (copyBehavior.pasteByPage[page] || 0) + 1;
    });

    // HOVER BEHAVIOR (what elements users are interested in)
    const hoverEvents = behavioralEvents.filter((e: any) => e.data.eventName === 'hover');
    const hoversByElement: Record<string, number> = {};

    hoverEvents.forEach((event: any) => {
      const element = event.data.element || 'unknown';
      hoversByElement[element] = (hoversByElement[element] || 0) + 1;
    });

    const topHoveredElements = Object.entries(hoversByElement)
      .sort(([, a], [, b]) => (b as number) - (a as number))
      .slice(0, 20)
      .map(([element, count]) => ({ element, count }));

    // SUMMARY STATS
    const summary = {
      totalBehavioralEvents: behavioralEvents.length,
      totalRageClicks: rageClicks.length,
      totalDeadClicks: deadClicks.length,
      totalClicks: allClicks.length,
      totalFormAbandonment: Object.values(formAbandonmentByField).reduce((sum, f) => sum + f.abandoned, 0),
      totalErrors: jsErrors.length + promiseRejections.length,
      tabSwitchRate,
      avgTimeBeforeTabSwitch,
      idleRate,
      avgIdleTime,
      totalCopyActions: copyEvents.length,
      totalPasteActions: pasteEvents.length,
    };

    return NextResponse.json({
      summary,
      rageClicks: {
        total: rageClicks.length,
        byPage: rageClicksByPage,
        hotspots: rageClickHotspots.slice(-50), // Last 50 rage clicks
      },
      deadClicks: {
        total: deadClicks.length,
        byPage: deadClicksByPage,
        hotspots: deadClickHotspots.slice(-50), // Last 50 dead clicks
      },
      clickHeatmap: clickHeatmapByPage,
      scrollDepth: scrollDepthByPage,
      formAbandonment: formAbandonmentByField,
      tabVisibility: {
        switchCount: tabSwitchRate,
        avgTimeBeforeSwitch: avgTimeBeforeTabSwitch,
      },
      idlePatterns: {
        idleEventCount: idleRate,
        avgIdleTime,
      },
      elementVisibility: visibleElementsByPage,
      errors: {
        total: jsErrors.length + promiseRejections.length,
        byPage: errorsByPage,
        recentErrors: errorMessages.slice(-20), // Last 20 errors
      },
      copyPasteBehavior: copyBehavior,
      hoverBehavior: {
        topElements: topHoveredElements,
      },
    });
  } catch (error) {
    console.error('Behavioral analytics error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch behavioral analytics' },
      { status: 500 }
    );
  }
}
