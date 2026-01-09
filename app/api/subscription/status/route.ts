import { NextRequest, NextResponse } from 'next/server';
import { getSubscriptionByEmail, hasActiveSubscriptionByEmail } from '@/lib/subscription';

export async function GET(request: NextRequest) {
  try {
    const email = request.nextUrl.searchParams.get('email');

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    const isActive = await hasActiveSubscriptionByEmail(email);
    const subscription = await getSubscriptionByEmail(email);

    return NextResponse.json({
      isActive,
      subscription: subscription ? {
        status: subscription.status,
        planType: subscription.planType,
        currentPeriodEnd: subscription.currentPeriodEnd,
        cancelAtPeriodEnd: subscription.cancelAtPeriodEnd,
      } : null,
    });
  } catch (error) {
    console.error('Status check error:', error);
    return NextResponse.json(
      { error: 'Failed to check subscription status' },
      { status: 500 }
    );
  }
}
