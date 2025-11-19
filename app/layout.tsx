import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { BehavioralTracker } from "@/components/BehavioralTracker";
import ExitIntentPopup from "@/components/ExitIntentPopup";
import CookieConsent from "@/components/CookieConsent";
import { SilentErrorBoundary } from "@/components/ErrorBoundary";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "The Biblical Man Hub - Command Center for Biblical Transformation",
  description: "Your complete hub for Biblical content, KJV Bible study, products, counseling, and more. Built for men who lead.",
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
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
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
