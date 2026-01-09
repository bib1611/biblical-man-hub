import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2025-11-17.clover',
});

// Price IDs - these will be created by the setup script
const PRICE_IDS = {
  monthly: process.env.STRIPE_MONTHLY_PRICE_ID || '',
  yearly: process.env.STRIPE_YEARLY_PRICE_ID || '',
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { plan, email } = body;

    if (!plan || !['monthly', 'yearly'].includes(plan)) {
      return NextResponse.json(
        { error: 'Invalid plan. Must be "monthly" or "yearly"' },
        { status: 400 }
      );
    }

    const priceId = PRICE_IDS[plan as keyof typeof PRICE_IDS];

    if (!priceId) {
      return NextResponse.json(
        { error: 'Stripe price ID not configured. Run the setup script first.' },
        { status: 500 }
      );
    }

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${siteUrl}/premium/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/premium?canceled=true`,
      customer_email: email || undefined,
      allow_promotion_codes: true,
      billing_address_collection: 'auto',
      subscription_data: {
        metadata: {
          plan: plan,
        },
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error('Checkout error:', error);
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}
