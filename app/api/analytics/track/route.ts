import { NextRequest, NextResponse } from 'next/server';
import { getDB } from '@/lib/db';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { visitorId, sessionId, type, data, timestamp } = body;

    const db = getDB();

    // Create or update visitor
    let visitor = db.getVisitor(visitorId);
    if (!visitor) {
      visitor = {
        id: visitorId,
        sessionId,
        firstSeen: timestamp,
        lastSeen: timestamp,
        pageViews: 0,
        totalTimeOnSite: 0,
        isActive: true,
        referrer: data.referrer,
        utmSource: data.utmSource,
        utmMedium: data.utmMedium,
        utmCampaign: data.utmCampaign,
      };
    } else {
      visitor.lastSeen = timestamp;
      visitor.isActive = true;
      visitor.pageViews += type === 'page_view' ? 1 : 0;
    }

    db.createOrUpdateVisitor(visitor);

    // Log event
    db.addEvent({
      id: uuidv4(),
      visitorId,
      sessionId,
      type,
      data,
      timestamp,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Analytics tracking error:', error);
    return NextResponse.json({ error: 'Failed to track event' }, { status: 500 });
  }
}
