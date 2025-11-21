# 🔥 Stripe Webhook Setup Guide
## Collect Member Signups & Send Login Instructions

This guide will help you set up a **Stripe webhook** to automatically capture member signups via Stripe payment links and send them instructional emails.

---

## 📋 What You Need

1. **Stripe Account** - [Sign up here](https://dashboard.stripe.com/register)
2. **Resend Account** - Already configured in your project
3. **Your Stripe Secret Key** and **Webhook Secret**

---

## 🚀 Step-by-Step Setup

### 1️⃣ Get Your Stripe API Keys

1. Go to [Stripe Dashboard](https://dashboard.stripe.com)
2. Click **Developers** → **API keys**
3. Copy your **Secret key** (starts with `sk_test_...` for test mode)
4. Add it to your `.env.local` file:

```bash
STRIPE_SECRET_KEY=sk_test_your_actual_key_here
```

---

### 2️⃣ Create a Payment Link in Stripe

1. In Stripe Dashboard, go to **Products** → **Add Product**
2. Create your membership product:
   - **Name**: "Biblical Man Membership" (or whatever you want)
   - **Price**: Set your price
   - **Payment type**: One-time or Recurring
3. Click **Create product**
4. Click **Create payment link** on the product page
5. **IMPORTANT**: In the payment link settings:
   - ✅ Enable "Collect customer email addresses"
   - ✅ Enable "Collect customer billing address" (optional)
6. Copy the payment link (e.g., `https://buy.stripe.com/test_xxxxx`)

---

### 3️⃣ Set Up the Webhook (LOCAL TESTING)

For **local testing**, you'll use the Stripe CLI:

1. **Install Stripe CLI**:
   ```bash
   # On macOS
   brew install stripe/stripe-cli/stripe
   ```

2. **Login to Stripe**:
   ```bash
   stripe login
   ```

3. **Start your Next.js dev server**:
   ```bash
   npm run dev
   ```

4. **Forward webhooks to your local server** (in a new terminal):
   ```bash
   stripe listen --forward-to localhost:3000/api/webhooks/stripe
   ```

5. **Copy the webhook signing secret** from the output (starts with `whsec_...`)
6. Add it to your `.env.local`:
   ```bash
   STRIPE_WEBHOOK_SECRET=whsec_your_secret_from_stripe_cli
   ```

7. **Test it!** Make a test purchase using your Stripe payment link

---

### 4️⃣ Set Up the Webhook (PRODUCTION)

Once you deploy to production (Vercel, Netlify, etc.):

1. Go to [Stripe Dashboard](https://dashboard.stripe.com) → **Developers** → **Webhooks**
2. Click **Add endpoint**
3. Enter your webhook URL:
   ```
   https://thebiblicalmantruth.com/api/webhooks/stripe
   ```
4. Select events to listen for:
   - ✅ `checkout.session.completed`
   - ✅ `payment_intent.succeeded`
   - ✅ `customer.subscription.created`
   - ✅ `customer.subscription.updated`
5. Click **Add endpoint**
6. Click on the newly created webhook
7. Reveal the **Signing secret** (starts with `whsec_...`)
8. Add it to your production environment variables:
   - **Vercel**: Dashboard → Settings → Environment Variables
   - **Netlify**: Site settings → Environment variables

---

### 5️⃣ Configure Your Environment Variables

Make sure your `.env.local` has these values:

```bash
# Email service (Resend) - You already have this
RESEND_API_KEY=re_your_resend_key
EMAIL_FROM=adam@biblicalman.com

# Stripe
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret

# Your website URL (for login links)
NEXT_PUBLIC_SITE_URL=https://thebiblicalmantruth.com
```

---

## 🧪 Testing Your Setup

### Test the webhook locally:

1. Start your dev server: `npm run dev`
2. Start Stripe CLI forwarding: `stripe listen --forward-to localhost:3000/api/webhooks/stripe`
3. Trigger a test event:
   ```bash
   stripe trigger checkout.session.completed
   ```
4. Check your terminal - you should see:
   - ✅ Webhook verified
   - 💰 Checkout session completed
   - 📧 Sending welcome email

### Test with a real payment link:

1. Use your Stripe payment link (the test one)
2. Use test card: `4242 4242 4242 4242`
3. Any future expiry date, any CVC
4. Complete the checkout
5. Check:
   - Your terminal logs
   - The customer's email inbox for the welcome email

---

## 📧 What Happens When Someone Buys

1. **Customer completes checkout** via your Stripe payment link
2. **Stripe sends webhook** to your endpoint
3. **Your webhook handler**:
   - ✅ Verifies the webhook signature (for security)
   - ✅ Extracts customer email and purchase details
   - ✅ Sends a beautiful welcome email with login instructions
   - ✅ (Optional) Stores member data in your database

4. **Customer receives email** with:
   - Purchase confirmation
   - Products they bought
   - Login instructions
   - Link to access the hub

---

## 🎯 Next Steps

### 1. Create a Members Area (Optional)

You might want to create a simple members-only page:

```typescript
// app/members/page.tsx
export default function MembersPage() {
  return (
    <div>
      <h1>Welcome, Member!</h1>
      <p>Download your products here...</p>
    </div>
  );
}
```

### 2. Store Member Data in Database

Uncomment the database code in `storeMemberInDatabase()` function in the webhook handler. You can use:
- **Supabase** (you already have it set up)
- **Vercel Postgres**
- Any other database

### 3. Create Member Login System

Use NextAuth or similar to let members log in with their email.

---

## 🚨 Common Issues & Solutions

### "Webhook signature verification failed"

- ✅ Make sure `STRIPE_WEBHOOK_SECRET` is set correctly
- ✅ In production, use the secret from Stripe Dashboard (not CLI)
- ✅ In local dev, use the secret from `stripe listen` output

### "No customer email found"

- ✅ Make sure "Collect customer email" is enabled in your payment link settings
- ✅ Check Stripe Dashboard → The specific checkout session to see if email was collected

### Email not sending

- ✅ Verify `RESEND_API_KEY` is valid
- ✅ Check `EMAIL_FROM` is a verified domain in Resend
- ✅ Check terminal logs for error messages

### Webhook not receiving events

- ✅ In local dev: Make sure `stripe listen` is running
- ✅ In production: Verify webhook URL is correct in Stripe Dashboard
- ✅ Check that events are selected in webhook settings

---

## 📚 Resources

- [Stripe Webhooks Documentation](https://stripe.com/docs/webhooks)
- [Stripe CLI Documentation](https://stripe.com/docs/stripe-cli)
- [Resend Documentation](https://resend.com/docs)
- [Payment Links Guide](https://stripe.com/docs/payment-links)

---

## 🔐 Security Notes

1. **Always verify webhook signatures** - The code already does this
2. **Never expose your secret keys** - Keep them in `.env.local` (gitignored)
3. **Use environment variables** - Never hardcode keys in your code
4. **Test in test mode first** - Use `sk_test_...` keys before going live

---

## ✅ You're Ready!

Your webhook is now set up to:
- ✅ Capture member signups from Stripe
- ✅ Send beautiful welcome emails with login instructions
- ✅ Handle payment events securely

**Share your Stripe payment link** and start collecting members! 🚀

Questions? Check the troubleshooting section above or review the webhook logs.
