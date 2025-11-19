import { NextRequest, NextResponse } from 'next/server';
import { getDB } from '@/lib/db';
import { verifyAdminAuth } from '@/lib/auth';
import { Lead } from '@/types';

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
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    let leads: Lead[] = status
      ? await db.getLeadsByStatus(status as any)
      : await db.getAllLeads();

    // Sort by score (highest first) then by date (newest first)
    leads = leads.sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return new Date(b.firstContact).getTime() - new Date(a.firstContact).getTime();
    });

    return NextResponse.json({ leads });
  } catch (error) {
    console.error('Admin leads error:', error);
    return NextResponse.json({ error: 'Failed to fetch leads' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    // SECURITY: Verify admin authentication
    const isAuthenticated = await verifyAdminAuth(request);
    if (!isAuthenticated) {
      return NextResponse.json(
        { error: 'Unauthorized - Admin access required' },
        { status: 401 }
      );
    }

    const { leadId, updates } = await request.json();
    const db = getDB();

    db.updateLead(leadId, updates);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Admin lead update error:', error);
    return NextResponse.json({ error: 'Failed to update lead' }, { status: 500 });
  }
}
