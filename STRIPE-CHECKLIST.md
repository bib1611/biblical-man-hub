# ✅ Stripe Webhook Setup Checklist

Follow this checklist step-by-step to get your webhook running!

---

## 🎯 Phase 1: Get Your Stripe Account Ready

- [ ] **Sign up for Stripe** (if you don't have an account)
  - Go to: https://dashboard.stripe.com/register
  
- [ ] **Get your API keys**
  - Go to: https://dashboard.stripe.com/apikeys
  - Copy your **Secret key** (starts with `sk_test_...`)
  - Save it somewhere secure

- [ ] **Install Stripe CLI** (for local testing)
  - macOS: `brew install stripe/stripe-cli/stripe`
  - Other OS: https://stripe.com/docs/stripe-cli

- [ ] **Login to Stripe CLI**
  ```bash
  stripe login
  ```

---

## 🎯 Phase 2: Configure Your Environment

- [ ] **Copy environment variables**
  - Open `env-stripe-template.txt`
  - Copy the contents to your `.env.local` file
  
- [ ] **Add your Stripe Secret Key**
  ```bash
  STRIPE_SECRET_KEY=sk_test_YOUR_ACTUAL_KEY_HERE
  ```

- [ ] **Verify Resend is configured** (you should already have these)
  ```bash
  RESEND_API_KEY=re_YOUR_KEY
  EMAIL_FROM=adam@biblicalman.com
  ```

- [ ] **Set your site URL**
  ```bash
  # For local testing:
  NEXT_PUBLIC_SITE_URL=http://localhost:3000
  
  # For production:
  NEXT_PUBLIC_SITE_URL=https://thebiblicalmantruth.com
  ```

---

## 🎯 Phase 3: Test Locally

- [ ] **Start your dev server**
  ```bash
  npm run dev
  ```

- [ ] **Start Stripe webhook forwarding** (in a new terminal)
  ```bash
  stripe listen --forward-to localhost:3000/api/webhooks/stripe
  ```

- [ ] **Copy the webhook secret**
  - Look for output like: `whsec_xxxxxxxxxx`
  - Add to `.env.local`:
    ```bash
    STRIPE_WEBHOOK_SECRET=whsec_YOUR_SECRET_HERE
    ```

- [ ] **Restart your dev server**
  - Stop the dev server (Ctrl+C)
  - Start it again: `npm run dev`

- [ ] **Test the webhook**
  ```bash
  stripe trigger checkout.session.completed
  ```

- [ ] **Verify it works**
  - [ ] Check terminal for webhook logs
  - [ ] Should see "✅ Webhook verified"
  - [ ] Should see "💰 Checkout session completed"
  - [ ] Should see "📧 Sending welcome email"

---

## 🎯 Phase 4: Create a Payment Link

- [ ] **Go to Stripe Dashboard**
  - Navigate to: **Products** → **Add Product**

- [ ] **Create your product**
  - **Name**: "Biblical Man Membership" (or whatever you want)
  - **Price**: Set your price (e.g., $49)
  - **Type**: One-time or Recurring
  - Click **Create product**

- [ ] **Create payment link**
  - Click **Create payment link** on the product page
  - ✅ **Enable**: "Collect customer email addresses"
  - ✅ **Enable** (optional): "Collect billing address"
  - Click **Create link**

- [ ] **Copy the payment link**
  - Save it: `https://buy.stripe.com/test_xxxxxxxx`

---

## 🎯 Phase 5: Test With Real Payment

- [ ] **Open your payment link** in a browser

- [ ] **Complete checkout with test card**
  - Card number: `4242 4242 4242 4242`
  - Expiry: Any future date (e.g., `12/25`)
  - CVC: Any 3 digits (e.g., `123`)
  - ZIP: Any 5 digits (e.g., `12345`)
  - Email: Use your real email

- [ ] **Verify webhook received**
  - [ ] Check terminal running `stripe listen`
  - [ ] Should see webhook event logged
  - [ ] Check terminal running `npm run dev`
  - [ ] Should see detailed processing logs

- [ ] **Check your email**
  - [ ] Should receive welcome email
  - [ ] Email should have your purchase details
  - [ ] Email should have login instructions

---

## 🎯 Phase 6: Deploy to Production

- [ ] **Deploy your site**
  - Push to GitHub
  - Deploy via Vercel/Netlify/your hosting

- [ ] **Add environment variables to production**
  - Go to your hosting dashboard (e.g., Vercel Dashboard)
  - Navigate to: Settings → Environment Variables
  - Add:
    - `STRIPE_SECRET_KEY` (use your LIVE key: `sk_live_...`)
    - `RESEND_API_KEY`
    - `EMAIL_FROM`
    - `NEXT_PUBLIC_SITE_URL`
  - Don't add `STRIPE_WEBHOOK_SECRET` yet (we'll get it next)

- [ ] **Create production webhook in Stripe**
  - Go to: https://dashboard.stripe.com/webhooks
  - Click **Add endpoint**
  - Endpoint URL: `https://thebiblicalmantruth.com/api/webhooks/stripe`
  - Select events to listen to:
    - ✅ `checkout.session.completed`
    - ✅ `payment_intent.succeeded`
    - ✅ `customer.subscription.created`
    - ✅ `customer.subscription.updated`
  - Click **Add endpoint**

- [ ] **Get production webhook secret**
  - Click on the webhook you just created
  - Click **Reveal** next to "Signing secret"
  - Copy the secret (starts with `whsec_...`)

- [ ] **Add webhook secret to production**
  - Go back to your hosting dashboard
  - Add environment variable:
    - `STRIPE_WEBHOOK_SECRET=whsec_YOUR_PRODUCTION_SECRET`

- [ ] **Redeploy if needed**
  - Some platforms require redeployment after adding env vars

---

## 🎯 Phase 7: Test Production

- [ ] **Switch Stripe to test mode** (for final test)
  - In Stripe Dashboard, toggle to "Test mode"

- [ ] **Create a test payment link** (if you haven't already)

- [ ] **Make a test purchase**
  - Use test card: `4242 4242 4242 4242`
  - Check your email

- [ ] **Verify webhook works in production**
  - Check Stripe Dashboard → Webhooks
  - Click on your webhook
  - View "Recent deliveries"
  - Should see successful deliveries

---

## 🎯 Phase 8: Go Live! 🚀

- [ ] **Switch Stripe to live mode**
  - In Stripe Dashboard, toggle off "Test mode"

- [ ] **Update to live API keys**
  - Get your live secret key: `sk_live_...`
  - Update production env var: `STRIPE_SECRET_KEY`

- [ ] **Create your real product**
  - Products → Add Product
  - Set real pricing

- [ ] **Create live payment link**
  - ✅ Enable email collection
  - Copy the live link

- [ ] **Share your payment link!**
  - Add to your website
  - Share on social media
  - Include in emails
  - Start collecting members! 🎉

---

## 🎯 Optional: Enhance Your Setup

- [ ] **Add database storage**
  - Uncomment database code in webhook handler
  - Store member data in Supabase/PostgreSQL

- [ ] **Create members area**
  - Build a protected `/members` page
  - Show purchased products
  - Provide downloads/content access

- [ ] **Add member login**
  - Implement NextAuth or similar
  - Let members log in with email

- [ ] **Set up email sequences**
  - Use email automation platform
  - Send follow-up emails
  - Nurture new members

---

## 📊 Monitoring & Maintenance

- [ ] **Check webhook health regularly**
  - Stripe Dashboard → Developers → Webhooks
  - Monitor "Recent deliveries"
  - Fix any failing webhooks

- [ ] **Monitor email delivery**
  - Resend Dashboard
  - Check delivery rates
  - Review bounce/complaint rates

- [ ] **Test periodically**
  - Make test purchases monthly
  - Verify email still sends
  - Check all links work

---

## 🆘 Troubleshooting

If something doesn't work, check:

- [ ] All environment variables are set correctly
- [ ] Webhook secret matches (local vs production)
- [ ] Email domain is verified in Resend
- [ ] Payment link has email collection enabled
- [ ] Webhook endpoint URL is correct
- [ ] Check terminal/logs for error messages

**Need more help?** See `STRIPE-WEBHOOK-SETUP.md` for detailed troubleshooting.

---

## ✅ Done!

Once all checkboxes are checked, you're ready to start collecting members! 🚀

**Questions?** Review these files:
- `STRIPE-IMPLEMENTATION-SUMMARY.md` - Overview
- `STRIPE-WEBHOOK-SETUP.md` - Detailed guide
- `STRIPE-WEBHOOK-README.md` - Quick reference

---

Made with 🔥 for The Biblical Man Hub
