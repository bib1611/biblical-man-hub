import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

function generateSecureToken(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let token = '';
  const bytes = crypto.randomBytes(32);

  for (let i = 0; i < 32; i++) {
    token += chars[bytes[i] % chars.length];
  }

  return token;
}

async function createManualSetupLink(email: string, paymentIntentId: string) {
  const setupToken = generateSecureToken();

  const { error } = await supabase
    .from('pending_members')
    .insert({
      email,
      stripe_customer_id: 'manual',
      stripe_payment_intent_id: paymentIntentId,
      payment_amount: 300,
      setup_token: setupToken,
    });

  if (error) {
    console.error('Error creating pending member:', error);
    return;
  }

  const setupUrl = `https://thebiblicalmantruth.com/member/setup?token=${setupToken}`;
  console.log('\n✅ Setup link created!');
  console.log('Email:', email);
  console.log('Setup URL:', setupUrl);
  console.log('\nSend this link to the customer to complete account setup.\n');
}

// Run it
const email = process.argv[2];
const paymentId = process.argv[3] || 'manual_' + Date.now();

if (!email) {
  console.log('Usage: npx tsx scripts/manual-setup-link.ts <email> [payment_id]');
  console.log('Example: npx tsx scripts/manual-setup-link.ts arevx1611@gmail.com pi_123abc');
  process.exit(1);
}

createManualSetupLink(email, paymentId);
