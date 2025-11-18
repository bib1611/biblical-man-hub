# Deployment Guide - The Biblical Man Hub

## Quick Deploy to Vercel

### Step 1: Prerequisites
- GitHub account
- Vercel account (free tier works)
- API keys ready:
  - Anthropic API key
  - Resend API key (optional, for email)

### Step 2: Push to GitHub

```bash
# Initialize git (if not already done)
git init
git add .
git commit -m "Initial commit: Biblical Man Hub complete"

# Create repository on GitHub and push
git remote add origin https://github.com/yourusername/biblical-man-hub.git
git branch -M main
git push -u origin main
```

### Step 3: Deploy to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click "Import Project"
3. Select your GitHub repository
4. Configure environment variables:
   - `ANTHROPIC_API_KEY` - Your Anthropic API key
   - `RESEND_API_KEY` - Your Resend API key (optional)
   - `EMAIL_FROM` - Your sender email
   - `EMAIL_TO` - Your recipient email
5. Click "Deploy"

Your site will be live in ~2 minutes!

## Manual Deployment

### Build for Production

```bash
npm run build
```

### Deploy to Your Own Server

1. Build the application:
```bash
npm run build
```

2. Copy these files to your server:
   - `.next/` directory
   - `public/` directory
   - `package.json`
   - `package-lock.json`

3. On your server:
```bash
npm install --production
npm start
```

4. Set up environment variables on your server

5. Use a process manager like PM2:
```bash
npm install -g pm2
pm2 start npm --name "biblical-man-hub" -- start
pm2 save
pm2 startup
```

## Environment Variables

### Required
- `ANTHROPIC_API_KEY` - For Sales Beast AI
  - Get at: https://console.anthropic.com/
  - Example: `sk-ant-api03-...`

### Optional but Recommended
- `RESEND_API_KEY` - For email functionality
  - Get at: https://resend.com/
  - Example: `re_...`
- `EMAIL_FROM` - Sender email (e.g., `hub@yourdomain.com`)
- `EMAIL_TO` - Recipient email (e.g., `adam@yourdomain.com`)

### Future Integrations (Not Yet Implemented)
- `DATABASE_URL` - PostgreSQL connection string
- `STRIPE_SECRET_KEY` - For payments
- `NEXTAUTH_SECRET` - For authentication
- `FFBR_STREAM_URL` - Final Fight Bible Radio stream URL

## Custom Domain

### On Vercel
1. Go to your project settings
2. Navigate to "Domains"
3. Add your custom domain
4. Follow DNS configuration instructions

### On Your Own Server
1. Point your domain's A record to your server IP
2. Set up SSL with Let's Encrypt:
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com
```

## Post-Deployment Configuration

### 1. Update Product Links
Edit [/lib/data/products.ts](lib/data/products.ts) with your actual Gumroad product URLs.

### 2. Connect RSS Feeds
Edit [/app/api/content-feed/route.ts](app/api/content-feed/route.ts) to fetch from your actual Substack, Beehiiv, and Gumroad feeds.

### 3. Add Bible API
Integrate a real KJV Bible API in [/app/api/bible/route.ts](app/api/bible/route.ts).
Recommended: https://scripture.api.bible/

### 4. Configure Radio Stream
Replace the placeholder in [/components/windows/RadioPlayer.tsx](components/windows/RadioPlayer.tsx) with FFBR's actual stream URL.

### 5. Set Up Payment Processing
Integrate Stripe or Gumroad for the Private Counseling module.

## Monitoring and Maintenance

### Vercel
- View logs in Vercel dashboard
- Set up error tracking with Sentry
- Monitor analytics with Vercel Analytics

### Self-Hosted
```bash
# View logs
pm2 logs biblical-man-hub

# Restart after updates
git pull
npm install
npm run build
pm2 restart biblical-man-hub
```

## Performance Optimization

### After Deployment
1. Test on mobile devices
2. Check Core Web Vitals
3. Optimize images if needed
4. Consider adding caching for API routes

### Recommended Additions
- Redis for caching
- CDN for static assets
- Database for persistent storage

## Troubleshooting

### Build Fails
- Check all TypeScript errors
- Ensure environment variables are set
- Verify API keys are valid

### API Routes Not Working
- Check environment variables
- Verify API keys have correct permissions
- Check server logs for errors

### UI Issues
- Clear browser cache
- Check console for JavaScript errors
- Verify all components imported correctly

## Support

For deployment issues:
1. Check the [README.md](README.md)
2. Review Vercel documentation
3. Check Next.js documentation
4. Contact through the app's contact form

---

**The Biblical Man Hub** - Ready to deploy and transform lives.
