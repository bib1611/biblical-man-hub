import { NextRequest, NextResponse } from 'next/server';
import { CREDIT_PRICING } from '@/types/counseling';

// For MVP, we'll use a simple in-memory store
// In production, this should use a database like Supabase or PostgreSQL
const userCreditsStore = new Map<string, {
  email: string;
  credits: number;
  totalCreditsEarned: number;
  createdAt: string;
  lastCreditUpdate: string;
}>();

export async function GET(request: NextRequest) {
  try {
    const email = request.nextUrl.searchParams.get('email');

    if (!email) {
      return NextResponse.json(
        { error: 'Email parameter required' },
        { status: 400 }
      );
    }

    // Get or create user credit account
    let userCredits = userCreditsStore.get(email);

    if (!userCredits) {
      // New user - give them initial free credits
      userCredits = {
        email,
        credits: CREDIT_PRICING.INITIAL_FREE_CREDITS,
        totalCreditsEarned: CREDIT_PRICING.INITIAL_FREE_CREDITS,
        createdAt: new Date().toISOString(),
        lastCreditUpdate: new Date().toISOString(),
      };
      userCreditsStore.set(email, userCredits);
    }

    return NextResponse.json({
      success: true,
      credits: userCredits.credits,
      totalCreditsEarned: userCredits.totalCreditsEarned,
    });
  } catch (error) {
    console.error('Get credits error:', error);
    return NextResponse.json(
      { error: 'Failed to get credits' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, action, amount, paymentId } = body;

    if (!email || !action) {
      return NextResponse.json(
        { error: 'Email and action required' },
        { status: 400 }
      );
    }

    // Get or create user
    let userCredits = userCreditsStore.get(email);

    if (!userCredits) {
      userCredits = {
        email,
        credits: CREDIT_PRICING.INITIAL_FREE_CREDITS,
        totalCreditsEarned: CREDIT_PRICING.INITIAL_FREE_CREDITS,
        createdAt: new Date().toISOString(),
        lastCreditUpdate: new Date().toISOString(),
      };
    }

    switch (action) {
      case 'use':
        // Deduct credit
        if (userCredits.credits < (amount || 1)) {
          return NextResponse.json(
            { error: 'Insufficient credits', credits: userCredits.credits },
            { status: 402 } // Payment Required
          );
        }
        userCredits.credits -= (amount || 1);
        userCredits.lastCreditUpdate = new Date().toISOString();
        break;

      case 'add':
        // Add credits (from purchase)
        userCredits.credits += (amount || CREDIT_PRICING.CREDITS_PER_PURCHASE);
        userCredits.totalCreditsEarned += (amount || CREDIT_PRICING.CREDITS_PER_PURCHASE);
        userCredits.lastCreditUpdate = new Date().toISOString();
        break;

      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        );
    }

    userCreditsStore.set(email, userCredits);

    return NextResponse.json({
      success: true,
      credits: userCredits.credits,
      action,
      amount: amount || 1,
    });
  } catch (error) {
    console.error('Credit operation error:', error);
    return NextResponse.json(
      { error: 'Failed to process credit operation' },
      { status: 500 }
    );
  }
}
