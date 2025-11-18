import { NextRequest, NextResponse } from 'next/server';
import { getDB } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const db = getDB();
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    let leads = status
      ? db.getLeadsByStatus(status as any)
      : db.getAllLeads();

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
    const { leadId, updates } = await request.json();
    const db = getDB();

    db.updateLead(leadId, updates);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Admin lead update error:', error);
    return NextResponse.json({ error: 'Failed to update lead' }, { status: 500 });
  }
}
