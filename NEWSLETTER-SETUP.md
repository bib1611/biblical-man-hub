# Newsletter Signup - Complete Setup Guide

## What Was Built

The newsletter signup form now:

1. ✅ **Captures emails** from the homepage
2. ✅ **Stores in Google Sheets** for easy management
3. ✅ **Sends welcome email immediately** with:
   - Brand introduction
   - Links to Substack, Gumroad, X account
   - Engagement question
4. ✅ **Shows success/error messages** to users
5. ✅ **Ready for email sequence** (4-email automation)

## Quick Setup (5 minutes)

### 1. Set Up Google Sheets (2 min)

Follow the detailed guide in [GOOGLE-SHEETS-SETUP.md](GOOGLE-SHEETS-SETUP.md)

**Quick version:**
1. Create Google Sheet with columns: Email, Timestamp, Source
2. Extensions → Apps Script → paste webhook code
3. Deploy as web app → copy URL
4. Add to `.env.local`: `GOOGLE_SHEET_WEBHOOK_URL=your_url_here`

### 2. Set Up Email Service (3 min)

1. Sign up at [Resend.com](https://resend.com) (free tier: 3,000 emails/month)
2. Verify your domain OR use resend.dev for testing
3. Get your API key
4. Add to `.env.local`:
   ```env
   RESEND_API_KEY=re_your_key_here
   EMAIL_FROM=adam@biblicalman.com
   ```

### 3. Test It

```bash
# Make sure env vars are set
npm run dev

# Go to homepage
open http://localhost:3000

# Enter your email in newsletter form
# Click Subscribe
# Check: Google Sheet + Email inbox
```

## Email Sequence

### Email 1: Welcome (Immediate) ✅ AUTOMATED

**Subject:** "Welcome to The Biblical Man"

**Content:**
- Welcome message
- What to expect
- Links to Substack, Gumroad
- Question for engagement
- Clear CTA buttons

**Status:** Fully automated via `/api/newsletter/subscribe`

### Email 2: Substack Introduction (Day 2) ⏳ TODO

**Subject:** "Start Here: The Best of Biblical Masculinity"

**Content:**
- Top 3 Substack posts to read first
- What weekly emails look like
- Commenting/engagement guide

**To automate:** Use ConvertKit, Loops.so, or custom cron

### Email 3: Product Showcase (Day 3) ⏳ TODO

**Subject:** "Frameworks That Actually Work"

**Content:**
- Featured product: Marriage Framework
- Customer testimonials
- Limited offer (if applicable)
- Clear product benefits

**To automate:** Same as Email 2

### Email 4: X Account + Community (Day 4) ⏳ TODO

**Subject:** "Join the Movement"

**Content:**
- X account introduction
- Behind-the-scenes content
- How to engage
- Community guidelines

**To automate:** Same as Email 2

## Automation Options

### Option 1: ConvertKit (Easiest)
- **Cost:** Free up to 1,000 subscribers
- **Setup:** 10 minutes
- **Features:** Visual automation, sequences, forms
- **Integration:** Import your Google Sheet

### Option 2: Loops.so (Developer-Friendly)
- **Cost:** $30/month
- **Setup:** API-based, very flexible
- **Features:** Transactional + marketing emails
- **Integration:** Direct API calls

### Option 3: Custom Cron Jobs (Most Control)
- **Cost:** Free (using Vercel)
- **Setup:** 30-60 minutes
- **Features:** Full control, custom logic
- **Integration:** Query Google Sheets, send via Resend

## Current Setup Files

```
biblical-man-hub/
├── app/
│   └── api/
│       └── newsletter/
│           └── subscribe/
│               └── route.ts          # Newsletter API endpoint
├── .env.example                      # Updated with Google Sheets
├── GOOGLE-SHEETS-SETUP.md           # Detailed setup guide
└── NEWSLETTER-SETUP.md              # This file
```

## Environment Variables Needed

```env
# Email service (required for welcome email)
RESEND_API_KEY=re_your_key_here
EMAIL_FROM=adam@biblicalman.com

# Google Sheets (required for storage)
GOOGLE_SHEET_WEBHOOK_URL=https://script.google.com/macros/s/YOUR_ID/exec

# Optional: For automated sequences
# CONVERTKIT_API_KEY=your_key_here
# LOOPS_API_KEY=your_key_here
```

## How It Works

1. **User enters email** on homepage
2. **Frontend calls** `/api/newsletter/subscribe`
3. **API route:**
   - Stores email in Google Sheet (via webhook)
   - Sends welcome email (via Resend)
   - Returns success/error
4. **User sees confirmation** message
5. **User receives** welcome email immediately

## Testing Without Setup

Even without API keys configured:
- Form still works
- Shows success message
- Logs to console
- Won't actually send emails or store data

## Email Templates Customization

The welcome email is in: `/app/api/newsletter/subscribe/route.ts`

To customize:
1. Open the file
2. Find the `sendWelcomeSequence()` function
3. Edit the HTML template
4. Update links to your actual URLs:
   - `https://biblicalman.substack.com`
   - `https://gumroad.com/biblicalman`
   - Your X account URL

## Analytics Tracking

Consider adding:
- Google Analytics event: "newsletter_signup"
- Facebook Pixel: "Lead" event
- Plausible event tracking

Example:
```javascript
// After successful signup
gtag('event', 'newsletter_signup', {
  email_domain: email.split('@')[1]
});
```

## GDPR / Privacy

Make sure to:
1. Add privacy policy link
2. Add unsubscribe link in all emails
3. Don't share email list
4. Secure Google Sheet (private access only)
5. Mention data storage in privacy policy

## Troubleshooting

**Form submits but no email:**
- Check RESEND_API_KEY is valid
- Check EMAIL_FROM domain is verified
- Look for errors in terminal

**No Google Sheet data:**
- Check GOOGLE_SHEET_WEBHOOK_URL is correct
- Test webhook with curl (see GOOGLE-SHEETS-SETUP.md)
- Check Apps Script permissions

**Subscriber not receiving email:**
- Check spam folder
- Verify email service is active
- Check Resend dashboard for delivery logs

## Next Steps

1. ✅ Set up Google Sheets webhook
2. ✅ Set up Resend account
3. ⏳ Choose email automation platform (ConvertKit recommended)
4. ⏳ Create emails 2-4 in automation tool
5. ⏳ Test entire sequence with personal email
6. ⏳ Add analytics tracking
7. ⏳ Create privacy policy page

---

**Questions?** Check the main [README.md](README.md) or [DEPLOYMENT.md](DEPLOYMENT.md)
