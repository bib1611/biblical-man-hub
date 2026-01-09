// Premium Subscription Management System
import 'server-only';
import { createClient } from '@supabase/supabase-js';
import Stripe from 'stripe';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2025-11-17.clover',
});

// Subscription Plans Configuration
export const SUBSCRIPTION_PLANS = {
  monthly: {
    id: 'premium_monthly',
    name: 'Premium Monthly',
    price: 1999, // $19.99
    interval: 'month' as const,
    features: [
      'Daily AI-Generated Devotionals',
      'Premium Bible Study Plans',
      '7-Day Transformation Guides',
      'Priority Email Support',
      'Exclusive Community Access',
      'Ad-Free Experience',
    ],
  },
  yearly: {
    id: 'premium_yearly',
    name: 'Premium Yearly',
    price: 19900, // $199/year (save ~$40)
    interval: 'year' as const,
    features: [
      'All Monthly Features',
      '2 Months Free',
      'Annual Planning Guides',
      'Direct Access to Adam',
    ],
  },
};

export interface Subscription {
  id: string;
  userId: string;
  email: string;
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
  stripePriceId?: string;
  status: 'active' | 'canceled' | 'past_due' | 'trialing' | 'inactive';
  planType: 'monthly' | 'yearly';
  currentPeriodStart?: Date;
  currentPeriodEnd?: Date;
  cancelAtPeriodEnd: boolean;
  canceledAt?: Date;
  trialEnd?: Date;
  amount: number;
  currency: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Check if user has active subscription
 */
export async function hasActiveSubscription(userId: string): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .from('subscriptions')
      .select('status')
      .eq('user_id', userId)
      .in('status', ['active', 'trialing'])
      .single();

    return !error && data !== null;
  } catch {
    return false;
  }
}

/**
 * Check if email has active subscription
 */
export async function hasActiveSubscriptionByEmail(email: string): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .from('subscriptions')
      .select('status')
      .eq('email', email.toLowerCase())
      .in('status', ['active', 'trialing'])
      .single();

    return !error && data !== null;
  } catch {
    return false;
  }
}

/**
 * Get subscription by user ID
 */
export async function getSubscriptionByUserId(userId: string): Promise<Subscription | null> {
  try {
    const { data, error } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (error || !data) return null;
    return mapSubscription(data);
  } catch {
    return null;
  }
}

/**
 * Get subscription by email
 */
export async function getSubscriptionByEmail(email: string): Promise<Subscription | null> {
  try {
    const { data, error } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('email', email.toLowerCase())
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (error || !data) return null;
    return mapSubscription(data);
  } catch {
    return null;
  }
}

/**
 * Create or update subscription from Stripe webhook
 */
export async function upsertSubscription(params: {
  stripeCustomerId: string;
  stripeSubscriptionId: string;
  stripePriceId: string;
  email: string;
  status: string;
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  cancelAtPeriodEnd: boolean;
  amount: number;
}): Promise<Subscription | null> {
  try {
    const planType = params.amount >= 10000 ? 'yearly' : 'monthly';

    const subscriptionData = {
      stripe_customer_id: params.stripeCustomerId,
      stripe_subscription_id: params.stripeSubscriptionId,
      stripe_price_id: params.stripePriceId,
      email: params.email.toLowerCase(),
      status: params.status,
      plan_type: planType,
      current_period_start: params.currentPeriodStart.toISOString(),
      current_period_end: params.currentPeriodEnd.toISOString(),
      cancel_at_period_end: params.cancelAtPeriodEnd,
      amount: params.amount,
    };

    // Check if subscription exists
    const { data: existing } = await supabase
      .from('subscriptions')
      .select('id')
      .eq('stripe_subscription_id', params.stripeSubscriptionId)
      .single();

    if (existing) {
      // Update existing
      const { data, error } = await supabase
        .from('subscriptions')
        .update(subscriptionData)
        .eq('stripe_subscription_id', params.stripeSubscriptionId)
        .select()
        .single();

      if (error) throw error;
      return mapSubscription(data);
    } else {
      // Create new with user_id
      const userId = `user_${crypto.randomUUID()}`;
      const { data, error } = await supabase
        .from('subscriptions')
        .insert({ ...subscriptionData, user_id: userId })
        .select()
        .single();

      if (error) throw error;
      return mapSubscription(data);
    }
  } catch (error) {
    console.error('Error upserting subscription:', error);
    return null;
  }
}

/**
 * Cancel subscription
 */
export async function cancelSubscription(subscriptionId: string): Promise<boolean> {
  try {
    // Get Stripe subscription ID
    const { data: sub } = await supabase
      .from('subscriptions')
      .select('stripe_subscription_id')
      .eq('id', subscriptionId)
      .single();

    if (!sub?.stripe_subscription_id) return false;

    // Cancel at period end via Stripe
    await stripe.subscriptions.update(sub.stripe_subscription_id, {
      cancel_at_period_end: true,
    });

    // Update local record
    await supabase
      .from('subscriptions')
      .update({
        cancel_at_period_end: true,
        canceled_at: new Date().toISOString(),
      })
      .eq('id', subscriptionId);

    return true;
  } catch (error) {
    console.error('Error canceling subscription:', error);
    return false;
  }
}

/**
 * Get all active subscribers (for sending emails)
 */
export async function getActiveSubscribers(): Promise<string[]> {
  try {
    const { data, error } = await supabase
      .from('subscriptions')
      .select('email')
      .in('status', ['active', 'trialing']);

    if (error) throw error;
    return data.map(s => s.email);
  } catch (error) {
    console.error('Error getting active subscribers:', error);
    return [];
  }
}

/**
 * Record revenue from subscription payment
 */
export async function recordSubscriptionRevenue(params: {
  subscriptionId: string;
  amount: number;
  stripeInvoiceId: string;
}): Promise<void> {
  try {
    await supabase.from('subscription_revenue').insert({
      subscription_id: params.subscriptionId,
      amount: params.amount,
      stripe_invoice_id: params.stripeInvoiceId,
    });
  } catch (error) {
    console.error('Error recording revenue:', error);
  }
}

/**
 * Get monthly recurring revenue
 */
export async function getMonthlyRecurringRevenue(): Promise<number> {
  try {
    const { data, error } = await supabase
      .from('subscriptions')
      .select('amount, plan_type')
      .in('status', ['active', 'trialing']);

    if (error) throw error;

    let mrr = 0;
    for (const sub of data) {
      if (sub.plan_type === 'yearly') {
        mrr += Math.round(sub.amount / 12);
      } else {
        mrr += sub.amount;
      }
    }

    return mrr;
  } catch {
    return 0;
  }
}

/**
 * Get subscriber count
 */
export async function getSubscriberCount(): Promise<number> {
  try {
    const { count, error } = await supabase
      .from('subscriptions')
      .select('*', { count: 'exact', head: true })
      .in('status', ['active', 'trialing']);

    if (error) throw error;
    return count || 0;
  } catch {
    return 0;
  }
}

/**
 * Create Stripe checkout session for subscription
 */
export async function createCheckoutSession(params: {
  priceId: string;
  successUrl: string;
  cancelUrl: string;
  customerEmail?: string;
  trialDays?: number;
}): Promise<string | null> {
  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: params.priceId,
          quantity: 1,
        },
      ],
      success_url: params.successUrl,
      cancel_url: params.cancelUrl,
      customer_email: params.customerEmail,
      subscription_data: params.trialDays
        ? { trial_period_days: params.trialDays }
        : undefined,
      allow_promotion_codes: true,
      billing_address_collection: 'auto',
    });

    return session.url;
  } catch (error) {
    console.error('Error creating checkout session:', error);
    return null;
  }
}

/**
 * Create Stripe customer portal session
 */
export async function createPortalSession(params: {
  customerId: string;
  returnUrl: string;
}): Promise<string | null> {
  try {
    const session = await stripe.billingPortal.sessions.create({
      customer: params.customerId,
      return_url: params.returnUrl,
    });

    return session.url;
  } catch (error) {
    console.error('Error creating portal session:', error);
    return null;
  }
}

// Helper function to map database record to Subscription type
function mapSubscription(data: any): Subscription {
  return {
    id: data.id,
    userId: data.user_id,
    email: data.email,
    stripeCustomerId: data.stripe_customer_id,
    stripeSubscriptionId: data.stripe_subscription_id,
    stripePriceId: data.stripe_price_id,
    status: data.status,
    planType: data.plan_type,
    currentPeriodStart: data.current_period_start ? new Date(data.current_period_start) : undefined,
    currentPeriodEnd: data.current_period_end ? new Date(data.current_period_end) : undefined,
    cancelAtPeriodEnd: data.cancel_at_period_end,
    canceledAt: data.canceled_at ? new Date(data.canceled_at) : undefined,
    trialEnd: data.trial_end ? new Date(data.trial_end) : undefined,
    amount: data.amount,
    currency: data.currency,
    createdAt: new Date(data.created_at),
    updatedAt: new Date(data.updated_at),
  };
}
