import { NextRequest, NextResponse } from 'next/server';
import { getDB } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const { visitorId } = await request.json();
    const db = getDB();

    const visitor = await db.getVisitor(visitorId);
    if (visitor) {
      visitor.lastSeen = new Date().toISOString();
      visitor.isActive = true;
      await db.createOrUpdateVisitor(visitor);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update heartbeat' }, { status: 500 });
  }
}
