import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-11-17.clover',
});

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

/**
 * Stripe Webhook Handler
 * Listens for successful payments and creates pending member accounts
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get('stripe-signature');

    if (!signature) {
      return NextResponse.json({ error: 'No signature' }, { status: 400 });
    }

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(
        body,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET!
      );
    } catch (err) {
      console.error('Webhook signature verification failed:', err);
      return NextResponse.json(
        { error: 'Webhook signature verification failed' },
        { status: 400 }
      );
    }

    // Handle the event
    switch (event.type) {
      case 'payment_intent.succeeded':
        await handlePaymentSuccess(event.data.object as Stripe.PaymentIntent);
        break;

      case 'charge.succeeded':
        // Backup event in case payment_intent.succeeded doesn't fire
        console.log('Charge succeeded:', event.data.object.id);
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Error handling webhook:', error);
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    );
  }
}

async function handlePaymentSuccess(paymentIntent: Stripe.PaymentIntent) {
  console.log('💰 Payment succeeded:', paymentIntent.id);

  let email = paymentIntent.receipt_email || paymentIntent.metadata?.email;
  const customerId = paymentIntent.customer as string;
  const amount = paymentIntent.amount;

  // If no email found, try to get it from the customer object
  if (!email && customerId) {
    try {
      const customer = await stripe.customers.retrieve(customerId);
      if ('email' in customer && customer.email) {
        email = customer.email;
      }
    } catch (error) {
      console.error('Failed to retrieve customer:', error);
    }
  }

  if (!email) {
    console.error('No email found in payment intent or customer');
    return;
  }

  // Generate unique setup token
  const setupToken = generateSecureToken();

  // Create pending member record
  const { error: dbError } = await supabase
    .from('pending_members')
    .insert({
      email,
      stripe_customer_id: customerId,
      stripe_payment_intent_id: paymentIntent.id,
      payment_amount: amount,
      setup_token: setupToken,
    });

  if (dbError) {
    console.error('Failed to create pending member:', dbError);
    return;
  }

  console.log('✅ Created pending member for:', email);

  // Send setup email
  if (resend) {
    await sendSetupEmail(email, setupToken);
  }
}

async function sendSetupEmail(email: string, setupToken: string) {
  const fromEmail = process.env.EMAIL_FROM || 'adam@thebiblicalmantruth.com';
  const setupUrl = `${process.env.NEXT_PUBLIC_SITE_URL || 'https://thebiblicalmantruth.com'}/member/setup?token=${setupToken}`;

  try {
    await resend!.emails.send({
      from: fromEmail,
      to: email,
      subject: 'Welcome to The Biblical Man - Complete Your Account Setup',
      html: `
        <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; color: #1a1a1a; line-height: 1.7;">
          <h1 style="color: #dc2626; font-size: 32px; font-weight: bold;">Payment Confirmed!</h1>

          <p style="font-size: 18px;">Brother,</p>

          <p style="font-size: 16px;">
            Your payment has been processed successfully. Welcome to The Biblical Man member hub.
          </p>

          <p style="font-size: 16px;">
            <strong>Next step:</strong> Create your login credentials to access all member content.
          </p>

          <div style="margin: 40px 0; text-align: center;">
            <a href="${setupUrl}" style="display: inline-block; padding: 20px 40px; background: #dc2626; color: white; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 18px;">
              Complete Account Setup →
            </a>
          </div>

          <p style="font-size: 16px;">
            This link expires in 7 days. Don't wait.
          </p>

          <div style="margin: 30px 0; padding: 20px; background: #fee2e2; border-left: 4px solid #dc2626;">
            <p style="margin: 0; font-size: 16px; color: #333;">
              <strong>What you get:</strong>
            </p>
            <ul style="margin: 10px 0; padding-left: 20px; font-size: 16px; color: #333;">
              <li>Full access to The War Room (KJV Bible study)</li>
              <li>King's Radio (24/7 teaching)</li>
              <li>Intel Articles (tactical guides)</li>
              <li>The Armory (all resources)</li>
              <li>Member-only content</li>
            </ul>
          </div>

          <p style="font-size: 16px;">
            Questions? Hit reply.
          </p>

          <p style="font-size: 16px;">
            Lead boldly,<br>
            <strong>Adam</strong><br>
            The Biblical Man
          </p>

          <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e5e5;">
          <p style="font-size: 12px; color: #666; text-align: center;">
            The Biblical Man • Member Access
          </p>
        </div>
      `,
    });

    console.log('✅ Setup email sent to:', email);
  } catch (error) {
    console.error('Failed to send setup email:', error);
  }
}

function generateSecureToken(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let token = '';
  const crypto = require('crypto');
  const bytes = crypto.randomBytes(32);

  for (let i = 0; i < 32; i++) {
    token += chars[bytes[i] % chars.length];
  }

  return token;
}
