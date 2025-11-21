import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';
import crypto from 'crypto';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-11-17.clover',
});

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const resend = new Resend(process.env.RESEND_API_KEY!);

function generateSecureToken(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let token = '';
  const bytes = crypto.randomBytes(32);

  for (let i = 0; i < 32; i++) {
    token += chars[bytes[i] % chars.length];
  }

  return token;
}

async function sendSetupEmail(email: string, setupToken: string) {
  const fromEmail = process.env.EMAIL_FROM || 'adam@thebiblicalmantruth.com';
  const setupUrl = `${process.env.NEXT_PUBLIC_SITE_URL || 'https://thebiblicalmantruth.com'}/member/setup?token=${setupToken}`;

  try {
    await resend.emails.send({
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
    return true;
  } catch (error) {
    console.error('Failed to send setup email:', error);
    return false;
  }
}

async function processPayment(paymentIntent: Stripe.PaymentIntent) {
  const paymentId = paymentIntent.id;

  // Check if we already processed this payment
  const { data: existing } = await supabase
    .from('pending_members')
    .select('id')
    .eq('stripe_payment_intent_id', paymentId)
    .single();

  if (existing) {
    console.log('⏭️  Payment already processed:', paymentId);
    return;
  }

  // Get customer email
  let email: string | null = null;
  const customerId = paymentIntent.customer as string;

  if (customerId) {
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
    console.log('⚠️  No email found for payment:', paymentId);
    return;
  }

  // Generate setup token
  const setupToken = generateSecureToken();

  // Create pending member
  const { error } = await supabase
    .from('pending_members')
    .insert({
      email,
      stripe_customer_id: customerId || 'unknown',
      stripe_payment_intent_id: paymentId,
      payment_amount: paymentIntent.amount,
      setup_token: setupToken,
    });

  if (error) {
    console.error('Failed to create pending member:', error);
    return;
  }

  console.log('✅ Created pending member for:', email);

  // Send setup email
  await sendSetupEmail(email, setupToken);
}

async function main() {
  console.log('🔍 Checking for recent Stripe payments...\n');

  // Get payments from the last 7 days
  const sevenDaysAgo = Math.floor(Date.now() / 1000) - (7 * 24 * 60 * 60);

  const paymentIntents = await stripe.paymentIntents.list({
    limit: 100,
    created: { gte: sevenDaysAgo },
  });

  const successfulPayments = paymentIntents.data.filter(
    pi => pi.status === 'succeeded'
  );

  console.log(`Found ${successfulPayments.length} successful payments in the last 7 days\n`);

  for (const payment of successfulPayments) {
    await processPayment(payment);
  }

  console.log('\n✅ Done processing payments');
}

main().catch(console.error);
