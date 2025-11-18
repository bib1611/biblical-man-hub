# Analytics & Admin Dashboard - Complete Setup Guide

## ✅ What's Been Built

### 1. **Complete Analytics System**
- ✅ Real-time visitor tracking
- ✅ Session management
- ✅ Event logging (page views, clicks, etc.)
- ✅ Lead capture with email collection
- ✅ Conversation quality scoring
- ✅ Product click tracking
- ✅ Traffic source attribution

### 2. **Admin Dashboard** (Available in Dock)
- ✅ Live visitor count
- ✅ Email capture rate
- ✅ Chat quality metrics
- ✅ Top performing products
- ✅ Traffic sources
- ✅ Lead management with status updates
- ✅ Lead scoring (0-100)
- ✅ Auto-refresh every 30 seconds

### 3. **Lead Scoring Algorithm**
Points awarded based on:
- **Source** (50pts counseling, 30pts Sam chat, 10pts email)
- **Engagement** (20pts for 5+ pages, 10pts for 2+ pages)
- **Time on site** (20pts for 10+ minutes, 10pts for 5+ minutes)

### 4. **Telegram Notifications** (Ready to Use)
Automatically sends alerts for:
- High-value leads (score ≥ 50)
- High-intent conversations (ready_to_buy, needs_help)

### 5. **Email Capture Modal**
- Timer-based popup (30 seconds default)
- Exit-intent capable
- Lead capture with scoring
- localStorage prevents re-showing

---

## 🚀 Quick Start

### Step 1: Access Admin Dashboard
1. Enter the Hub
2. Click the **green bar chart icon** at the bottom of the dock
3. Dashboard opens with real-time data

### Step 2: Set Up Telegram Notifications (Optional)
1. Create a Telegram bot via [@BotFather](https://t.me/BotFather)
2. Get your chat ID from [@userinfobot](https://t.me/userinfobot)
3. Add to `.env.local`:
```bash
TELEGRAM_BOT_TOKEN=your_bot_token_here
TELEGRAM_CHAT_ID=your_chat_id_here
```

4. Restart dev server
5. You'll now get instant notifications for hot leads!

### Step 3: Enable Email Capture Modal
Add to `app/page.tsx` inside the Hub section (around line 133):

```tsx
{showHub && <EmailCaptureModal trigger="timer" delay={30000} />}
```

**Trigger options:**
- `timer` - Shows after delay (default 30 seconds)
- `exit` - Shows when mouse leaves top of page
- `manual` - Control via props

---

## 📊 What You Can Track

### Visitor Metrics
- Online visitors (last 5 minutes)
- Total visitors today
- Average time on site
- Traffic sources (UTM, referrer, direct)

### Lead Metrics
- Email capture rate
- Leads by status (new, contacted, converted, lost)
- Lead scores
- Conversation history

### Product Performance
- Most clicked products
- Product engagement over time

### Sam AI Metrics
- Conversation quality (1-10)
- Intent detection (browsing, interested, ready_to_buy, needs_help)
- Products discussed
- Escalation tracking

---

## 🎯 How Lead Scoring Works

**New Lead Created When:**
- Email captured via modal
- Email given to Sam
- Counseling inquiry submitted

**Score Calculation:**
```
Base: 0 points

+ Source Points:
  - Counseling inquiry: +50pts
  - Sam chat: +30pts
  - Email capture: +10pts

+ Engagement:
  - 5+ page views: +20pts
  - 2-5 page views: +10pts

+ Time on Site:
  - 10+ minutes: +20pts
  - 5-10 minutes: +10pts

MAX: 100 points
```

**High-Value Threshold:** 50+ points triggers Telegram alert

---

## 🔔 Telegram Notifications

### When You Get Alerted:

**High-Value Lead (Score ≥ 50):**
```
🔥 HIGH-VALUE LEAD ALERT!

📧 Email: john@example.com
👤 Name: John
📊 Score: 75/100
🎯 Source: counseling_inquiry
⏰ Time: Nov 18, 2025 2:30 PM

🌐 Pages viewed: 8
⏱️ Time on site: 15 minutes
```

**High-Intent Conversation:**
```
💬 HIGH-INTENT CONVERSATION ALERT!

🎯 Intent: READY TO BUY
⭐ Quality: 85/100
💬 Messages: 12
📧 Email: john@example.com

🛍️ Products discussed: Biblical Masculinity, Parker Protocol

Last message: "How do I get access to the vault?..."
```

---

## 📈 Using the Admin Dashboard

### Lead Management
1. View all leads sorted by score
2. Filter by status (new, contacted, converted, lost)
3. Click status buttons to update lead status
4. View conversation history

### Real-Time Monitoring
- **Visitors Online**: Updates every 30 seconds
- **Green pulse**: Indicates live data
- **Product clicks**: See what people are interested in
- **Traffic sources**: Know where visitors come from

---

## 🔧 Next Steps to Production

### 1. Upgrade Database
Replace in-memory DB with real database:
```bash
npm install @vercel/postgres
# or
npm install @prisma/client
```

### 2. Add Analytics Integration
```tsx
// Add Google Analytics
export NEXT_PUBLIC_GA_ID=your_ga_id

// Add Facebook Pixel
export NEXT_PUBLIC_FB_PIXEL=your_pixel_id
```

### 3. Gumroad Webhook Integration
Set up webhooks to track actual purchases:
```
POST /api/webhooks/gumroad
```

### 4. Email Automation
Connect to email service:
```bash
npm install @sendgrid/mail
# or
npm install resend
```

---

## 🎨 Customization

### Change Email Modal Timing
```tsx
<EmailCaptureModal
  trigger="timer"
  delay={60000}  // 60 seconds
/>
```

### Adjust Lead Scoring
Edit `/app/api/analytics/capture-lead/route.ts`:
```typescript
function calculateLeadScore(visitor: any, source: string): number {
  // Customize your scoring logic here
}
```

### Modify Telegram Messages
Edit notification functions in:
- `/app/api/analytics/capture-lead/route.ts`
- `/app/api/analytics/log-conversation/route.ts`

---

## 📱 Mobile Testing

Test these features:
- [ ] Admin dashboard responsive on mobile
- [ ] Email modal works on touch devices
- [ ] Analytics tracking on mobile browsers
- [ ] Telegram notifications work 24/7

---

## 🐛 Troubleshooting

**No data in dashboard?**
- Check browser console for errors
- Verify analytics is initialized (check localStorage)
- Try opening a product or window

**Telegram not working?**
- Verify `.env.local` has correct tokens
- Restart dev server after adding env vars
- Test with a low score threshold first

**Email modal not showing?**
- Check localStorage for `biblical_man_email_captured`
- Clear to test again
- Verify delay time

---

## 💡 Pro Tips

1. **Monitor during launch**: Keep admin dashboard open during traffic spikes
2. **Set up Telegram on phone**: Get instant notifications anywhere
3. **Check lead scores daily**: Follow up with 50+ scores within 24 hours
4. **Track conversation quality**: Low scores mean Sam needs tuning
5. **A/B test email modal**: Try different delays and copy

---

## 🎯 Success Metrics to Watch

Week 1:
- [ ] Email capture rate > 10%
- [ ] Average time on site > 2 minutes
- [ ] Sam conversation quality > 6/10

Month 1:
- [ ] 100+ qualified leads (score > 30)
- [ ] 10+ high-value leads (score > 50)
- [ ] Email capture rate > 15%
- [ ] Product click-through > 20%

---

## Files Created

### Core System
- `/lib/analytics.ts` - Client-side analytics tracker
- `/lib/db.ts` - In-memory database (upgrade to real DB)
- `/types/index.ts` - Analytics type definitions

### API Endpoints
- `/app/api/analytics/track/route.ts` - Event tracking
- `/app/api/analytics/heartbeat/route.ts` - Session tracking
- `/app/api/analytics/capture-lead/route.ts` - Lead capture + scoring
- `/app/api/analytics/log-conversation/route.ts` - Sam conversation logging
- `/app/api/admin/analytics/route.ts` - Dashboard data
- `/app/api/admin/leads/route.ts` - Lead management

### UI Components
- `/components/windows/AdminDashboard.tsx` - Admin dashboard
- `/components/modals/EmailCaptureModal.tsx` - Email capture popup

---

**You now have a complete conversion machine with real-time analytics, lead scoring, and instant notifications. Ready to turn visitors into customers 24/7!** 🚀
