# 🎯 Stripe Webhook - Quick Start

## What Was Added

I've set up a complete **Stripe webhook system** to collect member signups and send automated login instructions. Here's what's ready for you:

### 📁 New Files Created

1. **`app/api/webhooks/stripe/route.ts`** - Webhook endpoint that:
   - Receives payment events from Stripe
   - Verifies webhook signatures for security
   - Extracts customer email and purchase details
   - Sends beautiful welcome emails with login instructions
   - Has placeholder for database storage

2. **`STRIPE-WEBHOOK-SETUP.md`** - Complete setup guide with:
   - Step-by-step instructions
   - Local testing with Stripe CLI
   - Production deployment guide
   - Troubleshooting section

3. **`test-stripe-webhook.js`** - Quick test script to verify your environment variables

### 🔧 Configuration Updated

- **`.env.example`** - Added Stripe configuration placeholders
- **`package.json`** - Added `stripe` npm package

---

## 🚀 Quick Start (3 Steps)

### Step 1: Add Your API Keys

Create/update your `.env.local` file with:

```bash
# Stripe (get from https://dashboard.stripe.com/apikeys)
STRIPE_SECRET_KEY=sk_test_your_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_secret_here

# Email (you already have this)
RESEND_API_KEY=re_your_resend_key
EMAIL_FROM=adam@biblicalman.com

# Site URL
NEXT_PUBLIC_SITE_URL=https://thebiblicalmantruth.com
```

### Step 2: Test Locally

```bash
# Terminal 1: Start dev server
npm run dev

# Terminal 2: Forward Stripe webhooks (requires Stripe CLI)
stripe listen --forward-to localhost:3000/api/webhooks/stripe

# Copy the webhook secret from the output and add to .env.local
```

### Step 3: Create Payment Link

1. Go to [Stripe Dashboard](https://dashboard.stripe.com)
2. Create a product (Products → Add Product)
3. Create a payment link
4. ✅ **Enable "Collect customer email addresses"**
5. Share the link!

---

## 💡 What Happens When Someone Buys

1. Customer completes purchase via your Stripe link
2. Stripe sends webhook to your endpoint
3. Your webhook:
   - ✅ Verifies it's really from Stripe
   - ✅ Gets customer email + purchase details
   - ✅ Sends welcome email with login instructions
   - ✅ Logs member data (can be saved to database)
4. Customer receives beautiful email with access instructions

---

## 📧 Email Template Preview

Your customers will receive an email with:

- **Welcome message** with their name
- **Purchase confirmation** with amount paid
- **Products purchased** listed clearly
- **Login instructions** with direct link
- **Next steps** for accessing content
- **Your branding** (Biblical Man theme)

---

## 🔍 Testing Your Setup

Run this quick check:

```bash
node test-stripe-webhook.js
```

This verifies all your environment variables are set correctly.

---

## 📚 Full Documentation

For detailed setup, troubleshooting, and production deployment:

👉 **Read `STRIPE-WEBHOOK-SETUP.md`**

---

## 🚨 Common Issues

### "Webhook signature verification failed"
- Make sure `STRIPE_WEBHOOK_SECRET` matches the one from Stripe CLI or Dashboard

### "No customer email found"
- Enable "Collect customer email" in your payment link settings

### Email not sending
- Verify your `RESEND_API_KEY` and `EMAIL_FROM` are correct
- Check that `EMAIL_FROM` domain is verified in Resend

---

## ✅ What's Ready

- ✅ Webhook endpoint created
- ✅ Email template designed
- ✅ Security verification implemented
- ✅ Error handling in place
- ✅ Logging for debugging
- ✅ Documentation complete

## 🎯 What You Need To Do

1. Add your Stripe API keys to `.env.local`
2. Create a payment link in Stripe
3. Enable email collection in payment link settings
4. Test with Stripe CLI locally
5. Deploy and update webhook URL in Stripe Dashboard

---

## 🔗 Resources

- [Stripe Dashboard](https://dashboard.stripe.com)
- [Stripe CLI Installation](https://stripe.com/docs/stripe-cli)
- [Resend Dashboard](https://resend.com)
- Full guide: `STRIPE-WEBHOOK-SETUP.md`

---

**Questions?** Check the troubleshooting section in `STRIPE-WEBHOOK-SETUP.md` or review the webhook code in `app/api/webhooks/stripe/route.ts`.

Ready to start collecting members! 🚀
