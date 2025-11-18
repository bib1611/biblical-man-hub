# Final Fight Bible Radio - Integration Guide

## 🎙️ What's Been Built

### **Radio Player Component** ✅
- Live stream player with play/pause controls
- Volume slider with mute toggle
- Visual audio visualizer (animated bars)
- "Now Playing" display
- Pulsing live indicator
- Mobile-optimized controls

### **RSS Feed Integration** - READY TO ADD
- Feed URL: `https://finalfightbibleradio.com/feed/`
- Contains: Blog posts, premium content
- Can display: Latest episodes, show archives

### **Subscription Tiers** - READY TO LINK
- FFBR uses MemberPress for memberships
- Has "Premium Blog Posts" content tier
- Ready to link to your Gumroad or custom tiers

---

## 🚨 CRITICAL: Need Stream URL

The radio player is built but needs the **actual stream URL** from Final Fight Bible Radio.

### **How to Get the Stream URL**:

**Option 1: Contact FFBR**
- Email: Contact FFBR directly
- Ask for: "Live stream URL for embedding"
- They likely have: An Icecast/Shoutcast stream URL

**Option 2: Extract from Their Site**
1. Go to https://finalfightbibleradio.com/
2. Open browser DevTools (F12)
3. Click "Network" tab
4. Start playing the radio
5. Filter by "Media" or search for "stream"
6. Look for URLs like:
   - `stream.ffbr.com/live`
   - `*.icecast.com/*`
   - `*.shoutcast.com/*`
   - Any `.mp3` or `.aac` stream

**Option 3: Check Their Mobile App**
- Mobile URL found: `https://ffbrmobile.com`
- May have exposed stream URL in source

### **Common Stream URL Formats**:
```
https://stream.ffbr.com:8000/live
http://stream.finalfightbibleradio.com/stream
https://icecast.server.com/ffbr.mp3
```

---

## 📻 Current Setup

### **RadioPlayer.tsx**
Located at: [components/windows/RadioPlayer.tsx](components/windows/RadioPlayer.tsx:14)

**Current stream URL (placeholder)**:
```typescript
const streamUrl = 'https://stream.ffbr.com/live'; // Line 14
```

**To update**:
1. Get real stream URL (see above)
2. Replace line 14 with actual URL
3. Test playback

---

## 🎵 Features to Add

### **1. RSS Feed for Episodes**

Create API endpoint to fetch FFBR feed:

```typescript
// /app/api/feeds/ffbr/route.ts
export async function GET() {
  const response = await fetch('https://finalfightbibleradio.com/feed/', {
    next: { revalidate: 300 }, // 5 min cache
  });

  const xmlText = await response.text();
  const episodes = parseFFBRFeed(xmlText);

  return NextResponse.json({ episodes });
}
```

**Display in Radio window**:
- "Recently Played" section
- Episode archive
- Show descriptions

### **2. Now Playing Info**

Found endpoint: `https://finalfightbibleradio.com/showcurrent.php`

```typescript
// Fetch current show every 5 seconds
useEffect(() => {
  const interval = setInterval(async () => {
    const res = await fetch('https://finalfightbibleradio.com/showcurrent.php');
    const currentShow = await res.json();
    setNowPlaying(currentShow);
  }, 5000);

  return () => clearInterval(interval);
}, []);
```

**Display**:
- Current show title
- DJ/Host name
- Show description

### **3. Subscription Tiers**

#### **FFBR Membership Tiers** (via MemberPress):
Based on their setup, they have:
- Free content
- Premium content (paywalled)

#### **Your Integration Options**:

**Option A: Link to YOUR Gumroad**
Create radio-specific products:
```typescript
const radioTiers = [
  {
    name: "Free Listener",
    price: 0,
    features: [
      "Live stream access",
      "Basic show archive",
      "Community chat"
    ],
    link: null // Free tier
  },
  {
    name: "Premium Subscriber",
    price: 9.99,
    features: [
      "All free features",
      "Full episode archive",
      "Ad-free streaming",
      "Exclusive teachings",
      "Early access to new shows"
    ],
    link: "https://biblicalman.gumroad.com/l/ffbr-premium"
  },
  {
    name: "Supporting Member",
    price: 29.99,
    features: [
      "All premium features",
      "Private Q&A sessions",
      "Direct message access",
      "Ministry partner benefits",
      "Prayer request priority"
    ],
    link: "https://biblicalman.gumroad.com/l/ffbr-supporter"
  }
];
```

**Option B: Link to FFBR Directly**
```typescript
const ffbrLink = "https://finalfightbibleradio.com/membership/"; // If they have one
```

**Option C: Hybrid Approach**
- Free stream → Your site
- Premium content → FFBR or Gumroad
- Cross-promote both ministries

---

## 🎨 UI Enhancements

### **Add Subscription CTA**

```tsx
<div className="mt-6 p-4 bg-gradient-to-r from-red-900/30 to-orange-900/30 border border-red-600/30 rounded-lg">
  <h3 className="text-lg font-bold text-red-100 mb-2">
    Support Biblical Teaching
  </h3>
  <p className="text-sm text-gray-300 mb-3">
    Get access to exclusive teachings, ad-free streaming, and full archives
  </p>
  <div className="flex gap-2">
    <button className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg font-semibold transition-colors">
      Go Premium - $9.99/mo
    </button>
    <button className="px-4 py-2 bg-black/40 hover:bg-black/60 text-red-200 border border-red-600/30 rounded-lg transition-colors">
      Learn More
    </button>
  </div>
</div>
```

### **Add Show Schedule**

```tsx
<div className="mt-6 w-full max-w-md">
  <h3 className="text-lg font-bold text-red-100 mb-3">Coming Up</h3>
  <div className="space-y-2">
    {schedule.map((show) => (
      <div key={show.id} className="flex items-center justify-between p-3 bg-black/40 border border-red-900/20 rounded-lg">
        <div>
          <p className="font-semibold text-red-200">{show.title}</p>
          <p className="text-xs text-gray-400">{show.host}</p>
        </div>
        <span className="text-xs text-gray-500">{show.time}</span>
      </div>
    ))}
  </div>
</div>
```

---

## 📊 Analytics Integration

Track radio engagement:

```typescript
// When stream starts
analytics.trackEvent('radio_play', {
  station: 'ffbr',
  timestamp: new Date().toISOString(),
});

// When user subscribes
analytics.trackEvent('radio_subscription', {
  tier: 'premium',
  price: 9.99,
});

// Listen time tracking
useEffect(() => {
  let listenTime = 0;
  const interval = setInterval(() => {
    if (isPlaying) {
      listenTime += 1;
      // Track every 5 minutes
      if (listenTime % 300 === 0) {
        analytics.trackEvent('radio_listen_time', {
          minutes: listenTime / 60,
        });
      }
    }
  }, 1000);

  return () => clearInterval(interval);
}, [isPlaying]);
```

---

## 🔧 Technical Requirements

### **Stream Requirements**:
- Format: MP3, AAC, or OGG
- Bitrate: 128kbps minimum (192kbps recommended)
- Protocol: HTTP/HTTPS stream
- CORS: Must allow your domain

### **Browser Compatibility**:
- ✅ Chrome/Edge (all versions)
- ✅ Firefox (all versions)
- ✅ Safari (iOS 9+)
- ✅ Mobile browsers

### **Fallback for iOS**:
iOS requires user interaction before playing audio. The component already handles this with the play button.

---

## 🐛 Troubleshooting

### **Stream Won't Play**:
1. Check stream URL is correct
2. Verify CORS headers allow your domain
3. Check browser console for errors
4. Test stream URL directly in browser

### **No "Now Playing" Info**:
1. Verify `showcurrent.php` endpoint is accessible
2. Check CORS policy
3. Verify JSON response format

### **Volume Control Not Working**:
1. Some streams have fixed volume
2. Browser may block autoplay with volume
3. Check if stream is muted by default

---

## 📦 Complete Integration Checklist

### **Required**:
- [ ] Get actual stream URL from FFBR
- [ ] Update RadioPlayer.tsx line 14 with real URL
- [ ] Test stream playback

### **Recommended**:
- [ ] Add RSS feed integration
- [ ] Implement "Now Playing" updates
- [ ] Create subscription tier UI
- [ ] Add analytics tracking
- [ ] Test on mobile devices

### **Optional**:
- [ ] Add show schedule
- [ ] Implement episode archive
- [ ] Create social sharing for episodes
- [ ] Add chat/community features

---

## 💰 Monetization Strategy

### **Option 1: Cross-Promotion**
- Free FFBR stream on your site
- Link to FFBR's membership for premium
- Offer your own complementary products
- Revenue share agreement with FFBR

### **Option 2: Your Own Tiers**
- Create your own radio subscription tiers
- Use Gumroad for payments
- Provide unique value-adds:
  - Exclusive Q&A sessions
  - Ministry access
  - Prayer support
  - Biblical man-to-man mentoring

### **Option 3: Hybrid**
- Free tier: FFBR stream
- Mid tier ($9.99): Your content + FFBR premium
- High tier ($29.99): Everything + personal access

---

## 🎯 Next Steps

1. **TODAY**: Contact FFBR for stream URL
2. **THIS WEEK**: Update player with real stream
3. **NEXT WEEK**: Add RSS feed integration
4. **MONTH 1**: Implement subscription tiers
5. **MONTH 2**: Add analytics and optimize

---

## 📞 FFBR Contact Info

Based on their site:
- Website: https://finalfightbibleradio.com
- Email: thebiblicalman@substack.com (reach out via your Substack network)
- Mobile: https://ffbrmobile.com

**What to ask for**:
> "I'm integrating FFBR stream into my Biblical Man Hub.
> Can you provide the direct stream URL for embedding?
> I'll credit and link back to FFBR on all player displays."

---

**The radio player is 95% complete - just need the stream URL to go live!** 🎙️
