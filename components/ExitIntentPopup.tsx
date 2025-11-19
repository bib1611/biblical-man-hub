'use client';

import { useState, useEffect } from 'react';
import { X, Mail, ArrowRight } from 'lucide-react';
import { usePersonalization } from '@/hooks/usePersonalization';
import { useAnalytics } from '@/hooks/useAnalytics';

export default function ExitIntentPopup() {
  const [isVisible, setIsVisible] = useState(false);
  const [hasShown, setHasShown] = useState(false);
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  // 🔥 FORM PERSISTENCE: Save email to localStorage on change
  useEffect(() => {
    if (email && email.includes('@')) {
      try {
        localStorage.setItem('exit_intent_email_draft', email);
      } catch (e) {
        // Silent fail if localStorage unavailable
      }
    }
  }, [email]);

  // 🔥 FORM PERSISTENCE: Restore email from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('exit_intent_email_draft');
      if (saved && saved.includes('@')) {
        setEmail(saved);
      }
    } catch (e) {
      // Silent fail if localStorage unavailable
    }
  }, []);

  const { config, profile } = usePersonalization();
  const { trackEmailCapture, trackEvent } = useAnalytics();

  useEffect(() => {
    if (!config?.showExitIntent || hasShown) return;

    let exitIntentTriggered = false;

    const handleMouseLeave = (e: MouseEvent) => {
      // Only trigger if mouse is leaving from the top (not scrolling)
      if (e.clientY <= 0 && !exitIntentTriggered && !hasShown) {
        exitIntentTriggered = true;
        setIsVisible(true);
        setHasShown(true);
        trackEvent('custom', {
          eventName: 'exit_intent_shown',
          leadScore: profile?.leadScore || 0,
          hasEmail: profile?.hasEmail || false,
        });
      }
    };

    // AGGRESSIVE MODE: Show after 3 seconds - TAG AND BAG IMMEDIATELY
    const timer = setTimeout(() => {
      if (!hasShown && !profile?.hasEmail) {
        setIsVisible(true);
        setHasShown(true);
        trackEvent('custom', {
          eventName: 'exit_intent_shown_timer',
          leadScore: profile?.leadScore || 0,
          timeOnSite: profile?.timeOnSite || 0,
        });
      }
    }, 3000); // AGGRESSIVE: 3 seconds to tag and bag

    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      document.removeEventListener('mouseleave', handleMouseLeave);
      clearTimeout(timer);
    };
  }, [config, hasShown, profile, trackEvent]);

  const handleClose = () => {
    setIsVisible(false);
    trackEvent('custom', {
      eventName: 'exit_intent_closed',
      leadScore: profile?.leadScore || 0,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    // 🔥 RETRY LOGIC: Try up to 3 times with exponential backoff
    let attempts = 0;
    const maxAttempts = 3;

    while (attempts < maxAttempts) {
      try {
        const response = await fetch('/api/newsletter/subscribe', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email }),
        });

        if (response.ok) {
          setSubmitStatus('success');
          trackEmailCapture(email);
          trackEvent('custom', {
            eventName: 'exit_intent_converted',
            leadScore: profile?.leadScore || 0,
            offer: config?.exitIntentOffer || 'default',
            attempts: attempts + 1,
          });

          // Clear localStorage on success
          try {
            localStorage.removeItem('exit_intent_email_draft');
          } catch (e) {
            // Silent fail
          }

          setTimeout(() => {
            handleClose();
          }, 3000);
          setIsSubmitting(false);
          return; // Success - exit retry loop
        } else {
          throw new Error('Subscription failed');
        }
      } catch (error) {
        attempts++;
        console.error(`Submission attempt ${attempts} failed:`, error);

        if (attempts >= maxAttempts) {
          // All retries failed
          setSubmitStatus('error');
          // 🔥 BACKUP: Store email locally so we can retry later
          try {
            localStorage.setItem('exit_intent_failed_email', email);
            localStorage.setItem('exit_intent_failed_timestamp', Date.now().toString());
          } catch (e) {
            // Silent fail
          }
          setTimeout(() => setSubmitStatus('idle'), 5000);
        } else {
          // Wait before retry (exponential backoff: 1s, 2s, 4s)
          await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempts) * 1000));
        }
      }
    }

    setIsSubmitting(false);
  };

  if (!isVisible || !config) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative max-w-2xl w-full mx-4 bg-gradient-to-br from-red-950 to-black border-2 border-red-600 rounded-2xl p-8 md:p-12 shadow-2xl animate-in slide-in-from-bottom-4 duration-300">
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors"
        >
          <X className="w-5 h-5 text-white" />
        </button>

        {submitStatus === 'success' ? (
          // Success state
          <div className="text-center py-8">
            <div className="w-20 h-20 mx-auto mb-6 bg-green-600/20 rounded-full flex items-center justify-center border-2 border-green-600">
              <Mail className="w-10 h-10 text-green-500" />
            </div>
            <h3 className="text-3xl font-bold text-white mb-4">
              You're In! 🎉
            </h3>
            <p className="text-xl text-gray-300 mb-2">
              Check your email for your welcome message
            </p>
            <p className="text-sm text-gray-400">
              (Check spam if you don't see it)
            </p>
          </div>
        ) : (
          // Main offer
          <>
            <div className="text-center mb-8">
              <div className="inline-block mb-4">
                <span className="px-4 py-2 bg-red-600/30 border border-red-600 rounded-full text-sm font-bold text-red-300">
                  ⏱️ WAIT! SPECIAL OFFER
                </span>
              </div>
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-4 leading-tight">
                {config.exitIntentOffer}
              </h2>
              <p className="text-lg md:text-xl text-gray-300">
                Join 20,000+ men and women getting Biblical truth delivered weekly.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="max-w-xl mx-auto">
              {submitStatus === 'error' && (
                <div className="mb-4 p-4 bg-red-900/30 border border-red-600/50 rounded-xl text-red-200 text-center">
                  Something went wrong. Please try again.
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="flex-1 px-6 py-4 bg-black/40 border-2 border-red-900/40 rounded-xl text-white text-lg placeholder-gray-500 focus:outline-none focus:border-red-600 transition-colors"
                  required
                  disabled={isSubmitting}
                  autoFocus
                />
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-8 py-4 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 disabled:from-gray-600 disabled:to-gray-700 rounded-xl font-bold transition-all disabled:cursor-not-allowed inline-flex items-center justify-center gap-2"
                >
                  {isSubmitting ? 'Sending...' : 'Get Free Access'}
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>

              <p className="text-center text-sm text-gray-400 mt-4">
                No spam. Unsubscribe anytime. We respect your inbox.
              </p>
            </form>

            <button
              onClick={handleClose}
              className="mt-6 w-full text-center text-sm text-gray-500 hover:text-gray-400 transition-colors"
            >
              No thanks, I'll pass on this opportunity
            </button>
          </>
        )}
      </div>
    </div>
  );
}
