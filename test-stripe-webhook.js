#!/usr/bin/env node

/**
 * Quick test script to verify Stripe webhook setup
 * Run: node test-stripe-webhook.js
 */

console.log('🔍 Checking Stripe Webhook Configuration...\n');

// Check environment variables
const requiredEnvVars = [
    'STRIPE_SECRET_KEY',
    'STRIPE_WEBHOOK_SECRET',
    'RESEND_API_KEY',
    'EMAIL_FROM',
    'NEXT_PUBLIC_SITE_URL'
];

let hasAllVars = true;

requiredEnvVars.forEach(varName => {
    const value = process.env[varName];
    const status = value ? '✅' : '❌';
    console.log(`${status} ${varName}: ${value ? '(set)' : '(MISSING)'}`);
    if (!value) hasAllVars = false;
});

console.log('\n📋 Summary:');
if (hasAllVars) {
    console.log('✅ All required environment variables are set!');
    console.log('\n📚 Next Steps:');
    console.log('1. Start your dev server: npm run dev');
    console.log('2. In another terminal, run: stripe listen --forward-to localhost:3000/api/webhooks/stripe');
    console.log('3. Test with: stripe trigger checkout.session.completed');
    console.log('4. Or use your Stripe payment link with test card: 4242 4242 4242 4242');
} else {
    console.log('❌ Some environment variables are missing.');
    console.log('\n📝 Action Required:');
    console.log('Add the missing variables to your .env.local file');
    console.log('See STRIPE-WEBHOOK-SETUP.md for detailed instructions');
}

console.log('\n📖 Full setup guide: STRIPE-WEBHOOK-SETUP.md\n');
