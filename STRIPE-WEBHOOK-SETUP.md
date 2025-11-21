# Stripe Webhook Setup Guide
## Complete Step-by-Step Instructions

This guide will help you set up Stripe to automatically send customers to the account setup page after they pay $3.

---

## Overview: What Will Happen After Setup

1. Customer pays $3 through your Stripe link
2. Stripe sends a webhook notification to your website
3. Your website creates a setup link and emails it to the customer
4. Customer clicks the link and creates their password
5. Customer is logged in and redirected to the member hub

---

## PART 1: Create the Webhook in Stripe

### Step 1: Log into Stripe
1. Go to: **https://dashboard.stripe.com/**
2. Log in with your Stripe account
3. Make sure you're in **TEST MODE** (toggle at top right should say "Test mode")
   - We'll test everything first, then switch to live mode later

### Step 2: Navigate to Webhooks
1. On the left sidebar, click **"Developers"**
2. Click **"Webhooks"** in the submenu
3. You'll see a page that says "Webhooks" at the top

### Step 3: Add Your Webhook Endpoint
1. Click the blue **"Add endpoint"** button (top right)
2. You'll see a form with fields to fill out:

   **Endpoint URL field:**
   ```
   https://thebiblicalmantruth.com/api/webhooks/stripe
   ```

   **Description (optional):**
   ```
   Biblical Man Hub - Payment Notifications
   ```

3. Leave "API Version" as default

### Step 4: Select Which Events to Listen For
1. Scroll down to **"Select events to listen to"**
2. Click the **"Select events"** button
3. In the search box that appears, type: **payment_intent.succeeded**
4. Check the box next to **"payment_intent.succeeded"**
5. Click **"Add events"** button at the bottom

### Step 5: Save the Webhook
1. Scroll to the bottom of the page
2. Click the blue **"Add endpoint"** button
3. You'll be taken to the webhook details page

### Step 6: Get Your Webhook Signing Secret (VERY IMPORTANT)
1. On the webhook details page, look for a section called **"Signing secret"**
2. Click **"Reveal"** or **"Click to reveal"**
3. You'll see a long string that starts with **`whsec_`**
4. Click the **copy icon** to copy this secret
5. **SAVE THIS SOMEWHERE SAFE** - you'll need it in Part 2

Example of what it looks like:
```
whsec_1234567890abcdefghijklmnopqrstuvwxyz
```

---

## PART 2: Configure Environment Variables in Vercel

### Step 1: Get Your Stripe Secret Key
1. In Stripe Dashboard, click **"Developers"** (left sidebar)
2. Click **"API keys"**
3. Look for **"Secret key"** (it's hidden by default)
4. Click **"Reveal test key"**
5. Copy the key (starts with `sk_test_`)
6. **SAVE THIS SOMEWHERE SAFE**

### Step 2: Log into Vercel
1. Go to: **https://vercel.com/dashboard**
2. Find and click on your **biblical-man-hub** project

### Step 3: Add Environment Variables
1. Click **"Settings"** (top navigation)
2. Click **"Environment Variables"** (left sidebar)
3. You'll see a form to add variables

### Step 4: Add STRIPE_SECRET_KEY
1. In the **"Key"** field, type exactly:
   ```
   STRIPE_SECRET_KEY
   ```

2. In the **"Value"** field, paste your Stripe secret key from Step 1
   (the one that starts with `sk_test_`)

3. Leave "Environment" checkboxes as default (all checked)
4. Click **"Save"**

### Step 5: Add STRIPE_WEBHOOK_SECRET
1. Click **"Add Another"** to add a new variable
2. In the **"Key"** field, type exactly:
   ```
   STRIPE_WEBHOOK_SECRET
   ```

3. In the **"Value"** field, paste the webhook signing secret from Part 1, Step 6
   (the one that starts with `whsec_`)

4. Click **"Save"**

### Step 6: Add CRON_SECRET
1. Click **"Add Another"** to add a new variable
2. In the **"Key"** field, type exactly:
   ```
   CRON_SECRET
   ```

3. In the **"Value"** field, generate a random secure string:
   - Go to: https://www.uuidgenerator.net/
   - Copy the generated UUID
   - Paste it in the Value field

4. Click **"Save"**

### Step 7: Verify Existing Email Variables
Make sure these are already set (from previous setup):
- **RESEND_API_KEY** - your Resend API key
- **EMAIL_FROM** - should be: adam@biblicalman.com
- **NEXT_PUBLIC_SUPABASE_URL** - your Supabase URL
- **SUPABASE_SERVICE_ROLE_KEY** - your Supabase service role key

If any are missing, add them now.

### Step 8: Redeploy
1. After saving all environment variables, Vercel will show a message about redeploying
2. Click **"Redeploy"** or go to **"Deployments"** tab
3. Click the **"..."** menu on the latest deployment
4. Click **"Redeploy"**
5. Wait for the deployment to complete (usually 1-2 minutes)

---

## PART 3: Set Up Database Tables in Supabase

### Step 1: Log into Supabase
1. Go to: **https://supabase.com/dashboard**
2. Select your Biblical Man project

### Step 2: Create Members Tables
1. Click **"SQL Editor"** (left sidebar)
2. Click **"New query"**
3. Copy the entire contents of this file: `lib/db/members-schema.sql`
4. Paste it into the SQL editor
5. Click **"Run"** (or press Cmd/Ctrl + Enter)
6. You should see "Success. No rows returned"

### Step 3: Verify Tables Were Created
1. Click **"Table Editor"** (left sidebar)
2. You should now see three new tables:
   - **members** - stores member accounts
   - **pending_members** - stores payments awaiting setup
   - **member_sessions** - stores login sessions

If you don't see them, go back to Step 2 and try again.

---

## PART 4: Test the Complete Flow

### Step 1: Make a Test Payment
1. Go to your payment link: https://buy.stripe.com/3cIaEYgbC1uh5I45VIcMM26
2. Enter a test email (use a real email you can check)
3. Use Stripe's test card number:
   ```
   Card: 4242 4242 4242 4242
   Expiry: Any future date (e.g., 12/25)
   CVC: Any 3 digits (e.g., 123)
   ZIP: Any 5 digits (e.g., 12345)
   ```
4. Click **"Pay"**

### Step 2: Check Webhook Was Received
1. Go back to Stripe Dashboard → Developers → Webhooks
2. Click on your webhook
3. Scroll down to **"Events"** section
4. You should see a recent event with status "Succeeded" (green checkmark)
5. Click on the event to see details
6. If you see "Failed" (red X), click it to see the error message

### Step 3: Check Your Email
1. Check the email inbox you used for the test payment
2. You should receive an email with subject: "Complete Your Biblical Man Hub Account Setup"
3. The email will have a link like: `https://thebiblicalmantruth.com/member/setup?token=...`

### Step 4: Create Your Account
1. Click the setup link in the email
2. You'll see a setup page with your email already filled in
3. Enter a password (at least 8 characters)
4. Confirm your password
5. Click **"Create Account"**
6. You should be automatically logged in and redirected to the member hub

### Step 5: Test Login
1. Log out (click the Logout button in the member hub)
2. Go to: https://thebiblicalmantruth.com/member/login
3. Enter your email and password
4. Click **"Login"**
5. You should be logged in and see the member hub

---

## PART 5: Troubleshooting

### If You Don't See the Webhook Event in Stripe:
- Make sure the webhook URL is exactly: `https://thebiblicalmantruth.com/api/webhooks/stripe`
- Check that you selected the `payment_intent.succeeded` event
- Verify the webhook is enabled (not paused)

### If the Webhook Shows "Failed" in Stripe:
1. Click on the failed event to see the error
2. Common issues:
   - **401 Unauthorized**: Check that STRIPE_WEBHOOK_SECRET is set correctly in Vercel
   - **500 Server Error**: Check Vercel deployment logs for the error
   - **Database Error**: Make sure you ran the members-schema.sql in Supabase

### If You Don't Receive the Email:
- Check that RESEND_API_KEY is set in Vercel
- Check that EMAIL_FROM is set to: adam@biblicalman.com
- Verify your domain is verified in Resend
- Check spam/junk folder
- Check Vercel deployment logs for email errors

### If the Setup Link Doesn't Work:
- Make sure you ran the members-schema.sql in Supabase
- Check that NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set in Vercel
- The link expires after 7 days - make sure it's not expired

### To View Logs in Vercel:
1. Go to Vercel Dashboard
2. Click on your project
3. Click **"Deployments"** tab
4. Click on the latest deployment
5. Click **"Functions"** tab
6. Look for errors in the logs

---

## PART 6: Go Live (After Testing Works)

### Step 1: Switch Stripe to Live Mode
1. In Stripe Dashboard, toggle from **"Test mode"** to **"Live mode"** (top right)
2. Go to Developers → Webhooks
3. Add the same webhook endpoint (repeat Part 1, Steps 3-6)
4. Copy the new **Live** webhook signing secret (starts with `whsec_`)

### Step 2: Update Vercel Environment Variables
1. In Vercel → Settings → Environment Variables
2. Edit **STRIPE_SECRET_KEY**:
   - Replace the test key with your **Live** secret key (starts with `sk_live_`)
   - Get it from Stripe → Developers → API keys → "Reveal live key"
3. Edit **STRIPE_WEBHOOK_SECRET**:
   - Replace the test secret with your **Live** webhook signing secret
4. Click **"Save"** for each
5. Redeploy the site

### Step 3: Update Your Payment Link
1. The current link is in Test mode
2. Create a new payment link in Live mode, or toggle your existing link to Live
3. Update the link in your landing page if needed

### Step 4: Test One More Time
- Make a real $3 payment (it will actually charge)
- Verify you receive the email and can create your account
- If everything works, you're live!

---

## Quick Reference

**Webhook URL:**
```
https://thebiblicalmantruth.com/api/webhooks/stripe
```

**Event to listen for:**
```
payment_intent.succeeded
```

**Required Vercel Environment Variables:**
- STRIPE_SECRET_KEY
- STRIPE_WEBHOOK_SECRET
- CRON_SECRET
- RESEND_API_KEY
- EMAIL_FROM
- NEXT_PUBLIC_SUPABASE_URL
- SUPABASE_SERVICE_ROLE_KEY

**Test Card:**
```
4242 4242 4242 4242
Exp: 12/25
CVC: 123
ZIP: 12345
```

---

## Need Help?

If you get stuck:
1. Check the Troubleshooting section above
2. Check Vercel deployment logs
3. Check Stripe webhook event logs
4. Check Supabase database to see if records are being created

The system is fully built and ready - you just need to connect the Stripe webhook and make sure all environment variables are set!
