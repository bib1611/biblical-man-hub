import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  // Create Supabase client inside the request handler
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
  try {
    const { searchParams } = new URL(request.url);
    const timeRange = searchParams.get('timeRange') || '24h';

    // Calculate time window
    const now = new Date();
    let startTime = new Date();

    switch (timeRange) {
      case '1h':
        startTime = new Date(now.getTime() - 60 * 60 * 1000);
        break;
      case '24h':
        startTime = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        break;
      case '7d':
        startTime = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case '30d':
        startTime = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      default:
        startTime = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    }

    // Get total visitors
    const { data: visitors, error: visitorsError } = await supabase
      .from('visitor_profiles')
      .select('id, created_at, is_returning, has_email, lead_score')
      .gte('created_at', startTime.toISOString());

    if (visitorsError) throw visitorsError;

    // Get all events for analysis
    const { data: events, error: eventsError } = await supabase
      .from('behavioral_events')
      .select('*')
      .gte('created_at', startTime.toISOString())
      .order('created_at', { ascending: false });

    if (eventsError) throw eventsError;

    // Get psychographic profiles
    const { data: profiles, error: profilesError } = await supabase
      .from('visitor_profiles')
      .select('id, psychographic_data')
      .gte('created_at', startTime.toISOString())
      .not('psychographic_data', 'is', null);

    if (profilesError) throw profilesError;

    // Calculate metrics
    const totalVisitors = visitors?.length || 0;
    const newVisitors = visitors?.filter(v => !v.is_returning).length || 0;
    const returningVisitors = visitors?.filter(v => v.is_returning).length || 0;
    const emailCaptureRate = visitors?.length
      ? ((visitors.filter(v => v.has_email).length / visitors.length) * 100).toFixed(1)
      : '0.0';

    const avgLeadScore = visitors?.length
      ? (visitors.reduce((sum, v) => sum + (v.lead_score || 0), 0) / visitors.length).toFixed(0)
      : '0';

    // Event breakdown
    const eventsByType = events?.reduce((acc: Record<string, number>, event) => {
      acc[event.event_type] = (acc[event.event_type] || 0) + 1;
      return acc;
    }, {}) || {};

    // Psychographic breakdown
    const psychographicBreakdown = profiles?.reduce((acc: Record<string, number>, profile) => {
      try {
        const data = typeof profile.psychographic_data === 'string'
          ? JSON.parse(profile.psychographic_data)
          : profile.psychographic_data;
        const type = data?.personalityType || 'unknown';
        acc[type] = (acc[type] || 0) + 1;
      } catch (e) {
        acc['unknown'] = (acc['unknown'] || 0) + 1;
      }
      return acc;
    }, {}) || {};

    // Traffic sources (from events)
    const trafficSources = events
      ?.filter(e => e.event_type === 'page_view' && e.event_data?.referrer)
      .reduce((acc: Record<string, number>, event) => {
        try {
          const data = typeof event.event_data === 'string'
            ? JSON.parse(event.event_data)
            : event.event_data;
          const referrer = new URL(data.referrer || 'direct').hostname || 'direct';
          acc[referrer] = (acc[referrer] || 0) + 1;
        } catch (e) {
          acc['direct'] = (acc['direct'] || 0) + 1;
        }
        return acc;
      }, {}) || {};

    // Conversion funnel
    const emailSubmits = events?.filter(e => e.event_type === 'email_capture').length || 0;
    const exitIntentShown = events?.filter(e => e.event_type === 'custom' && e.event_data?.eventName === 'exit_intent_shown').length || 0;
    const exitIntentConverted = events?.filter(e => e.event_type === 'custom' && e.event_data?.eventName === 'exit_intent_converted').length || 0;

    const response = {
      timeRange,
      metrics: {
        totalVisitors,
        newVisitors,
        returningVisitors,
        emailCaptureRate: parseFloat(emailCaptureRate),
        avgLeadScore: parseInt(avgLeadScore),
        totalEvents: events?.length || 0,
      },
      events: {
        byType: eventsByType,
        recent: events?.slice(0, 50) || [],
      },
      psychographics: psychographicBreakdown,
      trafficSources,
      conversions: {
        emailSubmits,
        exitIntentShown,
        exitIntentConverted,
        exitIntentConversionRate: exitIntentShown > 0
          ? ((exitIntentConverted / exitIntentShown) * 100).toFixed(1)
          : '0.0',
      },
      timestamp: new Date().toISOString(),
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Analytics dashboard error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch analytics' },
      { status: 500 }
    );
  }
}
