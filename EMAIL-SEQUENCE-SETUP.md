# 7-Day Email Sequence - Complete Setup Guide

## Overview

The 7-Day Biblical Man Challenge is a fully automated email sequence that sends one email per day for 7 days. Each email uses aggressive, Ben Settle-style copywriting to challenge men to lead biblically.

## Email Sequence Content

1. **Day 1**: The Uncomfortable Truth About "Biblical" Manhood
2. **Day 2**: Your Church Lied About Headship (And You Know It)
3. **Day 3**: Why Christian Men Are Spiritually Weak
4. **Day 4**: The "Mutual Submission" Myth
5. **Day 5**: How to Actually Lead Your Family
6. **Day 6**: The Armory (Tools You Actually Need)
7. **Day 7**: Final Challenge (Will You Lead or Quit?)

## Setup Steps

### 1. Create Database Table (2 minutes)

Run this SQL in your Supabase dashboard:

```bash
cd /Users/thebi/biblical-man-hub
# The schema file is at: lib/db/email-sequence-schema.sql
```

Go to Supabase → SQL Editor → paste the contents of `lib/db/email-sequence-schema.sql`

### 2. Set Environment Variables

Add these to your `.env.local` and Vercel:

```env
# Resend (required)
RESEND_API_KEY=re_your_key_here
EMAIL_FROM=adam@biblicalman.com

# Supabase (required)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Cron Security (required for production)
CRON_SECRET=your_random_secret_here
```

Generate CRON_SECRET:
```bash
openssl rand -base64 32
```

### 3. Deploy to Vercel

The cron job is configured in `vercel.json` to run every hour:

```json
{
  "crons": [{
    "path": "/api/cron/send-email-sequence",
    "schedule": "0 * * * *"
  }]
}
```

Deploy:
```bash
git add -A
git commit -m "Add 7-day email sequence"
git push
npx vercel --prod
```

### 4. Set Vercel Environment Variables

In Vercel Dashboard:
1. Go to Settings → Environment Variables
2. Add `CRON_SECRET` (same value as local)
3. Redeploy

### 5. Test It

**Test signup:**
```bash
# Go to your site
open https://thebiblicalmantruth.com

# Sign up with your email
# Check inbox for Day 1 email
```

**Test cron job manually:**
```bash
curl -X GET https://thebiblicalmantruth.com/api/cron/send-email-sequence \
  -H "Authorization: Bearer YOUR_CRON_SECRET"
```

## How It Works

### Signup Flow
1. User enters email on landing page
2. Email stored in `email_sequence_subscribers` table
3. Day 1 email sent immediately
4. User sees success message

### Daily Email Flow
1. Vercel cron runs every hour
2. Checks for subscribers where `last_email_sent_at` is 24+ hours ago
3. Sends next email in sequence (Day 2-7)
4. Updates subscriber record with new `current_day` and `last_email_sent_at`
5. Marks as `completed: true` after Day 7

## Database Schema

```sql
email_sequence_subscribers
├── id (UUID)
├── email (TEXT, UNIQUE)
├── subscribed_at (TIMESTAMPTZ)
├── current_day (INTEGER) -- 1-7
├── last_email_sent_at (TIMESTAMPTZ)
├── completed (BOOLEAN)
├── created_at (TIMESTAMPTZ)
└── updated_at (TIMESTAMPTZ)
```

## Monitoring

### Check subscribers:
```sql
SELECT
  email,
  current_day,
  last_email_sent_at,
  completed
FROM email_sequence_subscribers
ORDER BY subscribed_at DESC;
```

### See who's ready for next email:
```sql
SELECT * FROM get_subscribers_ready_for_email();
```

### Check completion rate:
```sql
SELECT
  completed,
  COUNT(*) as count
FROM email_sequence_subscribers
GROUP BY completed;
```

## Troubleshooting

**Emails not sending?**
- Check `RESEND_API_KEY` is valid
- Verify domain in Resend dashboard
- Check cron job logs in Vercel

**Subscribers not receiving emails?**
- Check spam folder
- Verify `last_email_sent_at` timestamp
- Manually trigger cron: `/api/cron/send-email-sequence`

**Cron job not running?**
- Verify `CRON_SECRET` is set in Vercel
- Check Vercel cron logs
- Ensure you're on Pro plan (crons require Pro)

## Customization

### Edit email content:
`lib/email-sequences.ts` contains all 7 emails

### Change send frequency:
Edit `vercel.json` schedule:
- Every hour: `"0 * * * *"`
- Twice daily: `"0 0,12 * * *"`
- Once daily: `"0 0 * * *"`

### Add unsubscribe:
Add unsubscribe link to email templates:
```html
<a href="https://thebiblicalmantruth.com/unsubscribe?email={{email}}">
  Unsubscribe
</a>
```

## Email Analytics

Track opens/clicks via Resend dashboard:
https://resend.com/emails

Consider adding:
- Link tracking
- Open tracking
- Reply-to address

## Production Checklist

- [ ] Database table created
- [ ] Environment variables set (local + Vercel)
- [ ] CRON_SECRET generated and added
- [ ] Resend domain verified
- [ ] Cron job deployed and active
- [ ] Test signup completed
- [ ] Day 1 email received
- [ ] Monitoring queries saved

## Cost Estimate

- Resend: Free up to 3,000 emails/month, then $20/month
- Supabase: Free tier includes 500 MB database
- Vercel Crons: Requires Pro plan ($20/month)

**Total**: ~$40/month for automated sequence

## Next Steps

1. Monitor first 10 signups closely
2. Check completion rates after 7 days
3. Adjust copy based on engagement
4. Add additional sequences (welcome, nurture, etc.)
