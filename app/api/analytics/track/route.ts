import { NextRequest, NextResponse } from 'next/server';
import { getDB } from '@/lib/db';
import { v4 as uuidv4 } from 'uuid';
import { Visitor } from '@/types';
import { createClient } from '@supabase/supabase-js';

// Extract IP address from request headers
function getClientIP(request: NextRequest): string {
  const forwardedFor = request.headers.get('x-forwarded-for');
  if (forwardedFor) return forwardedFor.split(',')[0].trim();

  const realIP = request.headers.get('x-real-ip');
  if (realIP) return realIP;

  const cfConnectingIP = request.headers.get('cf-connecting-ip');
  if (cfConnectingIP) return cfConnectingIP;

  return 'unknown';
}

// Parse user agent for detailed browser/device info
function parseUserAgent(userAgent: string) {
  const isMobile = /Mobile|Android|iPhone|iPad|iPod/i.test(userAgent);

  let browser = 'Unknown';
  let browserVersion = '';
  if (userAgent.includes('Chrome')) {
    browser = 'Chrome';
    const match = userAgent.match(/Chrome\/([\d.]+)/);
    browserVersion = match ? match[1] : '';
  } else if (userAgent.includes('Firefox')) {
    browser = 'Firefox';
    const match = userAgent.match(/Firefox\/([\d.]+)/);
    browserVersion = match ? match[1] : '';
  } else if (userAgent.includes('Safari') && !userAgent.includes('Chrome')) {
    browser = 'Safari';
    const match = userAgent.match(/Version\/([\d.]+)/);
    browserVersion = match ? match[1] : '';
  } else if (userAgent.includes('Edge')) {
    browser = 'Edge';
    const match = userAgent.match(/Edge\/([\d.]+)/);
    browserVersion = match ? match[1] : '';
  }

  let os = 'Unknown';
  let osVersion = '';
  if (userAgent.includes('Windows NT')) {
    os = 'Windows';
    const match = userAgent.match(/Windows NT ([\d.]+)/);
    osVersion = match ? match[1] : '';
  } else if (userAgent.includes('Mac OS X')) {
    os = 'macOS';
    const match = userAgent.match(/Mac OS X ([\d_]+)/);
    osVersion = match ? match[1].replace(/_/g, '.') : '';
  } else if (userAgent.includes('Linux')) {
    os = 'Linux';
  } else if (userAgent.includes('Android')) {
    os = 'Android';
    const match = userAgent.match(/Android ([\d.]+)/);
    osVersion = match ? match[1] : '';
  } else if (userAgent.includes('iPhone') || userAgent.includes('iPad')) {
    os = 'iOS';
    const match = userAgent.match(/OS ([\d_]+)/);
    osVersion = match ? match[1].replace(/_/g, '.') : '';
  }

  const device = isMobile ? 'Mobile' : 'Desktop';

  return { browser, browserVersion, os, osVersion, device, isMobile };
}

// Get detailed geolocation from IP using ipapi.co (free tier: 1000 requests/day)
async function getGeoData(ip: string) {
  if (ip === 'unknown' || ip.includes('localhost') || ip.includes('127.0.0.1') || ip.includes('::1')) {
    return {
      country: 'Local',
      countryCode: 'LC',
      region: 'Local',
      city: 'Local',
      timezone: 'UTC',
    };
  }

  try {
    const response = await fetch(`https://ipapi.co/${ip}/json/`, {
      next: { revalidate: 86400 }, // Cache for 24 hours
    });

    if (!response.ok) {
      console.warn('Geo lookup failed, using fallback');
      return null;
    }

    const data = await response.json();

    return {
      country: data.country_name || 'Unknown',
      countryCode: data.country_code || 'UN',
      region: data.region || 'Unknown',
      city: data.city || 'Unknown',
      zip: data.postal || undefined,
      latitude: data.latitude || undefined,
      longitude: data.longitude || undefined,
      timezone: data.timezone || 'UTC',
      isp: data.org || undefined,
      org: data.org || undefined,
    };
  } catch (error) {
    console.error('Geo lookup error:', error);
    return null;
  }
}

// Parse referrer URL to extract meaningful traffic source
function parseTrafficSource(referrer: string, utmSource?: string) {
  // UTM parameters take priority (most accurate attribution)
  if (utmSource) {
    return {
      source: utmSource,
      medium: 'utm', // Will be overridden by actual utmMedium if exists
      channel: categorizeChannel(utmSource),
    };
  }

  // Direct traffic (no referrer)
  if (!referrer || referrer === 'direct') {
    return {
      source: 'direct',
      medium: 'none',
      channel: 'Direct',
    };
  }

  try {
    const url = new URL(referrer);
    const hostname = url.hostname.replace('www.', '');

    // Social media platforms (Facebook/Meta level tracking)
    const socialPlatforms: Record<string, string> = {
      'facebook.com': 'Facebook',
      'fb.com': 'Facebook',
      'm.facebook.com': 'Facebook (Mobile)',
      'l.facebook.com': 'Facebook (Link)',
      'lm.facebook.com': 'Facebook (Messenger)',
      'instagram.com': 'Instagram',
      'twitter.com': 'Twitter/X',
      'x.com': 'Twitter/X',
      't.co': 'Twitter/X (Short Link)',
      'linkedin.com': 'LinkedIn',
      'youtube.com': 'YouTube',
      'reddit.com': 'Reddit',
      'pinterest.com': 'Pinterest',
      'tiktok.com': 'TikTok',
      'snapchat.com': 'Snapchat',
      'telegram.org': 'Telegram',
      'whatsapp.com': 'WhatsApp',
    };

    // Search engines
    const searchEngines: Record<string, string> = {
      'google.com': 'Google',
      'bing.com': 'Bing',
      'yahoo.com': 'Yahoo',
      'duckduckgo.com': 'DuckDuckGo',
      'baidu.com': 'Baidu',
      'yandex.com': 'Yandex',
    };

    // Email platforms
    const emailPlatforms = ['mail.google.com', 'outlook.com', 'mail.yahoo.com'];

    // Christian/Religious platforms
    const christianPlatforms: Record<string, string> = {
      'substack.com': 'Substack',
      'thebiblicalman.substack.com': 'Biblical Man Newsletter',
      'christianpost.com': 'Christian Post',
      'desiringgod.org': 'Desiring God',
      'thegospelcoalition.org': 'Gospel Coalition',
    };

    // Check social platforms
    for (const [domain, name] of Object.entries(socialPlatforms)) {
      if (hostname.includes(domain)) {
        return {
          source: name,
          medium: 'social',
          channel: 'Social',
        };
      }
    }

    // Check search engines
    for (const [domain, name] of Object.entries(searchEngines)) {
      if (hostname.includes(domain)) {
        return {
          source: name,
          medium: 'organic',
          channel: 'Organic Search',
        };
      }
    }

    // Check email
    if (emailPlatforms.some(domain => hostname.includes(domain))) {
      return {
        source: 'Email',
        medium: 'email',
        channel: 'Email',
      };
    }

    // Check Christian platforms
    for (const [domain, name] of Object.entries(christianPlatforms)) {
      if (hostname.includes(domain)) {
        return {
          source: name,
          medium: 'referral',
          channel: 'Referral',
        };
      }
    }

    // Generic referral
    return {
      source: hostname,
      medium: 'referral',
      channel: 'Referral',
    };
  } catch {
    return {
      source: 'unknown',
      medium: 'unknown',
      channel: 'Unknown',
    };
  }
}

// Categorize channel for analytics grouping
function categorizeChannel(source: string): string {
  const lowerSource = String(source || '').toLowerCase();

  if (lowerSource.includes('google') || lowerSource.includes('bing') || lowerSource.includes('search')) {
    return 'Organic Search';
  }
  if (lowerSource.includes('facebook') || lowerSource.includes('instagram') || lowerSource.includes('twitter') || lowerSource.includes('linkedin')) {
    return 'Social';
  }
  if (lowerSource.includes('email') || lowerSource.includes('newsletter')) {
    return 'Email';
  }
  if (lowerSource.includes('ad') || lowerSource.includes('cpc') || lowerSource.includes('ppc')) {
    return 'Paid Ads';
  }
  if (lowerSource === 'direct') {
    return 'Direct';
  }
  return 'Referral';
}

// Calculate lead score based on visitor behavior
function calculateLeadScore(visitor: Visitor): number {
  let score = 0;

  // Email captured = +40 points
  if (visitor.email) score += 40;

  // Counselor mode enabled = +30 points
  if (visitor.enabledCounselorMode) score += 30;

  // Purchased credits = +50 points (max score)
  if (visitor.purchasedCredits) return 100;

  // Interacted with Sam = +15 points
  if (visitor.interactedWithSam) score += 15;

  // Page views (1 point per page, max 10)
  score += Math.min(visitor.pageViews, 10);

  // Time on site (1 point per minute, max 5)
  score += Math.min(Math.floor(visitor.totalTimeOnSite / 60), 5);

  return Math.min(score, 100);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { visitorId, sessionId, type, data, timestamp } = body;

    const db = getDB();

    // 🔥 DUAL-WRITE: Store in both local DB AND Supabase
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const ip = getClientIP(request);
    const userAgent = request.headers.get('user-agent') || 'Unknown';
    const { browser, browserVersion, os, osVersion, device, isMobile } = parseUserAgent(userAgent);

    // Create or update visitor
    let visitor = await db.getVisitor(visitorId);

    if (!visitor) {
      // New visitor - get geo data
      const geoData = await getGeoData(ip);

      // Parse traffic source with precision
      const trafficSource = parseTrafficSource(data.referrer, data.utmSource);

      visitor = {
        id: visitorId,
        sessionId,
        firstSeen: timestamp,
        lastSeen: timestamp,

        // Geographic data
        ip,
        country: geoData?.country,
        countryCode: geoData?.countryCode,
        region: geoData?.region,
        city: geoData?.city,
        zip: geoData?.zip,
        latitude: geoData?.latitude,
        longitude: geoData?.longitude,
        timezone: geoData?.timezone,
        isp: geoData?.isp,
        org: geoData?.org,

        // Device/browser data
        userAgent,
        browser,
        browserVersion,
        os,
        osVersion,
        device,
        isMobile,
        screenResolution: data.screenResolution,
        language: data.language || navigator?.language,

        // Traffic source (enhanced with parsing)
        referrer: data.referrer,
        trafficSource: trafficSource.source,
        trafficMedium: data.utmMedium || trafficSource.medium,
        trafficChannel: trafficSource.channel,
        utmSource: data.utmSource,
        utmMedium: data.utmMedium,
        utmCampaign: data.utmCampaign,
        utmContent: data.utmContent,
        utmTerm: data.utmTerm,
        landingPage: data.page || '/',

        // Behavioral data
        pageViews: 0,
        totalTimeOnSite: 0,
        pagesVisited: [],
        windowsOpened: [],
        interactedWithSam: false,
        enabledCounselorMode: false,
        purchasedCredits: false,

        // Status
        isActive: true,
        status: 'active',
        leadScore: 0,

        // Tracking
        cookiesEnabled: data.cookiesEnabled !== false,
        fingerprint: data.fingerprint,
      };
    } else {
      // Update existing visitor
      visitor.lastSeen = timestamp;
      visitor.isActive = true;

      // Update email if captured
      if (data.email && !visitor.email) {
        visitor.email = data.email;
      }

      // Track page views
      if (type === 'page_view') {
        visitor.pageViews++;
        if (data.page && !visitor.pagesVisited.includes(data.page)) {
          visitor.pagesVisited.push(data.page);
        }
      }

      // Track window opens
      if (type === 'window_open' && data.window) {
        if (!visitor.windowsOpened.includes(data.window)) {
          visitor.windowsOpened.push(data.window);
        }
        if (data.window === 'sam') {
          visitor.interactedWithSam = true;
        }
      }

      // Track counselor mode
      if (type === 'counselor_mode_enabled' || data.counselorMode) {
        visitor.enabledCounselorMode = true;
      }

      // Track purchases
      if (type === 'purchase' || data.purchased) {
        visitor.purchasedCredits = true;
        visitor.status = 'converted';
      }

      // Track email capture
      if (type === 'email_capture') {
        visitor.status = 'converted';
      }

      // Update time on site
      if (data.timeOnSite) {
        visitor.totalTimeOnSite = data.timeOnSite;
      }
    }

    // Recalculate lead score
    visitor.leadScore = calculateLeadScore(visitor);

    // Determine status if not already converted
    if (visitor.status !== 'converted') {
      if (visitor.pageViews === 1 && visitor.totalTimeOnSite < 30) {
        visitor.status = 'bounced';
      } else if (visitor.leadScore >= 50) {
        visitor.status = 'active';
      } else if (!visitor.isActive) {
        visitor.status = 'abandoned';
      }
    }

    await db.createOrUpdateVisitor(visitor);

    // Log event
    await db.addEvent({
      id: uuidv4(),
      visitorId,
      sessionId,
      type,
      data,
      timestamp,
    });

    // 🔥 DUAL-WRITE: Also store in Supabase for Enhanced Tracking dashboard
    try {
      // Upsert visitor profile to Supabase
      await supabase.from('visitor_profiles').upsert({
        id: visitor.id,
        session_id: visitor.sessionId,
        created_at: visitor.firstSeen,
        updated_at: visitor.lastSeen,
        is_returning: visitor.pageViews > 1,
        has_email: !!visitor.email,
        email: visitor.email,
        lead_score: visitor.leadScore,
        psychographic_data: null, // Will be populated by personalization system
        traffic_source: visitor.trafficSource,
        referrer: visitor.referrer,
        device_type: visitor.device,
        browser: visitor.browser,
        country: visitor.country,
      }, { onConflict: 'id' });

      // Insert event to Supabase
      await supabase.from('behavioral_events').insert({
        id: uuidv4(),
        visitor_id: visitor.id,
        session_id: sessionId,
        event_type: type,
        event_data: data,
        created_at: timestamp,
      });
    } catch (supabaseError) {
      console.error('Supabase dual-write error:', supabaseError);
      // Don't fail the request if Supabase write fails
    }

    return NextResponse.json({
      success: true,
      leadScore: visitor.leadScore,
      status: visitor.status,
    });
  } catch (error) {
    console.error('Analytics tracking error:', error);
    return NextResponse.json({ error: 'Failed to track event' }, { status: 500 });
  }
}
