# Quick Start Guide - Biblical Man Hub

## 🚀 Get Up and Running in 5 Minutes

### Step 1: Install Dependencies (1 min)
```bash
npm install
```

### Step 2: Set Up Environment Variables (2 min)

Create a `.env.local` file:
```bash
cp .env.example .env.local
```

**Minimum required for testing:**
```env
ANTHROPIC_API_KEY=sk-ant-api03-your-key-here
```

> Get your free Anthropic API key at: https://console.anthropic.com/

**Optional (for email functionality):**
```env
RESEND_API_KEY=re_your-key-here
EMAIL_FROM=hub@yourdomain.com
EMAIL_TO=your@email.com
```

### Step 3: Run Development Server (1 min)
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Step 4: Explore the App (1 min)

Click the icons on the left dock to open each module:
1. **Content Feed** 📰 - See aggregated content
2. **Bible Study** 📖 - Browse KJV Bible with notes
3. **Sales Beast AI** 💰 - Chat with AI sales assistant
4. **Products Hub** 🛒 - View all products
5. **FFBR Radio** 📻 - Audio player interface
6. **Counseling** 💬 - Private chat module
7. **Contact** ✉️ - Email contact form

## What Works Out of the Box

✅ **Fully Functional:**
- All UI components and animations
- Window system (drag, minimize, maximize, close)
- Sales Beast AI (with Anthropic API key)
- Contact form (with Resend API key)
- Bible Study (mock data - highlights & notes work)
- Products display

⚠️ **Mock Data (requires integration):**
- Content Feed (shows sample posts)
- Bible verses (shows Genesis 1 sample)
- Radio stream (placeholder URL)
- Counseling payments (UI complete, needs Stripe/Gumroad)

## Next Steps

### For Testing/Demo
You're all set! The app works with mock data for demonstration.

### For Production

1. **Integrate Real APIs:**
   - Bible: Connect to API.Bible or similar
   - RSS: Add rss-parser and fetch real feeds
   - Radio: Replace placeholder with FFBR stream URL
   - Payments: Add Stripe for counseling module

2. **Update Product Data:**
   - Edit `lib/data/products.ts`
   - Replace with your actual Gumroad URLs

3. **Deploy:**
   - See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed instructions
   - Quickest: Push to GitHub → Import to Vercel → Done

## Common Issues

### "ANTHROPIC_API_KEY is missing"
- Make sure you created `.env.local` file
- Copy API key from https://console.anthropic.com/
- Restart dev server after adding key

### "Build fails"
- Run `npm run build` to test
- Check for TypeScript errors
- Verify all dependencies installed

### "Sales Beast AI not responding"
- Check ANTHROPIC_API_KEY is correct
- Check API key has credits
- Look at browser console for errors

## File Structure Cheat Sheet

```
biblical-man-hub/
├── app/
│   ├── api/              # All API endpoints
│   ├── page.tsx          # Main app (all windows)
│   └── layout.tsx        # Root layout
├── components/
│   ├── dock/             # Left sidebar navigation
│   ├── shared/           # Window component
│   └── windows/          # Each app module
├── lib/
│   ├── data/             # Products & Bible data
│   └── store.ts          # State management
├── types/
│   └── index.ts          # TypeScript types
├── .env.local            # Your secrets (create this!)
└── .env.example          # Template
```

## Customization Quick Tips

### Change Colors
Edit Tailwind classes in components. Current theme:
- Primary: `red-600`, `red-900`
- Accent: `orange-600`, `amber-600`
- Background: `black`, `red-950/20`

### Add/Remove Modules
1. Add to `types/index.ts` → `AppId` type
2. Update `lib/store.ts` → `defaultWindows`
3. Update `components/dock/Dock.tsx` → `dockItems`
4. Create component in `components/windows/`
5. Import in `app/page.tsx`

### Update Product Catalog
Edit `lib/data/products.ts` - straightforward array of objects.

## Getting Help

1. Check [README.md](README.md) for full documentation
2. Review [DEPLOYMENT.md](DEPLOYMENT.md) for production setup
3. Open browser dev tools → Console tab for errors
4. Check Next.js docs: https://nextjs.org/docs

## Ready to Deploy?

```bash
# Build for production
npm run build

# Test production build locally
npm start

# Deploy to Vercel (easiest)
npm install -g vercel
vercel
```

---

**You're all set!** 🎉

The Biblical Man Hub is ready to use. Start customizing and deploying.
