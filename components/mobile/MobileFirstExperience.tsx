'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, ChevronRight, Gift, Zap, Users, TrendingUp, MessageCircle } from 'lucide-react';
import { getAnalytics } from '@/lib/analytics';

export default function MobileFirstExperience() {
  const [showEmailCapture, setShowEmailCapture] = useState(false);
  const [showQuickWin, setShowQuickWin] = useState(false);
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSocialProof, setShowSocialProof] = useState(true);

  useEffect(() => {
    // Check if already captured
    const captured = localStorage.getItem('biblical_man_email_captured');
    if (captured) return;

    // Show quick win offer after 5 seconds
    const quickWinTimer = setTimeout(() => {
      setShowQuickWin(true);
    }, 5000);

    // Show email capture after 15 seconds if not engaged
    const emailTimer = setTimeout(() => {
      setShowEmailCapture(true);
    }, 15000);

    return () => {
      clearTimeout(quickWinTimer);
      clearTimeout(emailTimer);
    };
  }, []);

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const analytics = getAnalytics();
      await analytics.captureEmail(email, undefined, 'mobile_instant_capture');

      localStorage.setItem('biblical_man_email_captured', 'true');

      // Redirect to free resource
      window.location.href = 'https://biblicalman.gumroad.com/l/onboc';
    } catch (error) {
      console.error('Email capture error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* Social Proof Banner - Slides in from top */}
      <AnimatePresence>
        {showSocialProof && (
          <motion.div
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            exit={{ y: -100 }}
            className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-green-900/95 to-emerald-900/95 backdrop-blur-md border-b border-green-600/50 py-3 px-4"
          >
            <div className="flex items-center justify-between max-w-lg mx-auto">
              <div className="flex items-center gap-2">
                <Users size={16} className="text-green-300" />
                <span className="text-sm font-semibold text-white">
                  427 men browsing now
                </span>
              </div>
              <button
                onClick={() => setShowSocialProof(false)}
                className="text-green-300 hover:text-white"
              >
                <X size={16} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Quick Win Offer - Slide up from bottom */}
      <AnimatePresence>
        {showQuickWin && !showEmailCapture && (
          <motion.div
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            exit={{ y: 100 }}
            className="fixed bottom-0 left-0 right-0 z-50 bg-gradient-to-t from-red-900/98 to-red-800/98 backdrop-blur-md border-t border-red-600/50 p-4 shadow-2xl"
          >
            <div className="max-w-lg mx-auto">
              <button
                onClick={() => setShowQuickWin(false)}
                className="absolute top-2 right-2 text-red-300 hover:text-white"
              >
                <X size={20} />
              </button>

              <div className="flex items-start gap-3 mb-3">
                <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <Zap size={24} className="text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-lg mb-1">
                    Get Your Free 7-Day Challenge
                  </h3>
                  <p className="text-red-100 text-sm">
                    The Uncomfortable Christ - 161 men grabbed this today
                  </p>
                </div>
              </div>

              <button
                onClick={() => {
                  setShowQuickWin(false);
                  setShowEmailCapture(true);
                }}
                className="w-full py-3 bg-white text-red-900 font-bold rounded-lg flex items-center justify-center gap-2 active:scale-95 transition-transform"
              >
                Claim Free Guide
                <ChevronRight size={20} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Email Capture - Full Screen Modal */}
      <AnimatePresence>
        {showEmailCapture && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-gradient-to-br from-red-950 via-black to-red-950"
          >
            <div className="h-full flex flex-col items-center justify-center p-6">
              <button
                onClick={() => setShowEmailCapture(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-white"
              >
                <X size={28} />
              </button>

              {/* Icon */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring' }}
                className="w-24 h-24 bg-gradient-to-br from-red-600 to-red-800 rounded-full flex items-center justify-center mb-6"
              >
                <Gift size={48} className="text-white" />
              </motion.div>

              {/* Heading */}
              <motion.h1
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-3xl md:text-4xl font-bold text-center text-white mb-3"
              >
                Get Instant Access
              </motion.h1>

              <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-center text-gray-300 text-lg mb-2"
              >
                Join 5,247 men getting Biblical truth weekly
              </motion.p>

              {/* Value Props */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="w-full max-w-md space-y-3 mb-8"
              >
                <div className="flex items-center gap-3 bg-red-900/30 border border-red-800/50 rounded-lg p-3">
                  <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <Mail size={16} className="text-white" />
                  </div>
                  <span className="text-white font-semibold text-sm">
                    Free 7-day deprogramming challenge
                  </span>
                </div>
                <div className="flex items-center gap-3 bg-red-900/30 border border-red-800/50 rounded-lg p-3">
                  <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <TrendingUp size={16} className="text-white" />
                  </div>
                  <span className="text-white font-semibold text-sm">
                    Weekly unfiltered Biblical truth
                  </span>
                </div>
                <div className="flex items-center gap-3 bg-red-900/30 border border-red-800/50 rounded-lg p-3">
                  <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <MessageCircle size={16} className="text-white" />
                  </div>
                  <span className="text-white font-semibold text-sm">
                    Access to private community
                  </span>
                </div>
              </motion.div>

              {/* Form */}
              <motion.form
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6 }}
                onSubmit={handleEmailSubmit}
                className="w-full max-w-md"
              >
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  className="w-full px-6 py-4 bg-white/10 border-2 border-white/20 rounded-xl text-white placeholder-gray-400 text-lg mb-4 focus:outline-none focus:border-red-500 transition-colors"
                />

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 disabled:from-gray-600 disabled:to-gray-700 rounded-xl font-bold text-white text-lg transition-all disabled:cursor-not-allowed active:scale-95 shadow-lg shadow-red-900/50"
                >
                  {isSubmitting ? 'Sending...' : 'Get Instant Access →'}
                </button>
              </motion.form>

              <p className="text-center text-xs text-gray-500 mt-4">
                Unsubscribe anytime. No spam. Ever.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
