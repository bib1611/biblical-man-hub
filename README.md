# The Biblical Man Hub

> Your command center for Biblical transformation. A complete interactive web application combining content distribution, product sales, AI-powered marketing, Bible study tools, and more.

![The Biblical Man Hub](https://img.shields.io/badge/Next.js-14-black) ![TypeScript](https://img.shields.io/badge/TypeScript-5-blue) ![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-cyan)

## 🎯 Features

### Core Modules

1. **Content Feed** - Aggregates content from multiple platforms
   - Substack posts
   - Beehiiv newsletters
   - Gumroad updates
   - Twitter/X posts (optional)
   - Full-text reading within the app
   - Search and filter functionality

2. **KJV Bible Study** - Complete King James Version Bible study tool
   - Full Bible text navigation
   - Fast search across all books and verses
   - Highlighting and bookmarking
   - Personal notes system
   - Alexander Scourby audio integration (YouTube)

3. **Sales Beast AI** - AI-powered sales assistant
   - Aggressive, conversion-focused chatbot
   - Trained on Ben Settle, Gary Vaynerchuk, Dan Kennedy, Gary Halbert
   - Product recommendations based on user needs
   - Direct buy links and upsells
   - Powered by Claude (Anthropic)

4. **Products Hub** - Complete product catalog
   - All Gumroad products displayed
   - Category filtering (marriage, men, women, parenting, devotionals, courses)
   - Sort by price or name
   - Direct purchase links
   - Feature highlights

5. **FFBR Radio** - Final Fight Bible Radio integration
   - Live stream player
   - Volume controls
   - Visual audio bars
   - Always-accessible floating player

6. **Private Counseling Chat** - Paid counseling access
   - Payment wall integration
   - Secure messaging system
   - File upload support
   - Voice notes (ready for integration)
   - Message history

7. **Contact Form** - Direct email communication
   - Subject categorization
   - Email API integration (Resend)
   - Form validation
   - Success/error messaging

### UI/UX Features

- **macOS-style draggable windows** - Smooth, intuitive window management
- **Masculine, gritty Biblical aesthetic** - Dark theme with red, gold, and charcoal accents
- **Side dock navigation** - Always-accessible app launcher
- **Smooth animations** - Framer Motion powered transitions
- **Responsive design** - Works on all screen sizes
- **Sound effects ready** - Audio feedback system (placeholders included)

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- API keys (see Environment Variables section)

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd biblical-man-hub
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env.local` file:
```bash
cp .env.example .env.local
```

4. Add your API keys to `.env.local`:
```env
ANTHROPIC_API_KEY=your_key_here
RESEND_API_KEY=your_key_here
EMAIL_FROM=hub@yourdomain.com
EMAIL_TO=your@email.com
```

5. Run the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
biblical-man-hub/
├── app/
│   ├── api/              # API routes
│   │   ├── bible/        # Bible verse fetching
│   │   ├── contact/      # Contact form handler
│   │   ├── content-feed/ # RSS aggregation
│   │   ├── counseling/   # Counseling chat endpoints
│   │   └── sales-beast/  # AI sales assistant
│   ├── layout.tsx        # Root layout
│   └── page.tsx          # Main application
├── components/
│   ├── dock/             # Side navigation dock
│   ├── shared/           # Shared components (Window)
│   └── windows/          # Individual module components
├── lib/
│   ├── data/             # Static data (Bible books, products)
│   ├── store.ts          # Zustand state management
│   └── utils/            # Utility functions
├── types/
│   └── index.ts          # TypeScript type definitions
└── public/
    ├── sounds/           # Sound effects (to be added)
    └── icons/            # Custom icons (to be added)
```

## 🔧 Configuration

### Environment Variables

Required:
- `ANTHROPIC_API_KEY` - For Sales Beast AI (get at [console.anthropic.com](https://console.anthropic.com))
- `RESEND_API_KEY` - For email functionality (get at [resend.com](https://resend.com))

Optional:
- `EMAIL_FROM` - Sender email address
- `EMAIL_TO` - Recipient email address
- RSS feed URLs for content aggregation
- Database URL for persistent storage
- Payment integration keys (Stripe/Gumroad)

### Customization

#### Product Updates
Edit `/lib/data/products.ts` to update your product catalog.

#### Bible Data
The app uses mock Bible data. For production, integrate with:
- [API.Bible](https://scripture.api.bible/)
- [ESV API](https://api.esv.org/)
- Or load KJV JSON locally

#### RSS Feeds
Update the `/app/api/content-feed/route.ts` to connect to your actual RSS feeds using a library like `rss-parser`.

#### Radio Stream
Replace the placeholder stream URL in `/components/windows/RadioPlayer.tsx` with FFBR's actual stream URL.

## 🎨 Styling

The app uses:
- **Tailwind CSS** for utility-first styling
- **Custom color palette**: Red, gold, charcoal, black
- **Framer Motion** for animations
- **Lucide React** for icons

### Color Scheme
- Primary: Red (`red-600`, `red-900`)
- Accent: Gold/Orange (`orange-600`, `amber-600`)
- Background: Black with subtle red tints
- Text: Light gray to white

## 🔐 Security Notes

1. **Never commit `.env.local`** - It contains sensitive API keys
2. **Use server-side API routes** - Keep keys secure
3. **Validate all user input** - Especially in contact and counseling forms
4. **Implement rate limiting** - For API routes in production
5. **Add authentication** - For counseling chat (use NextAuth.js)

## 📦 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project in Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

```bash
# Or use Vercel CLI
npm install -g vercel
vercel
```

### Manual Deployment

```bash
# Build the application
npm run build

# Start production server
npm start
```

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **State Management**: Zustand
- **Icons**: Lucide React
- **AI**: Anthropic Claude API
- **Email**: Resend
- **Deployment**: Vercel

## 📝 To-Do / Future Enhancements

- [ ] Integrate real KJV Bible API
- [ ] Add RSS feed parsing for live content
- [ ] Implement user authentication (NextAuth.js)
- [ ] Add database for message persistence (Postgres/Supabase)
- [ ] Integrate Stripe for payments
- [ ] Add sound effects
- [ ] Implement voice recording for counseling
- [ ] Add admin dashboard
- [ ] Mobile app version (React Native)
- [ ] Email newsletter integration
- [ ] Analytics tracking

## 🤝 Contributing

This is a custom project for The Biblical Man brand. For collaboration inquiries, use the contact form within the app.

## 📄 License

Proprietary - All rights reserved by The Biblical Man

## 🙏 Credits

Built with:
- Next.js by Vercel
- Tailwind CSS
- Framer Motion
- Anthropic Claude AI
- Lucide Icons

---

**The Biblical Man Hub** - Built for men who lead.

For support or questions, use the Message Adam module within the application.
