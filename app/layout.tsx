import type { Metadata } from "next";
import { Outfit, Inter } from "next/font/google";
import "./globals.css";
import { BehavioralTracker } from "@/components/BehavioralTracker";
import ExitIntentPopup from "@/components/ExitIntentPopup";
import CookieConsent from "@/components/CookieConsent";
import { SilentErrorBoundary } from "@/components/ErrorBoundary";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "The Biblical Man Hub - Command Center for Biblical Transformation",
  description: "Your complete hub for Biblical content, KJV Bible study, products, counseling, and more. Built for men who lead with Biblical authority.",
  keywords: [
    "biblical masculinity",
    "christian men",
    "biblical manhood",
    "marriage leadership",
    "spiritual warfare",
    "kjv bible",
    "biblical counseling",
    "christian resources",
  ],
  authors: [{ name: "The Biblical Man" }],
  creator: "The Biblical Man",
  publisher: "The Biblical Man",
  openGraph: {
    title: "The Biblical Man Hub - Biblical Transformation for Men",
    description: "Complete Biblical framework for leadership, marriage, and spiritual warfare. Join 20,000+ men who refuse to settle for mediocrity.",
    url: "https://www.thebiblicalmantruth.com",
    siteName: "The Biblical Man",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "The Biblical Man Hub",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "The Biblical Man Hub - Command Center for Biblical Transformation",
    description: "Your complete hub for Biblical content, KJV Bible study, products, and Biblical counseling.",
    images: ["/og-image.jpg"],
    creator: "@thebiblicalman",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Google Analytics 4 - Enhanced Tracking */}
        <script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-FK1SM7ZE9E"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());

              // Default config (basic tracking only)
              gtag('config', 'G-FK1SM7ZE9E', {
                'anonymize_ip': true,
                'allow_ad_personalization_signals': false,
                'allow_google_signals': false
              });

              // Enhanced tracking function (called after consent)
              window.enableEnhancedTracking = function() {
                const hasConsent = localStorage.getItem('enhanced_tracking_enabled') === 'true';
                if (hasConsent) {
                  // Re-configure with enhanced tracking
                  gtag('config', 'G-FK1SM7ZE9E', {
                    'anonymize_ip': false,
                    'allow_ad_personalization_signals': true,
                    'allow_google_signals': true,
                    'send_page_view': true,
                    'custom_map': {
                      'dimension1': 'visitor_id',
                      'dimension2': 'psychographic_type',
                      'dimension3': 'lead_score',
                      'dimension4': 'traffic_source',
                      'dimension5': 'device_type'
                    }
                  });

                  // Track enhanced consent
                  gtag('event', 'enhanced_tracking_enabled', {
                    event_category: 'consent',
                    event_label: 'full_tracking_active'
                  });
                }
              };

              // Auto-enable if already consented
              if (typeof localStorage !== 'undefined' && localStorage.getItem('enhanced_tracking_enabled') === 'true') {
                window.enableEnhancedTracking();
              }
            `,
          }}
        />

        {/* Microsoft Clarity Analytics */}
        <script
          type="text/javascript"
          dangerouslySetInnerHTML={{
            __html: `
              (function(c,l,a,r,i,t,y){
                c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
              })(window, document, "clarity", "script", "u8n8nrd4x3");
            `,
          }}
        />

        {/* Facebook Pixel - Retargeting & Conversion Tracking */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');

              // Only initialize if pixel ID is configured
              const fbPixelId = '${process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID || ''}';
              if (fbPixelId && fbPixelId !== '') {
                fbq('init', fbPixelId);
                fbq('track', 'PageView');
              }
            `,
          }}
        />
        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: 'none' }}
            src={`https://www.facebook.com/tr?id=${process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID || 'PLACEHOLDER'}&ev=PageView&noscript=1`}
            alt=""
          />
        </noscript>

        {/* Google Ads Conversion Tracking & Remarketing */}
        <script
          async
          src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GOOGLE_ADS_ID || 'AW-XXXXXXXXXX'}`}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Initialize Google Ads if configured
              const googleAdsId = '${process.env.NEXT_PUBLIC_GOOGLE_ADS_ID || ''}';
              if (googleAdsId && googleAdsId !== '' && googleAdsId !== 'AW-XXXXXXXXXX') {
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', googleAdsId);

                // Enable remarketing features
                gtag('config', googleAdsId, {
                  'allow_ad_personalization_signals': true
                });
              }
            `,
          }}
        />
      </head>
      <body
        className={`${outfit.variable} ${inter.variable} antialiased font-sans`}
      >
        <SilentErrorBoundary>
          <BehavioralTracker />
        </SilentErrorBoundary>
        {children}
        <SilentErrorBoundary>
          <ExitIntentPopup />
        </SilentErrorBoundary>
        <CookieConsent />
      </body>
    </html>
  );
}
