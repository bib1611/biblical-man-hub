'use client';

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

export default function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);
  const [hasConsented, setHasConsented] = useState(false);

  useEffect(() => {
    // Check if user has already consented
    try {
      const consent = localStorage.getItem('cookie_consent');
      const consentTimestamp = localStorage.getItem('cookie_consent_timestamp');

      if (consent === 'accepted' && consentTimestamp) {
        setHasConsented(true);

        // Enable enhanced tracking
        if (typeof window !== 'undefined') {
          (window as any).enableEnhancedTracking?.();
        }
      } else if (consent === 'declined') {
        setHasConsented(true);
      } else {
        // Show banner after 2 seconds
        setTimeout(() => setIsVisible(true), 2000);
      }
    } catch (e) {
      // If localStorage unavailable, show banner
      setTimeout(() => setIsVisible(true), 2000);
    }
  }, []);

  const handleAccept = () => {
    try {
      localStorage.setItem('cookie_consent', 'accepted');
      localStorage.setItem('cookie_consent_timestamp', Date.now().toString());
      localStorage.setItem('enhanced_tracking_enabled', 'true');
    } catch (e) {
      console.error('Failed to save consent:', e);
    }

    setIsVisible(false);
    setHasConsented(true);

    // Enable enhanced tracking immediately
    if (typeof window !== 'undefined') {
      (window as any).enableEnhancedTracking?.();

      // Track consent acceptance
      if ((window as any).gtag) {
        (window as any).gtag('event', 'cookie_consent', {
          consent_action: 'accepted',
          enhanced_tracking: 'enabled',
        });
      }
    }

    // Reload to activate all tracking scripts
    window.location.reload();
  };

  const handleDecline = () => {
    try {
      localStorage.setItem('cookie_consent', 'declined');
      localStorage.setItem('enhanced_tracking_enabled', 'false');
    } catch (e) {
      console.error('Failed to save consent:', e);
    }

    setIsVisible(false);
    setHasConsented(true);

    // Track consent decline (basic tracking only)
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'cookie_consent', {
        consent_action: 'declined',
      });
    }
  };

  if (!isVisible || hasConsented) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[10000] animate-in slide-in-from-bottom duration-500">
      <div className="bg-gradient-to-r from-black via-red-950/40 to-black border-t-2 border-red-600/50 backdrop-blur-xl shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-4 md:py-6">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-6">
            {/* Content */}
            <div className="flex-1">
              <div className="flex items-start gap-3 mb-2">
                <div className="w-8 h-8 bg-red-600/20 rounded-lg flex items-center justify-center border border-red-600/40 flex-shrink-0 mt-1">
                  <span className="text-lg">🍪</span>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white mb-1">
                    We Use Cookies for Better Experience
                  </h3>
                  <p className="text-sm text-gray-300 leading-relaxed">
                    We use cookies and tracking technology to improve your experience, analyze site usage, and provide personalized content.
                    <strong className="text-red-400"> By clicking "Accept", you consent to enhanced behavioral tracking</strong> including:
                  </p>
                  <ul className="text-xs text-gray-400 mt-2 space-y-1 ml-4">
                    <li>• Page views, clicks, and navigation patterns</li>
                    <li>• Time spent on pages and scroll depth</li>
                    <li>• Device information and browser preferences</li>
                    <li>• Referral sources and UTM parameters</li>
                    <li>• Session recordings and heatmaps (anonymous)</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
              <button
                onClick={handleAccept}
                className="px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 rounded-lg font-bold text-white transition-all transform hover:scale-105 shadow-lg"
              >
                Accept All Cookies
              </button>
              <button
                onClick={handleDecline}
                className="px-6 py-3 bg-gray-800/60 hover:bg-gray-800/80 border border-gray-700/50 rounded-lg font-semibold text-gray-300 hover:text-white transition-all"
              >
                Decline
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
