import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { Resend } from 'resend';
import { upgradeUserToMember } from '@/lib/session';

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2025-11-17.clover',
});

// Initialize Resend for sending emails
const resendApiKey = process.env.RESEND_API_KEY;
if (!resendApiKey) {
  console.warn('⚠️ RESEND_API_KEY is missing. Emails will not be sent.');
}
const resend = resendApiKey ? new Resend(resendApiKey) : null;

// This is your Stripe webhook secret (from Stripe Dashboard > Developers > Webhooks)
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || '';

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get('stripe-signature');

    if (!signature) {
      return NextResponse.json(
        { error: 'No signature found' },
        { status: 400 }
      );
    }

    // Verify the webhook signature
    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent(
        body,
        signature,
        webhookSecret
      );
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      console.error('⚠️  Webhook signature verification failed:', errorMessage);
      return NextResponse.json(
        { error: `Webhook Error: ${errorMessage}` },
        { status: 400 }
      );
    }

    // Handle the event
    console.log('✅ Webhook verified:', event.type);

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        await handleCheckoutSessionCompleted(session);
        break;
      }
      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        await handlePaymentIntentSucceeded(paymentIntent);
        break;
      }
      case 'customer.subscription.created':
      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionChange(subscription);
        break;
      }
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    );
  }
}

async function handleCheckoutSessionCompleted(session: Stripe.Checkout.Session) {
  console.log('💰 Checkout session completed:', session.id);

  const customerEmail = session.customer_email || session.customer_details?.email;
  const customerName = session.customer_details?.name || 'Member';

  if (!customerEmail) {
    console.error('No customer email found in session');
    return;
  }

  // Get line items to see what they purchased
  let productNames = 'Biblical Man Hub Access';
  try {
    const lineItems = await stripe.checkout.sessions.listLineItems(session.id);
    if (lineItems.data.length > 0) {
      productNames = lineItems.data.map(item => item.description).join(', ');
    }
  } catch (error) {
    console.error('⚠️ Failed to fetch line items (check STRIPE_SECRET_KEY):', error);
    // Continue anyway so the user gets their email
  }

  console.log(`📧 Sending welcome email to: ${customerEmail}`);
  console.log(`🛒 Products purchased: ${productNames}`);

  // Send welcome email with login instructions
  await sendMemberWelcomeEmail({
    email: customerEmail,
    name: customerName,
    products: productNames,
    amountPaid: session.amount_total ? session.amount_total / 100 : 0,
    currency: session.currency || 'usd',
  });

  // Optional: Store in your database
  try {
    await storeMemberInDatabase({
      email: customerEmail,
      name: customerName,
      stripeCustomerId: session.customer as string,
      sessionId: session.id,
      products: productNames,
    });
  } catch (dbError) {
    console.error('❌ Failed to store member in database:', dbError);
    // Don't throw here, we still want to return 200 to Stripe if email worked
  }
}

async function handlePaymentIntentSucceeded(paymentIntent: Stripe.PaymentIntent) {
  console.log('💳 Payment succeeded:', paymentIntent.id);
  // Handle one-time payment success
  // You can extract customer email from receipt_email or customer object
}

async function handleSubscriptionChange(subscription: Stripe.Subscription) {
  console.log('📅 Subscription changed:', subscription.id, 'Status:', subscription.status);

  try {
    // Import subscription module dynamically to avoid circular deps
    const { upsertSubscription, recordSubscriptionRevenue } = await import('@/lib/subscription');

    // Get customer email
    let customerEmail = '';
    if (typeof subscription.customer === 'string') {
      const customer = await stripe.customers.retrieve(subscription.customer);
      if ('email' in customer && customer.email) {
        customerEmail = customer.email;
      }
    }

    if (!customerEmail) {
      console.error('No customer email found for subscription:', subscription.id);
      return;
    }

    // Get the price/amount from the subscription
    const item = subscription.items.data[0];
    const amount = item?.price?.unit_amount || 1999;

    // Upsert subscription in our database
    const sub = await upsertSubscription({
      stripeCustomerId: subscription.customer as string,
      stripeSubscriptionId: subscription.id,
      stripePriceId: item?.price?.id || '',
      email: customerEmail,
      status: subscription.status,
      currentPeriodStart: new Date(subscription.current_period_start * 1000),
      currentPeriodEnd: new Date(subscription.current_period_end * 1000),
      cancelAtPeriodEnd: subscription.cancel_at_period_end,
      amount: amount,
    });

    if (sub) {
      console.log('✅ Subscription upserted:', sub.id, 'for', customerEmail);

      // If subscription just became active, send welcome email
      if (subscription.status === 'active' && !subscription.cancel_at_period_end) {
        await sendPremiumWelcomeEmail(customerEmail);
      }
    }
  } catch (error) {
    console.error('Error handling subscription change:', error);
  }
}

async function sendPremiumWelcomeEmail(email: string) {
  if (!resend) {
    console.warn('⚠️ Resend not configured for premium welcome email');
    return;
  }

  const fromEmail = process.env.EMAIL_FROM || 'adam@thebiblicalmantruth.com';
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://thebiblicalmantruth.com';

  try {
    await resend.emails.send({
      from: fromEmail,
      to: email,
      subject: '🔥 Welcome to Biblical Man Premium - Your Access Is Ready',
      html: `
        <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; padding: 40px 20px; background: #1a1a1a; color: #fff;">
          <h1 style="color: #dc2626; font-size: 32px; text-align: center; margin-bottom: 30px;">
            Welcome to the Inner Circle
          </h1>

          <p style="font-size: 18px; line-height: 1.8; color: #e5e5e5;">
            Brother,
          </p>

          <p style="font-size: 18px; line-height: 1.8; color: #e5e5e5;">
            Your Premium membership is now active. You've made a decision that separates you from 99% of Christian men who consume but never commit.
          </p>

          <div style="background: #2a2a2a; border-left: 4px solid #dc2626; padding: 25px; margin: 30px 0;">
            <h2 style="color: #dc2626; margin: 0 0 15px;">What You Now Have Access To:</h2>
            <ul style="color: #d4d4d4; font-size: 16px; line-height: 2;">
              <li>Daily AI-Generated Devotionals delivered to your inbox</li>
              <li>Premium 7-Day Bible Study Plans</li>
              <li>The Leadership Transformation Course</li>
              <li>Marriage Dominion Study Guide</li>
              <li>Priority Support & Community Access</li>
            </ul>
          </div>

          <div style="text-align: center; margin: 40px 0;">
            <a href="${siteUrl}/hub" style="display: inline-block; padding: 20px 50px; background: #dc2626; color: white; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 18px;">
              Access Your Premium Content
            </a>
          </div>

          <p style="font-size: 16px; line-height: 1.8; color: #e5e5e5;">
            Your first daily devotional will arrive tomorrow morning at 6 AM. Be ready.
          </p>

          <p style="font-size: 16px; line-height: 1.8; color: #e5e5e5;">
            Lead boldly,<br>
            <strong style="color: #dc2626;">Adam</strong><br>
            The Biblical Man
          </p>

          <hr style="margin: 40px 0; border: none; border-top: 1px solid #333;">

          <p style="font-size: 12px; color: #666; text-align: center;">
            Manage your subscription at ${siteUrl}/premium/dashboard<br>
            Questions? Reply to this email.
          </p>
        </div>
      `,
    });
    console.log('✅ Premium welcome email sent to:', email);
  } catch (error) {
    console.error('❌ Failed to send premium welcome email:', error);
  }
}

async function sendMemberWelcomeEmail(params: {
  email: string;
  name: string;
  products: string;
  amountPaid: number;
  currency: string;
}) {
  if (!resend) {
    console.warn('⚠️  Resend not configured. Would send email to:', params.email);
    return;
  }

  const fromEmail = process.env.EMAIL_FROM || 'adam@thebiblicalmantruth.com';
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://thebiblicalmantruth.com';

  try {
    await resend.emails.send({
      from: fromEmail,
      to: params.email,
      subject: '🔥 Welcome to The Biblical Man - Your Access Inside',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #dc2626; font-size: 32px; font-weight: bold; margin-bottom: 20px;">
            Welcome to The Brotherhood, ${params.name}
          </h1>

          <p style="font-size: 18px; line-height: 1.6; color: #333; margin-bottom: 20px;">
            Your payment of <strong>${params.amountPaid.toFixed(2)} ${params.currency.toUpperCase()}</strong> has been confirmed.
          </p>

          <div style="background: #fee2e2; border-left: 4px solid #dc2626; padding: 20px; margin: 30px 0;">
            <h2 style="margin-top: 0; color: #dc2626; font-size: 20px;">📦 What You Got:</h2>
            <p style="margin: 0; font-size: 16px; color: #333;">
              ${params.products}
            </p>
          </div>

          <h2 style="color: #dc2626; font-size: 24px; margin-top: 30px;">
            🚪 How to Access Your Content
          </h2>

          <ol style="font-size: 16px; line-height: 1.8; color: #333;">
            <li><strong>Visit:</strong> <a href="${siteUrl}" style="color: #dc2626; text-decoration: underline;">${siteUrl}</a></li>
            <li><strong>Login with this email:</strong> ${params.email}</li>
            <li><strong>Access your member dashboard</strong> to download your products, access exclusive content, and join the community</li>
          </ol>

          <div style="margin: 40px 0; text-align: center;">
            <a href="${siteUrl}" style="display: inline-block; padding: 18px 40px; background: #dc2626; color: white; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 18px;">
              🔓 Access The Hub Now
            </a>
          </div>

          <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 30px 0;">
            <h3 style="margin-top: 0; color: #dc2626; font-size: 18px;">💪 What's Next?</h3>
            <ul style="font-size: 15px; line-height: 1.8; color: #333; margin: 0;">
              <li>Download your products from the member area</li>
              <li>Join the private community discussions</li>
              <li>Access exclusive training and resources</li>
              <li>Get weekly insights delivered to your inbox</li>
            </ul>
          </div>

          <p style="font-size: 16px; line-height: 1.6; color: #333; margin: 20px 0;">
            Questions? Just hit reply to this email. I read every message.
          </p>

          <p style="font-size: 16px; line-height: 1.6; color: #333;">
            <strong>- Adam</strong><br>
            The Biblical Man
          </p>

          <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e5e5;">

          <p style="font-size: 12px; color: #666; text-align: center;">
            © ${new Date().getFullYear()} The Biblical Man. Built for men who lead.<br>
            Your receipt and login credentials were sent in this email.
          </p>
        </div>
      `,
    });

    console.log('✅ Welcome email sent successfully to:', params.email);
  } catch (error) {
    console.error('❌ Failed to send welcome email:', error);
    throw error;
  }
}

async function storeMemberInDatabase(params: {
  email: string;
  name: string;
  stripeCustomerId: string;
  sessionId: string;
  products: string;
}) {
  console.log('📝 Storing member data for:', params.email);

  const success = await upgradeUserToMember(params.email, params.products);

  if (success) {
    console.log('✅ Member upgraded/created successfully in database');
  } else {
    console.error('❌ Failed to upgrade/create member in database');
  }
}
